const alipayModule = require('alipay-sdk');
const AlipaySdk = alipayModule.default || alipayModule.AlipaySdk || alipayModule;

// 支付宝沙箱配置 - 简化版本
const alipayConfig = {
  // 沙箱应用ID
  appId: '9021000151610055',

  // 开发者私钥
  privateKey: `MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCn3c+NrJQjINkAPjuKC+L9SKxsMJ1Gas0PFsh8edD66sqkRrp/XRFbkr8cQB+xf3bRryjpGhyekLyyI75Dlt/ccCKpWJwayfOzp78BzaiGxybXw8XQ+zTLi0ridTlBJyoqEI4qy0WOgvnP2KS25f8RA2fOIgXYjzGURtyt7zvda613SUibuPgRdrGZZ9dax5pCW9YHCtFPAGhf6mRPfq+aimWRYHEBITW0pzkWp1xfzPgUpLms/VHVzoyyJfrGlSo/5kMgnC6e3SNcDA4HUvE+PLqERlCU12Jvm0VS9tQgAAoGsX4Gp8o0Zpbp1Q8/zXRUpVEwW/FQB7m0P50bbv6NAgMBAAECggEBAIt51Ds92nP5lfQKwUOpLrgOixz1o6ffk3PnFTu/p3DkZuzpy4mJlaOFoX7ilLLRWrNMm2xbAs6JKg/FfRABqw0oqtQUSNhFVlS+mwjvjQg3LsH160YBg1Nf8B+LEMBevzzmNom+DZQkpVYaBnnlTfIf5z8xq7PM/n/aBQAMF6yXs298RHP4KPidDLAmfDo7MoUpVklmNuXaP2pQIUvZMGBr5/eRgvgNEne7yPXxU5TAyo2mCxUzd6A/RAE4nH2IJclcXyfwi1L8jGinfvhYwG2n2DC+GdxSJlCRv5D8FV5ifca2QgmnsYCj6SHoSlc9OspmzAIwweIx3rbGii1wkwECgYEA16BtQAgEre0Md2my0XLU+F+uI5sInXykUqq1pL07dRrju20RqFhR/wMCnUajttBVNWLYOmd+p69t0QwXhkCsnBzCWMrqxUHgroPItIRA/G4nV6IwF4MB+j/TuclJvSJ+z3c0511rpUV9FMWeDo+UBcxQlkIxn5My7yHbo5rH0E0CgYEAx0wbTwGNT7gT+wEupg/a6lvqlgvMfkynbAHK2nQXkjelAgfKxzQ9jjM+G4sjibM7y0IbcB9qlhE6KsL7DeNmdGBeivoNTBrCb5BzfiUw7yomWWqq7BpIJNsdCaDC3CC0QFBd6LQzG412LCHKrJMsHOMC+jIg4PQf1+M5OKCFB0ECgYBQPlaJ3rIHG9Fo2v/97BMPf2Ppwjc5jHoGfZrtfLKUyPX4+QT6NiwFj9Q4PWKNlQgwvuEjEwLSWnmusyZKAuV5j0ZQDuvBjtuTdl2JuDIK/t9LQINPLKTewUQEvsDfTugMQxuAAocd0TdUNJq2Zn46jidrU6Tt8rSgw2PehapYfQKBgAlCgv5PvyYWEm+WJXm3wN8kuCiSkcTIgPrmtmsh+7pidXs7q3NH/RgvT1JuS49pUXznLGkwPH6OfFpiRtHlX+xGUf45EgcYMzKFzqfsyHJEThXXe+uOaQ21VIsO+h7KMjXOxh46ySkdkIEKbOVJzUHmVkwTqi1pilU4jH8SDjxBAoGADt1LvY9oBDM45DVSwZtJJiWfqpJLFWDrtvjWNRSOsvH6ghUI5dIlBGDXhvHEXOQsN/7c/Ut273+0Sn/ukHlN1f2GDwwCZdLm9MknQp41HGv6XAvIAe1hbeQ9bBIwYzIiM14f1jZ1G1AvzsaW1PXwPosdtt9abNxcQojE0nj23co=`,

  // 支付宝公钥
  alipayPublicKey: `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwFfG+sVtJLNwwalvUKrLWEKyOdhxRSef/pc48kMZ+vD4sjbF9COuhrP5p5q8GYNT4Zp3LI1NYrAOrAZbBVjUA9mEYjQbQBYBd95UEpkHr5aKBm+RjzvqWHqe1QgD6zEaFpqMCPacgKbnGA0YiDVyNw6sjhmGGg5z3euCaREnGtqyAyVH4Ds5r+H7bldU0S8o8PSDXKs6NoGnVME2lN7z9wUEaG0wvHogIv0rM9sLLdkOUUqfm8Z4ZEIVLzYkuJ5Ru+pT832YIEIVglZSQV60aAm35e2uXxkMiAHCYtiNmNNjfNANjiqFmOis5DWca/wJkGVKLHTAsWecdFrohgg2VwIDAQAB`,

  // 沙箱网关
  gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
  
  // 基础配置
  signType: 'RSA2',
  charset: 'utf-8',
  version: '1.0',
  
  // 支付回调URL配置
  notifyUrl: 'http://192.168.100.199:3010/payment/notify', // 异步通知URL
  returnUrl: 'myapp://payment/success', // 同步回调URL - 使用深度链接返回APP
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
});

console.log('✅ 支付宝SDK初始化成功');

// 简化的会员套餐配置
const membershipPlans = {
  '月会员': {
    name: '月会员',
    price: 9.90,
    duration: 30, // 天数
    description: '每月享受无限次占卜服务'
  },
  '季会员': {
    name: '季会员', 
    price: 29.90,
    duration: 90, // 天数
    description: '三个月享受无限次占卜服务'
  }
};

module.exports = {
  alipaySdk,
  alipayConfig,
  membershipPlans
}; 