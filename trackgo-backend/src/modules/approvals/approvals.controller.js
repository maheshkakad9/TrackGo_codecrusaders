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

    // If any rejected → reject expense
    if (approvals.some(a => a.status === 'rejected')) {
      await pool.query(
        `UPDATE expenses SET status='rejected' WHERE id=$1`,
        [expenseId]
      );
      return res.json({ message: 'Expense rejected' });
    }

    // If all approved → approve expense
    if (approvals.every(a => a.status === 'approved')) {
      await pool.query(
        `UPDATE expenses SET status='approved' WHERE id=$1`,
        [expenseId]
      );
      return res.json({ message: 'Expense approved fully' });
    }

    res.json({ message: 'Approval updated' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};