const express = require('express');
const mongoose = require('mongoose');
const orderItemRoutes = require('./src/routes/orderitem');
const orderRoutes = require('./src/routes/order');
const cors = require('cors');

const app = express();
app.use(express.json());  // Middleware để xử lý JSON body
app.use(cors());
// Kết nối với MongoDB
mongoose.connect('mongodb://localhost:27017/order-db')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Sử dụng routes
app.use('/api/orderitems', orderItemRoutes);
app.use('/api/orders', orderRoutes);
// Khởi chạy server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
