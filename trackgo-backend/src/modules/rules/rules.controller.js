const pool = require('../../config/db');

exports.createRule = async (req, res) => {
  try {
    const { type, threshold_percentage, specific_approver_id } = req.body;

    const rule = await pool.query(
      `INSERT INTO approval_rules 
       (company_id, type, threshold_percentage, specific_approver_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.company_id, type, threshold_percentage, specific_approver_id]
    );

    res.json(rule.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};