const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', customerController.addCustomer);
router.get('/', customerController.getCustomers);
router.get('/stats', customerController.getCustomerStats);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.put('/:id/status', customerController.updateStatus);
router.get('/:id/pdf', customerController.generatePDF);

module.exports = router;
