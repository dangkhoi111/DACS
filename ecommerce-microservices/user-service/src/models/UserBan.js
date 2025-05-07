const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserBanSchema = new Schema({
  tenShop:   { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  sdt:       { type: String },
  diaChi:    { type: String },
  
  maKH:      { type: Schema.Types.ObjectId, ref: 'KhachHang', required: true }
}, { timestamps: true });

module.exports = mongoose.model('UserBan', UserBanSchema);