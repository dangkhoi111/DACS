
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/product.controller');
const upload = require('../multerConfig');
const { checkAuth,checkRole } = require('../middleware/checkAuth');

router.post('/sanphams',checkAuth,checkRole(['seller']),upload.single('hinhAnh'), ctrl.create);
router.get('/sanphams',checkAuth,checkRole(['seller']), ctrl.getAll);
router.get('/sanphams/:id',ctrl.getOne);
router.put('/sanphams/:id',checkAuth,checkRole(['seller']),upload.single('hinhAnh') ,ctrl.update);
router.delete('/sanphams/:id',checkAuth,checkRole(['seller']), ctrl.delete);
router.get('/sanphams/danhmuc/:id',ctrl.getSpDm);
module.exports = router;