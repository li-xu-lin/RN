const mongoose = require('mongoose');
const AlipayUtils = require('../utils/alipayUtils');
const { membershipPlans } = require('../config/alipay');

// 连接数据库
async function connectDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/RN");
        console.log('✅ 数据库连接成功');
    } catch (error) {
        console.error('❌ 数据库连接失败:', error);
        process.exit(1);
    }
}

// 测试支付功能
async function testPaymentFeatures() {
    console.log('\n🧪 开始测试支付功能...\n');

    // 1. 测试套餐配置
    console.log('📋 测试套餐配置:');
    console.log('可用套餐:', Object.keys(membershipPlans));
    
    for (const [planType, plan] of Object.entries(membershipPlans)) {
        console.log(`  ${planType}:`, {
            名称: plan.name,
            价格: `¥${plan.price}`,
            时长: `${plan.duration}天`,
            描述: plan.description
        });
    }

    // 2. 测试工具函数
    console.log('\n🔧 测试工具函数:');
    
    // 测试简化流水号生成
    const testUserId = '507f1f77bcf86cd799439011';
    const orderNo1 = `${testUserId}_月会员_${Date.now()}`;
    const orderNo2 = `${testUserId}_季会员_${Date.now()}`;
    console.log('流水号生成测试（简化版）:');
    console.log(`  月会员流水号: ${orderNo1}`);
    console.log(`  季会员流水号: ${orderNo2}`);

    // 测试套餐信息获取
    console.log('\n套餐信息获取测试:');
    const monthlyPlan = AlipayUtils.getMembershipPlan('月会员');
    const quarterlyPlan = AlipayUtils.getMembershipPlan('季会员');
    const invalidPlan = AlipayUtils.getMembershipPlan('年会员');
    
    console.log(`  月会员信息: ${monthlyPlan ? '✅ 正确' : '❌ 失败'}`);
    console.log(`  季会员信息: ${quarterlyPlan ? '✅ 正确' : '❌ 失败'}`);
    console.log(`  无效套餐(年会员): ${invalidPlan ? '❌ 意外获取到' : '✅ 正确返回null'}`);

    // 测试到期时间计算
    console.log('\n到期时间计算测试:');
    const now = new Date();
    try {
        const monthlyExpiry = AlipayUtils.calculateExpiryDate('月会员', now);
        const quarterlyExpiry = AlipayUtils.calculateExpiryDate('季会员', now);
        
        console.log(`  月会员到期时间: ${monthlyExpiry.toLocaleDateString('zh-CN')}`);
        console.log(`  季会员到期时间: ${quarterlyExpiry.toLocaleDateString('zh-CN')}`);
        
        // 计算天数差
        const monthlyDays = Math.ceil((monthlyExpiry - now) / (1000 * 60 * 60 * 24));
        const quarterlyDays = Math.ceil((quarterlyExpiry - now) / (1000 * 60 * 60 * 24));
        
        console.log(`  月会员天数: ${monthlyDays}天 ${monthlyDays === 30 ? '✅' : '❌'}`);
        console.log(`  季会员天数: ${quarterlyDays}天 ${quarterlyDays === 90 ? '✅' : '❌'}`);
        
    } catch (error) {
        console.error('❌ 到期时间计算失败:', error.message);
    }

    // 测试金额验证
    console.log('\n金额验证测试:');
    const validAmount1 = AlipayUtils.validatePaymentAmount('月会员', 9.90);
    const validAmount2 = AlipayUtils.validatePaymentAmount('季会员', 29.90);
    const invalidAmount = AlipayUtils.validatePaymentAmount('月会员', 10.00);
    
    console.log(`  月会员正确金额(9.90): ${validAmount1 ? '✅' : '❌'}`);
    console.log(`  季会员正确金额(29.90): ${validAmount2 ? '✅' : '❌'}`);
    console.log(`  月会员错误金额(10.00): ${invalidAmount ? '❌' : '✅'}`);

    console.log('\n🎉 支付功能测试完成!');
}

// 测试数据库模型
async function testDatabaseModels() {
    console.log('\n📊 测试数据库模型...');
    
    const User = require('../models/User');

    try {
        // 测试用户模型的会员字段
        console.log('用户模型会员字段测试:');
        const userSchema = User.schema.paths;
        
        const vipTypeEnum = userSchema['vip.type']?.enumValues || userSchema['vip.type']?.options?.enum;
        console.log(`  VIP类型枚举: ${vipTypeEnum ? vipTypeEnum.join(', ') : '未找到'}`);
        
        const hasMemberFields = [
            'isMember' in userSchema,
            'membershipEndDate' in userSchema,
            'vip.type' in userSchema || 'vip' in userSchema
        ];
        console.log(`  必要字段存在: ${hasMemberFields.every(x => x) ? '✅' : '❌'}`);

        console.log('\n✅ 订单模型已移除（简化支付系统）');
        console.log('  现在直接通过支付宝订单号管理支付状态');

    } catch (error) {
        console.error('❌ 数据库模型测试失败:', error);
    }
}

// 主函数
async function main() {
    try {
        await connectDB();
        await testPaymentFeatures();
        await testDatabaseModels();
        
        console.log('\n✅ 所有测试完成!');
        console.log('\n📝 使用说明:');
        console.log('1. 确保在支付宝开放平台配置了正确的应用信息');
        console.log('2. 将真实的AppId、私钥等配置到 config/alipay.js');
        console.log('3. 设置正确的回调地址');
        console.log('4. 在前端调用 /payment/create 创建支付订单');
        console.log('5. 使用返回的支付参数调起支付宝支付');
        
    } catch (error) {
        console.error('❌ 测试执行失败:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}

// 运行测试
if (require.main === module) {
    main();
}

module.exports = { testPaymentFeatures, testDatabaseModels }; 