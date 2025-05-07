const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng ký khách hàng
router.post('/register', authController.register);

// Đăng nhập khách hàng (customer/seller đều dùng chung)
router.post('/login', authController.login);

module.exports = router;
