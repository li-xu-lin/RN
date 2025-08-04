const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 连接数据库，使用环境变量中的URI
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/RN");
    // 连接成功，打印主机名
    console.log(`MongoDB连接成功: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // 连接失败，打印错误信息并退出进程
    console.error(`MongoDB连接错误: ${error.message}`);
    // 退出进程，状态码1表示错误
    process.exit(1);
  }
};

module.exports = connectDB; 