const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const controller = require('../modules/approvals/approvals.controller');

router.get('/pending', auth, controller.getPendingApprovals);
router.get('/all/pending', auth, controller.getAllPendingApprovals);
router.patch('/:id', auth, controller.updateApproval);

module.exports = router;
