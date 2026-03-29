const pool = require('../../config/db');

exports.createExpense = async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;

    const result = await pool.query(
      `INSERT INTO expenses 
       (user_id, amount, currency, converted_amount, category, description, date)
       VALUES ($1, $2, $3, $2, $4, $5, $6)
       RETURNING *`,
      [req.user.id, amount, currency, category, description, date]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};