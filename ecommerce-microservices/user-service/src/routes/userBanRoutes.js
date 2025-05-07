// src/routes/userBanRoutes.js
const express = require('express');
const router = express.Router();
const { register,check,checkSeller } = require('../controllers/userBanController');
const { checkAuth } = require('../middleware/checkAuth');

// Khách hàng đã login xong → upgrade thành người bán
router.post('/register', checkAuth, register);
router.get('/:id',check);
router.get('/check/:id',checkSeller);
module.exports = router;
