const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/category.controller');

router.get('/danhmucs', ctrl.getAll);
router.post('/danhmucs', ctrl.create);

module.exports = router;