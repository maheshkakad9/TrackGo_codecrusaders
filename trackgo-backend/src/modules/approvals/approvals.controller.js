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
    const approval = await pool.query(
      `UPDATE approvals SET status=$1, comment=$2 WHERE id=$3 RETURNING *`,
      [status, comment, approvalId]
    );

    const expenseId = approval.rows[0].expense_id;

    // Check all approvals for this expense
    const allApprovals = await pool.query(
      `SELECT * FROM approvals WHERE expense_id = $1`,
      [expenseId]
    );

    const approvals = allApprovals.rows;

    // Get company rule
    const rule = await pool.query(
      `SELECT * FROM approval_rules WHERE company_id = $1 LIMIT 1`,
      [req.user.company_id]
    );

    const ruleData = rule.rows[0];

    // If any rejected → reject expense
    if (approvals.some(a => a.status === 'rejected')) {
      await pool.query(
        `UPDATE expenses SET status='rejected' WHERE id=$1`,
        [expenseId]
      );
      return res.json({ message: 'Expense rejected' });
    }

    let approvedCount = approvals.filter(a => a.status === 'approved').length;
    let total = approvals.length;
    
    // RULE: SPECIFIC APPROVER
    if (ruleData?.type === 'specific' || ruleData?.type === 'hybrid') {
      const specificApproved = approvals.find(
        a => a.approver_id === ruleData.specific_approver_id && a.status === 'approved'
      );

      if (specificApproved) {
        await pool.query(
          `UPDATE expenses SET status='approved' WHERE id=$1`,
          [expenseId]
        );
        return res.json({ message: 'Approved by specific approver rule' });
      }
    }

    // RULE: PERCENTAGE
    
    if (ruleData?.type === 'specific' || ruleData?.type === 'hybrid') {
      const specificApproved = approvals.find(
        a => a.approver_id === ruleData.specific_approver_id && a.status === 'approved'
      );

      if (specificApproved) {
        await pool.query(
          `UPDATE expenses SET status='approved' WHERE id=$1`,
          [expenseId]
        );
        return res.json({ message: 'Approved by specific approver rule' });
      }
    }


    // fallback: all approved
    if (approvedCount === total) {
      await pool.query(
        `UPDATE expenses SET status='approved' WHERE id=$1`,
        [expenseId]
      );
      return res.json({ message: 'Fully approved' });
    }

    res.json({ message: 'Approval updated (waiting for others)' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};