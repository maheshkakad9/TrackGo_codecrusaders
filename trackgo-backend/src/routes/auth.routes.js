const router = require('express').Router();
const controller = require('../modules/auth/auth.controller.js');

router.post('/signup', controller.signup);
router.post('/login', controller.login);

module.exports = router;