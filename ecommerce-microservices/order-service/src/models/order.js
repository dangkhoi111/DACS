const mongoose = require('mongoose');  
const OrderSchema = new mongoose.Schema({
  NgayLap: { type: Date, default: Date.now },      
  TongTien: { type: Number, required: true },
  TrangThai: { type: String, default: 'Chờ xử lý' },
  MaKH: { type: String, required: true },
  MaVC: { type: String, default: null },
  PhuongThucGiaoHang: { type: String, default: 'COD' },
});

module.exports = mongoose.model("Order", OrderSchema);
