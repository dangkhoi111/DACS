const Order = require('./../models/order');
const OrderItem =require('./../models/orderItem');
const axios = require('axios');
// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { TongTien, TrangThai, MaKH, MaVC, PhuongThucGiaoHang, items, thanhToan } = req.body;

    // Tạo đơn hàng
    const order = await Order.create({
      NgayLap: Date.now(),
      TongTien,
      TrangThai,
      MaKH,
      MaVC,
      PhuongThucGiaoHang
    });

    // Tạo các item trong đơn hàng
    const itemsToCreate = items.map(item => ({
      ...item,
      MaOrder: order._id.toString()
    }));
    await OrderItem.insertMany(itemsToCreate);

    // Gửi yêu cầu tạo thanh toán đến payment-service
    const paymentResponse = await axios.post('http://localhost:3005/api/payment', {
      maOrder: order._id.toString(),
      method: thanhToan.PhuongThuc,
      status: thanhToan.TrangThai
    });

    if (paymentResponse.status === 201) {
      // Thanh toán thành công
      res.status(201).json({ message: 'Tạo đơn hàng và thanh toán thành công', orderId: order._id });
    } else {
      // Nếu API thanh toán không thành công
      res.status(400).json({ message: 'Tạo thanh toán thất bại' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật đơn hàng theo ID
exports.updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xoá đơn hàng theo ID
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy" });
    res.json({ message: "Đã xoá thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
