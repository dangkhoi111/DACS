const jwt = require('jsonwebtoken');

module.exports.checkAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Không có token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);  // Debug output
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
