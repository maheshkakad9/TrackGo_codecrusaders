const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const controller = require('../modules/users/users.controller');

router.post('/', auth, controller.createUser);
router.get('/', auth, controller.getUsers);
router.patch('/:id', auth, controller.updateUser);

module.exports = router;