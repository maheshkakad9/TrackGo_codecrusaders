const pool = require('../../config/db');

exports.createRule = async (req, res) => {
  try {
    const {
      name,
      is_sequence,
      min_approval_percentage,
      manager_first,
      approvers
    } = req.body;

    // Create Config 
     const config = await pool.query(
      `INSERT INTO approval_configs 
       (company_id, name, is_sequence, min_approval_percentage, manager_first)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        req.user.company_id,
        name,
        is_sequence,
        min_approval_percentage,
        manager_first
      ]
    );

    const configId = config.rows[0].id;

    for (let i = 0; i < approvers.length; i++) {
      const a = approvers[i];

      await pool.query(
        `INSERT INTO config_approvers 
         (config_id, approver_id, step_order, is_required)
         VALUES ($1, $2, $3, $4)`,
        [configId, a.user_id, i + 1, a.is_required]
      );
    }


    res.json({ message: "Rule created", config: config.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};