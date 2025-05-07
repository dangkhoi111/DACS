const mongoose = require('mongoose');

const khuyenMaiSchema = new mongoose.Schema({
  tenKM: { type: String, required: true },  
  maUserBan: { type: mongoose.Schema.Types.ObjectId, ref: 'UserBan', required: true },  
  loaiGiamGia: { type: String, enum: ['phanTram', 'soTien'], required: true }, 
  giaTriGiam: { type: Number, required: true },  
  ngayBatDau: { type: Date, required: true },  
  ngayKetThuc: { type: Date, required: true },  
  donHangToiThieu: { type: Number, default: 0 },  
  ma: { type: String, required: true, unique: true },
}, {
  timestamps: true,  
});

module.exports = mongoose.model('KhuyenMai', khuyenMaiSchema);
