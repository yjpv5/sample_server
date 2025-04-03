const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db.js');
const userRoutes = require('./controllers/userRouter.js');


// 环境变量配置
dotenv.config();

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
connectDB();

// 路由配置
app.use('/api/auth', userRoutes);
// app.use('/api/resources', resourceRoutes);
app.get('/', async (req, res) => {
  res.status(200).send({
    message: "server connected"
  })
})
// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;