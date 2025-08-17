const { alipaySdk, alipayConfig, membershipPlans } = require('../config/alipay');

class AlipayUtils {
  /**
   * 创建支付订单 - 简化版
   */
  static async createPayment(orderInfo) {
    try {
      const { outTradeNo, totalAmount, subject, body } = orderInfo;

      // 构建支付参数 - 使用手机网站支付
      const bizContent = {
        out_trade_no: outTradeNo,
        product_code: 'QUICK_WAP_WAY', // 手机网站支付
        total_amount: totalAmount.toString(),
        subject: subject,
        body: body,
        timeout_express: '30m', // 30分钟超时
      };

      // 调用支付宝API创建支付
      const result = await alipaySdk.sdkExec('alipay.trade.wap.pay', {
        notify_url: alipayConfig.notifyUrl,
        return_url: alipayConfig.returnUrl,
        biz_content: bizContent
      });

      return {
        success: true,
        data: {
          orderString: result, // 支付参数字符串
          outTradeNo: outTradeNo
        }
      };
    } catch (error) {
      console.error('❌ 创建支付订单失败:', error);
      return {
        success: false,
        message: error.message || '创建支付订单失败'
      };
    }
  }

  /**
   * 查询支付结果
   */
  static async queryPayment(outTradeNo) {
    try {
      const result = await alipaySdk.exec('alipay.trade.query', {
        biz_content: {
          out_trade_no: outTradeNo
        }
      });

      if (result.code === '10000') {
        return {
          success: true,
          data: {
            tradeStatus: result.trade_status,
            totalAmount: result.total_amount,
            tradeNo: result.trade_no
          }
        };
      } else {
        return {
          success: false,
          message: result.msg || '查询失败'
        };
      }
    } catch (error) {
      console.error('❌ 查询支付状态失败:', error);
      return {
        success: false,
        message: '查询支付状态失败'
      };
    }
  }

  /**
    * 验证支付宝通知
   */
  static verifyNotify(params) {
    try {
      // 基础验证
      if (!params.out_trade_no || !params.trade_status) {
        return false;
      }
      
      // 验证签名
      return alipaySdk.checkNotifySign(params);
    } catch (error) {
      console.error('❌ 验证通知失败:', error);
      return false;
    }
  }

  /**
   * 生成简单的订单号
   */
  static generateOrderNo(userId, planType) {
    const timestamp = Date.now();
    return `${userId}_${planType}_${timestamp}`;
  }

  /**
   * 获取会员套餐信息
   */
  static getMembershipPlan(planType) {
    return membershipPlans[planType] || null;
  }

  /**
   * 计算会员到期时间
   */
  static calculateExpiryDate(planType) {
    const plan = this.getMembershipPlan(planType);
    if (!plan) return null;

    const now = new Date();
    const expiryDate = new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000);
    return expiryDate;
  }
}

module.exports = AlipayUtils; 