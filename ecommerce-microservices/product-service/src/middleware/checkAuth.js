const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // 'Bearer token'
  
  if (!token) {
    return res.status(401).json({ message: 'Không có token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify đúng SECRET
    
    req.user = decoded; // Gán thông tin user vào req.user
    next();
  } catch (err) {
    console.error('JWT lỗi:', err);
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

exports.checkRole = (roles) => {
  if (!Array.isArray(roles)) {
    throw new Error('❌ checkRole cần truyền vào một mảng roles, ví dụ: checkRole(["seller"])');
  }
  
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không đủ quyền truy cập' });
    }
    next();
  };
};
