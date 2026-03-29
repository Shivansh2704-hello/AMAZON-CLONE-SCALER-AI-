const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/cartController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeCartItem);

module.exports = router;
