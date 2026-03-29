const pool = require("../../config/db");
const { sendPasswordEmail } = require("../../utils/mailer");
const { generatePassword } = require("../../utils/generatePassword");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, manager_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, manager_id, company_id)
   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, hashedPassword, role, manager_id, req.user.company_id],
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
      [req.user.company_id],
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
      [role, manager_id, req.params.id],
    );

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendPassword = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user
    const userRes = await pool.query(`SELECT * FROM users WHERE id=$1`, [
      userId,
    ]);

    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate password
    const plainPassword = generatePassword();

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Update DB
    await pool.query(`UPDATE users SET password=$1 WHERE id=$2`, [
      hashedPassword,
      userId,
    ]);

    // Send email
    await sendPasswordEmail(user.email, plainPassword);

    res.json({ message: "Password sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const statsRes = await pool.query(
      `SELECT
         COUNT(*) AS total_users,
         SUM(CASE WHEN role='manager' THEN 1 ELSE 0 END) AS total_managers,
         SUM(CASE WHEN role='employee' THEN 1 ELSE 0 END) AS total_employees
       FROM users
       WHERE company_id=$1`,
      [req.user.company_id]
    );

    const row = statsRes.rows[0] || { total_users: 0, total_managers: 0, total_employees: 0 };
    res.json({
      totalUsers: Number(row.total_users),
      totalManagers: Number(row.total_managers),
      totalEmployees: Number(row.total_employees),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
