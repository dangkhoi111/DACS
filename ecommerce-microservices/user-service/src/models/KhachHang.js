// models/khachHangModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const KhachHangSchema = new Schema({
  hoTen:   { type: String, required: true },
  email:   { type: String, required: true, unique: true },
  matKhau: { type: String, required: true },
  sdt:     { type: String },
  diaChi:  { type: String }
}, { timestamps: true });

module.exports = mongoose.model('KhachHang', KhachHangSchema);