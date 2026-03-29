const router = require('express').Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../modules/expenses/expense.controller");

router.post('/',auth,controller.createExpense);

module.exports = router;