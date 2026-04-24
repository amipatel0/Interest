const express = require('express');
const router = express.Router({ mergeParams: true });
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', paymentController.addPayment);
router.get('/', paymentController.getPayments);

module.exports = router;
