const DanhMuc = require('../models/category.model');

exports.getAll = async (req, res) => {
  const list = await DanhMuc.find();
  res.json(list);
};

exports.create = async (req, res) => {
  const cat = await DanhMuc.create(req.body);
  res.status(201).json(cat);
};