const ShippingOption = require('./../models/shipping');
const ShippingHistory = require('./../models/shippinghistory');

const createShippingHistory = async (MaOrder, MaVC, GhiChu) => {
  try {
    const newShippingHistory = new ShippingHistory({
      MaOrder,
      MaVC,
      GhiChu,
    });

    const savedShippingHistory = await newShippingHistory.save();
    return savedShippingHistory;
  } catch (err) {
    throw new Error("Lỗi khi tạo lịch sử giao hàng: " + err.message);
  }
};

const getShippingOptions = async (req, res) => {
  try {
    const shippingOptions = await ShippingOption.find();
    res.json(shippingOptions);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin đơn vị vận chuyển." });
  }
};

module.exports = {
  createShippingHistory,
  getShippingOptions,
};
