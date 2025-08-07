const express = require('express');    
const cors = require('cors');          
const cookieParser = require('cookie-parser'); // Cookie解析
const connectDB = require('./config/db'); // 数据库连接
const http = require('http');
const path = require('path'); // 添加path模块


// 创建Express应用实例
const app = express();
const server = http.createServer(app);


// 配置中间件
app.use(cors({
  origin: true,          
  credentials: true       
}));
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// 添加静态文件服务，让图片可以通过HTTP访问
app.use('/uploads', express.static(path.join(__dirname, '../MyApp/src/assets')));  


const PORT = 3010;

// 连接MongoDB数据库
connectDB();

// 导入API路由模块
const authRoutes = require('./routes/authRoutes');       

// 注册API路由

app.use('/auth', authRoutes);        

// 根路由，用于API健康检查
app.get('/', (req, res) => {
  res.send({
    message: '已运行',
  });
});

// 启动HTTP服务器 - 绑定到所有网络接口，允许外部访问
server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`外部访问地址: http://192.168.100.199:${PORT}`);
}); 