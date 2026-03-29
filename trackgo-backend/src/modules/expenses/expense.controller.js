const pool = require('../../config/db');

exports.createExpense = async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;

    // Create expense
    const result = await pool.query(
      `INSERT INTO expenses 
       (user_id, amount, currency, converted_amount, category, description, date)
       VALUES ($1, $2, $3, $2, $4, $5, $6)
       RETURNING *`,
      [req.user.id, amount, currency, category, description, date]
    );

    const expense = result.rows[0];
    const expenseId = expense.rows[0].id;

    // Get approval config 
    const configRes = await pool.query(
      `SELECT * FROM approval_configs WHERE company_id=$1 LIMIT 1`,
      [req.user.company_id]
    );

    if (configRes.rows.length === 0) {
      return res.json({ message: "Expense created (no approval config)", expense });
    }

    const config = configRes.rows[0];

    // Get approvers
    const approversRes = await pool.query(
      `SELECT * FROM config_approvers WHERE config_id=$1 ORDER BY step_order`,
      [config.id]
    );

    const approvers = approversRes.rows;

    // Manager-first logic
    if (config.manager_first && req.user.manager_id) {
      await pool.query(
        `INSERT INTO approvals (expense_id, approver_id, step_order, status)
         VALUES ($1, $2, 0, 'pending')`,
        [expenseId, req.user.manager_id]
      );
    }

    // Insert approvers
    for (let a of approvers) {
      let status = config.is_sequence ? 'waiting' : 'pending';

      await pool.query(
        `INSERT INTO approvals (expense_id, approver_id, step_order, status)
         VALUES ($1, $2, $3, $4)`,
        [expenseId, a.approver_id, a.step_order, status]
      );
    }

    // Activate first step of sequence 
    if (config.is_sequence) {
      await pool.query(
        `UPDATE approvals SET status='pending'
         WHERE expense_id=$1 AND step_order=1`,
        [expenseId]
      );
    }


     res.json({ message: "Expense created with approval config", expense });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};