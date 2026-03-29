const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', require('./modules/auth/auth.routes'));

module.exports = app;