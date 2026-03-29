const express = require('express');
const router = express.Router();
const { placeOrder, getOrderById, getUserOrders } = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', placeOrder);
router.get('/user/me', getUserOrders);
router.get('/:id', getOrderById);

module.exports = router;
