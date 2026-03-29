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

    const expenseId = expense.rows[0].id;

    // Get approval flow
    const flow = await pool.query(
      `SELECT * FROM approval_flow WHERE company_id = $1 ORDER BY step_order`,
      [req.user.company_id]
    );

    // Create approval entries
    for (let step of flow.rows) {
      const users = await pool.query(
        `SELECT id FROM users WHERE role = $1 AND company_id = $2`,
        [step.approver_role, req.user.company_id]
      );

      for (let user of users.rows) {
        await pool.query(
          `INSERT INTO approvals (expense_id, approver_id, step_order)
           VALUES ($1, $2, $3)`,
          [expenseId, user.id, step.step_order]
        );
      }
    }


    res.json({ message: 'Expense created with approval flow', expense });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};