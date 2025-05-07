const UserBan = require('./../models/userBan');
const KhachHang = require('./../models/khachHang');

exports.register = async (req, res) => {
  try {
    const { tenShop } = req.body;
    const maKH = req.user.id; // Lấy thông tin user từ JWT token (khách hàng đã đăng nhập)

    // Kiểm tra xem khách hàng đã tồn tại chưa
    const customer = await KhachHang.findById(maKH);
    if (!customer) {
      return res.status(400).json({ success: false, message: 'Khách hàng không tồn tại!' });
    }

    // Tạo người bán
    const newSeller = new UserBan({
      tenShop,
      maKH,
      email: customer.email, // Sử dụng email từ khách hàng
      sdt: customer.sdt, // Sử dụng số điện thoại từ khách hàng
      diaChi: customer.diaChi // Sử dụng địa chỉ từ khách hàng
    });

    // Lưu người bán vào DB
    await newSeller.save();
    res.status(201).json({ success: true, message: 'Đăng ký người bán thành công!', seller: newSeller });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.check=async(req,res)=>{
  try {
    const customerId = req.params.id; 
   
    const userBan = await UserBan.findOne({ maKH : customerId });
    if (!userBan) {
      return res.status(404).json({ message: 'Người bán không tìm thấy!' });
    }
    res.status(200).json({
      message: 'Tìm thấy người bán!',
      userBanId: userBan._id, 
    });
  } catch (error) {
    console.error('Lỗi khi kiểm tra người bán:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra người bán!' });
  }
};

exports.checkSeller=async(req,res)=>{
  try {
    const sellerId = req.params.id; 
   
    const userBan = await UserBan.findById( sellerId );
    res.status(200).json({
      message: 'Tìm thấy người bán!',
      tenShop: userBan.tenShop, 
    });
  } catch (error) {
    console.error('Lỗi khi kiểm tra người bán:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra người bán!' });
  }
}