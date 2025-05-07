const express = require('express');
const router = express.Router();
const khuyenMaiController = require('../controllers/khuyenmai.controller');
const { checkAuth,checkRole } = require('../middleware/checkAuth');
// POST: Tạo khuyến mãi
router.post('/khuyenmai', khuyenMaiController.create);

// GET: Lấy danh sách khuyến mãi (nếu cần)
router.get('/khuyenmai/active',checkAuth,checkRole(['seller']), khuyenMaiController.getActive);
router.get('/khuyenmai',checkAuth,checkRole(['seller']), khuyenMaiController.getAll);
router.put('/khuyenmai/:id',checkAuth,checkRole(['seller']), khuyenMaiController.update);  
router.get('/khuyenmai/:id',checkAuth,checkRole(['seller']), khuyenMaiController.getOne); 
router.delete('/khuyenmai/:id',checkAuth,checkRole(['seller']), khuyenMaiController.delete);

module.exports = router;
