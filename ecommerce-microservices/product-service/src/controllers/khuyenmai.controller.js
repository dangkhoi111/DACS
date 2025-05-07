const KhuyenMai = require('./../models/sale.model');

// Tạo khuyến mãi
exports.create = async (req, res) => {
  try {
    const newKM = await KhuyenMai.create(req.body);
    res.status(201).json(newKM);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy tất cả khuyến mãi đã phân loại và định dạng sẵn
exports.getAll = async (req, res) => {
  try {
    if (!req.user.userBanId) {
      return res.status(403).json({ message: 'Bạn phải là người bán để xem ma giam gia' });
    }

    const all = await KhuyenMai.find({maUserBan: req.user.userBanId}).lean();
    const today = new Date();

    const active = [];
    const expired = [];

    all.forEach(km => {
      // Phân loại
      if (new Date(km.ngayKetThuc) >= today) active.push(km);
      else expired.push(km);
    });

    // Định dạng trường để frontend chỉ render
    const formatDate = d => new Date(d).toLocaleDateString('vi-VN');
    const formatCurrency = v => Number(v).toLocaleString('vi-VN') + ' VNĐ';

    const transform = km => ({
      id: km._id,
      maUserBan: km.maUserBan,
      tenKM: km.tenKM,
      ma: km.ma,
      displayDiscount: km.loaiGiamGia === 'phanTram'
        ? `Giảm ${km.giaTriGiam}%`
        : `Giảm ${formatCurrency(km.giaTriGiam)}`,
      period: `${formatDate(km.ngayBatDau)} – ${formatDate(km.ngayKetThuc)}`,
      donHangToiThieu: km.donHangToiThieu ? formatCurrency(km.donHangToiThieu) : '0 VNĐ'
    });

    res.json({
      active: active.map(transform),
      expired: expired.map(transform)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Lấy chi tiết khuyến mãi theo ID
exports.getOne = async (req, res) => { // <-- Thêm controller này
  try {
    const km = await KhuyenMai.findById(req.params.id);
    if (!km) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
    res.json(km);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật khuyến mãi
exports.update = async (req, res) => {
  try {
    const updated = await KhuyenMai.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xoá khuyến mãi
exports.delete = async (req, res) => {
  try {
    const deleted = await KhuyenMai.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
    res.json({ message: 'Đã xoá khuyến mãi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy khuyến mãi đang hoạt động
exports.getActive = async (req, res) => {
  try {
      if (!req.user.userBanId) {
        return res.status(403).json({ message: 'Bạn phải là người bán để xem ma giam gia' });
      }

    const all = await KhuyenMai.find({maUserBan: req.user.userBanId}).lean();  // Dữ liệu trả về là thuần JSON
    const today = new Date();

    // Lọc các khuyến mãi còn hiệu lực
    const active = all.filter(km => new Date(km.ngayKetThuc) >= today);

    // Định dạng các khuyến mãi
    const formatDate = d => new Date(d).toLocaleDateString('vi-VN');
    const formatCurrency = v => Number(v).toLocaleString('vi-VN') + ' VNĐ';

    const transform = km => ({
      _id: km._id,  // Sử dụng _id thay vì id
      maUserBan: km.maUserBan,
      tenKM: km.tenKM,
      ma: km.ma,
      loaiGiamGia: km.loaiGiamGia,
      giaTriGiam: km.giaTriGiam,
      displayDiscount: km.loaiGiamGia === 'phanTram'
        ? `Giảm ${km.giaTriGiam}%`
        : `Giảm ${formatCurrency(km.giaTriGiam)}`,
      period: `${formatDate(km.ngayBatDau)} – ${formatDate(km.ngayKetThuc)}`,
      donHangToiThieu: km.donHangToiThieu ? formatCurrency(km.donHangToiThieu) : '0 VNĐ'
    });

    // Trả dữ liệu dưới dạng JSON
    res.json(active.map(transform));

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

