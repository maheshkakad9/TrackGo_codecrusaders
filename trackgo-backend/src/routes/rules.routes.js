const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const controller = require('../modules/rules/rules.controller');

router.get('/', auth, controller.getRules);
router.post('/', auth, controller.createRule);

module.exports = router;