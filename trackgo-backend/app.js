const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
//Authentication Routes
app.use('/api/auth', require('./src/routes/auth.routes.js'));

//Expenses Routes
app.use('/api/expenses', require('./src/routes/expense.routes.js'));


module.exports = app;