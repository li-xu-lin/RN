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
// 添加头像上传目录的静态文件服务
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));  


const PORT = 3010;

// 连接MongoDB数据库
connectDB();

// 导入API路由模块
const authRoutes = require('./routes/authRoutes');       
const fortuneRoutes = require('./routes/YunshiRoutes');
const tarotRoutes = require('./routes/tarotRoutes');
const zodiacRoutes = require('./routes/zodiacRoutes');

// 注册API路由

app.use('/auth', authRoutes);        
app.use('/yunShi', fortuneRoutes);
app.use('/tarot', tarotRoutes);
app.use('/zodiac', zodiacRoutes);



// 根路由，用于API健康检查
app.get('/', (req, res) => {
  res.send({
    message: '已运行',
  });
});

// 每日重置签到状态和运势数据的定时任务
const resetDailySignStatus = async () => {
    try {
        const User = require('./models/User');
        
        // 重置签到状态
        const signResult = await User.updateMany({}, { isQianDao: false });
        console.log(`🔄 每日签到状态重置完成，影响 ${signResult.modifiedCount} 个用户`);
        
        // 重置运势数据（清除lastUpdated，这样下次访问时会重新生成）
        const fortuneResult = await User.updateMany({}, { 
            $unset: { 'dailyFortune.lastUpdated': 1 } 
        });
        console.log(`🔮 每日运势数据重置完成，影响 ${fortuneResult.modifiedCount} 个用户`);
        
    } catch (error) {
        console.error('❌ 每日重置任务失败:', error);
    }
};



// 计算到下一个午夜的时间
const scheduleNextReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // 设置为明天的0点0分0秒
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`⏰ 下次签到状态重置时间: ${tomorrow.toLocaleString('zh-CN')}`);
    
    setTimeout(() => {
        resetDailySignStatus();
        // 重置后，设置下一次24小时后的重置
        setInterval(resetDailySignStatus, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
};

// 启动HTTP服务器 - 绑定到所有网络接口，允许外部访问
server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`外部访问地址: http://192.168.100.199:${PORT}`);
  
  // 启动每日签到重置定时任务
  scheduleNextReset();
}); 