const pool = require('../../config/db');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, manager_id } = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, manager_id, company_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, password, role, manager_id, req.user.company_id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT id, name, email, role, manager_id FROM users WHERE company_id = $1`,
      [req.user.company_id]
    );

    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { role, manager_id } = req.body;

    const updated = await pool.query(
      `UPDATE users SET role=$1, manager_id=$2 WHERE id=$3 RETURNING *`,
      [role, manager_id, req.params.id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};