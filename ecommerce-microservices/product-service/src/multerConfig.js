const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Đảm bảo thư mục 'uploads/' đã tồn tại
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Tạo tên file duy nhất
  }
});

// Export middleware upload
const upload = multer({ storage });
module.exports = upload;
