const SanPham = require('../models/product.model');
const axios = require('axios');
exports.getAll = async (req, res) => {
  try {
    if (!req.user.userBanId) {
      return res.status(403).json({ message: 'Bạn phải là người bán để xem sản phẩm' });
    }
    
    const items = await SanPham.find({maUserBan: req.user.userBanId})
      .populate('maDM', 'tenDM') // tên danh mục
      .populate('maKM', 'ma loaiGiamGia giaTriGiam') // khuyến mãi
      

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const item = await SanPham.findById(req.params.id)
      .populate('maDM', 'tenDM')
      .populate('maKM', 'ma loaiGiamGia giaTriGiam')
      
      

    if (!item) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
      
      const userId = item.maUserBan;
      const userResponse = await axios.get(`http://localhost:3002/api/user-ban/check/${userId}`);
      const userInfo = userResponse.data;

      const result = {
        ...item.toObject(),
        tenShop: userInfo.tenShop
      };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm' });
  }
};

exports.create = async (req, res) => {
  const { tenSP, giaGoc, soLuong, moTa, maDM, maUserBan, maKM, giaGiam } = req.body;

  // Log để debug dữ liệu gửi lên
  console.log(req.body);

  // Kiểm tra maKM, nếu là chuỗi "null" thì gán giá trị null thực sự
  const validMaKM = maKM === "null" ? null : maKM;

  // Chuyển các giá trị chuỗi sang số (nếu có thể)
  const doc = {
    tenSP,
    giaGoc: Number(giaGoc),      // Chuyển giaGoc thành số
    soLuong: Number(soLuong),    // Chuyển soLuong thành số
    moTa,
    maDM,
    maUserBan,                  // Đảm bảo maUserBan có giá trị hợp lệ
    maKM: validMaKM,            // Gán maKM đã được kiểm tra và xử lý
    giaGiam: Number(giaGiam),    // Chuyển giaGiam thành số
  };

  // Nếu có file hình ảnh, lưu lại đường dẫn
  if (req.file) doc.hinhAnh = `/uploads/${req.file.filename}`;

  try {
    const sp = await SanPham.create(doc);
    res.status(201).json(sp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm', error: err.message });
  }
};



exports.update = async (req, res) => {
  try {
    const { tenSP, giaGoc, soLuong, moTa, maDM, maUserBan, maKM, giaGiam } = req.body;

    // Kiểm tra maKM
    const validMaKM = maKM === "null" || maKM === "" ? null : maKM;

    const updateDoc = {
      tenSP,
      giaGoc: Number(giaGoc),
      soLuong: Number(soLuong),
      moTa,
      maDM,
      maUserBan,
      maKM: validMaKM,
      giaGiam: Number(giaGiam),
    };

    // Nếu có file hình ảnh mới
    if (req.file) {
      updateDoc.hinhAnh = `/uploads/${req.file.filename}`;
    }

    const sp = await SanPham.findByIdAndUpdate(req.params.id, updateDoc, { new: true });

    if (!sp) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
    }

    res.json(sp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: err.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const sanpham = await SanPham.findByIdAndDelete(req.params.id);

    if (!sanpham) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
    }

    return res.status(200).json({ message: 'Sản phẩm đã bị xóa' });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: err.message });
  }
};

exports.getSpDm = async (req,res) => {
  const danhMucId = req.params.id;
  const products = await SanPham.find({ maDM: danhMucId });
  res.json(products);
};
