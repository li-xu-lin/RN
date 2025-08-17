
export const lvFn = (exp) => {
  if (exp < 100) return 1;
  if (exp < 300) return 2;
  if (exp < 600) return 3;
  if (exp < 1000) return 4;
  if (exp < 1500) return 5;
  if (exp < 2100) return 6;
  if (exp < 2800) return 7;
  if (exp < 3600) return 8;
  if (exp < 4500) return 9;
  if (exp < 5500) return 10;
  if (exp < 5500) return 10;
  if (exp < 6600) return 11;
  if (exp < 7800) return 12;
  if (exp < 9100) return 13;
  if (exp < 9100) return 13;
  if (exp < 10500) return 14;
  if (exp < 12000) return 15;
  if (exp < 13600) return 16;
  if (exp < 13600) return 16;
  if (exp < 15300) return 17;
  if (exp < 17100) return 18;
  if (exp < 19000) return 19;
  if (exp < 19000) return 19;
  return 20;
};

// 获取等级称号
export const chengHao = (lv) => {
  const titles = [
    '初学者', '占卜学徒', '占卜新手', '占卜师', '高级占卜师',
    '资深占卜师', '占卜大师', '占卜专家', '占卜宗师', '占卜传奇',
    '占卜神话', '占卜传说', '占卜至尊', '占卜王者', '占卜帝皇',
    '占卜圣者', '占卜神使', '占卜天尊', '占卜仙尊', '占卜至尊'
  ];
  // 返回对应等级的称号，如果等级超出范围则返回最高称号
  return titles[lv - 1] || '占卜至尊';
};

// 计算升级需要的经验
export const expFn = (exp) => {
  // 获取当前等级
  const lv = lvFn(exp);
  // 每个等级所需的基础经验值数组
  const levelExp = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500,
                    5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000];
  
  // 如果已经是最高等级，返回0
  if (lv >= 20) return 0;
  // 返回升级到下一级还需要的经验值
  return levelExp[lv] - exp;
};

// 获取等级信息
export const getLevelInfo = (exp) => {
  // 计算当前等级
  const lv = lvFn(exp);
  return {
    level: lv, // 当前等级
    title: chengHao(lv), // 等级称号
    expToNext: expFn(exp) // 升级所需经验
  };
}; 