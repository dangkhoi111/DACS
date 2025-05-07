const jwt = require('jsonwebtoken');
const KhachHang = require('./../models/khachHang');
const UserBan = require('./../models/userBan');
const axios = require("axios");

exports.register = async (req, res) => {
  try {
    const { hoTen, email, matKhau, sdt, diaChi } = req.body;

    const existingUser = await KhachHang.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const newUser = await KhachHang.create({ hoTen, email, matKhau, sdt, diaChi });


 await axios.post("http://localhost:3003/api/cart", {
  maKH: newUser._id,
});

    res.status(201).json({ success: true, message: 'Đăng ký thành công', data: newUser });
  } catch (err) {
    console.error('Đăng ký lỗi:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, matKhau } = req.body;
  
      const user = await KhachHang.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Email không tồn tại' });
      }
  
      const isMatch = user.matKhau === matKhau; // Nếu hash mật khẩu thì dùng bcrypt.compare
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Sai mật khẩu' });
      }
  
      // Kiểm tra có phải Người Bán không
      const isSeller = await UserBan.findOne({ maKH: user._id });
  
      const payload = {
        id: user._id,
        hoTen : user.hoTen,
        email: user.email,
        role: isSeller ? 'seller' : 'customer' ,
        userBanId: isSeller ? isSeller._id : null
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      res.status(200).json({
        success: true,
        token,
        user: 
        {
          id: user._id,
          hoTen : user.hoTen,
          email: user.email,
          role: isSeller ? 'seller' : 'customer',
          userBanId: isSeller ? isSeller._id : null
        }
        
      });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  };