const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, companyName, currency } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company
    const company = await pool.query(
      'INSERT INTO company (name, default_currency) VALUES ($1, $2) RETURNING *',
      [companyName, currency]
    );

    // Create admin user
    const user = await pool.query(
      `INSERT INTO users (name, email, password, role, company_id)
       VALUES ($1, $2, $3, 'admin', $4) RETURNING *`,
      [name, email, hashedPassword, company.rows[0].id]
    );

    res.json({ message: 'Signup successful', user: user.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, 
        role: user.rows[0].role,
        company_id: user.rows[0].company_id
     },
      process.env.JWT_SECRET
    );

    res.json({ token, user: user.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};