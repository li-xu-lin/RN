const AlipaySdk = require('alipay-sdk').default;

// 支付宝沙箱配置
const alipayConfig = {
  // 应用ID - 沙箱环境的APPID
  appId: '9021000132677705', // 这是支付宝默认的沙箱APPID，实际使用时需要替换
  
  // 应用私钥 - 请替换为你的应用私钥
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT0vsXHHvWmrTKGJKcRhMGQnHKaVlA3nWMPojqECr6p5J5vP/n4bXI2L6F1J9fszL5l2H5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8MwIDAQAB
-----END RSA PRIVATE KEY-----`,
  
  // 支付宝公钥 - 请替换为你的支付宝公钥
  alipayPublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT0vsXHHvWmrTKGJKcRhMGQnHKaVlA3nWMPojqECr6p5J5vP/n4bXI2L6F1J9fszL5l2H5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8M5n8MwIDAQAB
-----END PUBLIC KEY-----`,
  
  // 网关地址 - 沙箱环境
  gateway: 'https://openapi.alipaydev.com/gateway.do',
  
  // 签名类型
  signType: 'RSA2',
  
  // 字符编码
  charset: 'utf-8',
  
  // API版本
  version: '1.0',
  
  // 返回格式
  format: 'json',
  
  // 同步回调地址 - 支付成功后跳转的页面
  returnUrl: 'http://192.168.100.199:3010/alipay/return',
  
  // 异步回调地址 - 支付成功后支付宝主动通知的地址
  notifyUrl: 'http://192.168.100.199:3010/alipay/notify'
};

// 创建支付宝SDK实例
const alipaySdk = new AlipaySdk({
  appId: alipayConfig.appId,
  privateKey: alipayConfig.privateKey,
  alipayPublicKey: alipayConfig.alipayPublicKey,
  gateway: alipayConfig.gateway,
  signType: alipayConfig.signType,
  charset: alipayConfig.charset,
  version: alipayConfig.version,
  format: alipayConfig.format
});

module.exports = {
  alipayConfig,
  alipaySdk
}; 