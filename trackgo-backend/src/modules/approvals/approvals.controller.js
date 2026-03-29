const pool = require('../../config/db');

exports.getPendingApprovals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, e.amount, e.category, e.description
       FROM approvals a
       JOIN expenses e ON a.expense_id = e.id
       WHERE a.approver_id = $1 AND a.status = 'pending'`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateApproval = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const approvalId = req.params.id;

    // Update approval
    const approvalRes = await pool.query(
      `UPDATE approvals SET status=$1, comment=$2 WHERE id=$3 RETURNING *`,
      [status, comment, approvalId]
    );

    const approval = approvalRes.rows[0];
    const expenseId = approval.expense_id;

    // Get all approvals
    const allApprovalsRes = await pool.query(
      `SELECT * FROM approvals WHERE expense_id=$1`,
      [expenseId]
    );

    const approvals = allApprovalsRes.rows;

    // Get config
    const configRes = await pool.query(
      `SELECT * FROM approval_configs WHERE company_id=$1 LIMIT 1`,
      [req.user.company_id]
    );

    const config = configRes.rows[0];

    // Get approver config
    const approverConfigRes = await pool.query(
      `SELECT * FROM config_approvers WHERE config_id=$1`,
      [config.id]
    );

    const approverConfig = approverConfigRes.rows;

    // REQUIRED APPROVER CHECK
    for (let reqA of approverConfig.filter(a => a.is_required)) {
      const found = approvals.find(a => a.approver_id === reqA.approver_id);

      if (found?.status === 'rejected') {
        await pool.query(
          `UPDATE expenses SET status='rejected' WHERE id=$1`,
          [expenseId]
        );
        return res.json({ message: "Rejected by required approver" });
      }
    }

    // ANY REJECT → reject
    if (approvals.some(a => a.status === 'rejected')) {
      await pool.query(
        `UPDATE expenses SET status='rejected' WHERE id=$1`,
        [expenseId]
      );
      return res.json({ message: "Expense rejected" });
    }

    // SEQUENCE LOGIC
    if (config.is_sequence && status === 'approved') {
      const nextStep = approval.step_order + 1;

      await pool.query(
        `UPDATE approvals SET status='pending'
         WHERE expense_id=$1 AND step_order=$2`,
        [expenseId, nextStep]
      );
    }

    // SPECIFIC APPROVER RULE (CFO)
    if (config.specific_approver_id) {
        const specificApproved = approvals.find(
            a =>
                a.approver_id === config.specific_approver_id &&
                a.status === 'approved'
        );

    if (specificApproved) {
        await pool.query(
            `UPDATE expenses SET status='approved' WHERE id=$1`,
            [expenseId]
        );
        return res.json({ message: "Approved by specific approver (CFO)" });
      }
    }

    // PERCENTAGE RULE
    let approvedCount = approvals.filter(a => a.status === 'approved').length;
    let total = approvals.length;

    let percent = (approvedCount / total) * 100;

    if (percent >= config.min_approval_percentage) {
      await pool.query(
        `UPDATE expenses SET status='approved' WHERE id=$1`,
        [expenseId]
      );
      return res.json({ message: "Approved by percentage rule" });
    }

    // FINAL CHECK
    if (approvals.every(a => a.status === 'approved')) {
      await pool.query(
        `UPDATE expenses SET status='approved' WHERE id=$1`,
        [expenseId]
      );
      return res.json({ message: "Fully approved" });
    }

    res.json({ message: "Approval updated, waiting..." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};