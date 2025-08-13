// 等级系统配置
const LEVEL_CONFIG = {
    // 每个等级所需的经验值（累计）
    levels: [
        { level: 1, requiredExp: 0, title: '占卜新手' },
        { level: 2, requiredExp: 100, title: '初级学徒' },
        { level: 3, requiredExp: 250, title: '见习占卜师' },
        { level: 4, requiredExp: 450, title: '初级占卜师' },
        { level: 5, requiredExp: 700, title: '中级占卜师' },
        { level: 6, requiredExp: 1000, title: '高级占卜师' },
        { level: 7, requiredExp: 1350, title: '占卜专家' },
        { level: 8, requiredExp: 1750, title: '占卜大师' },
        { level: 9, requiredExp: 2200, title: '神秘学者' },
        { level: 10, requiredExp: 2700, title: '预言先知' },
        { level: 11, requiredExp: 3250, title: '命运掌控者' },
        { level: 12, requiredExp: 3850, title: '时空引导者' },
        { level: 13, requiredExp: 4500, title: '宇宙洞察者' },
        { level: 14, requiredExp: 5200, title: '终极先知' },
        { level: 15, requiredExp: 6000, title: '命运之神' }
    ],
    
    // 经验值获取方式
    expSources: {
        dailySign: 10,          // 每日签到
        consecutiveSign: 5,     // 连续签到额外奖励（每天递增）
        tarotReading: 5,        // 塔罗牌占卜
        fortuneTelling: 3,      // 运势查看
        profileComplete: 20,    // 完善个人资料
        firstTime: 50           // 首次使用奖励
    }
};

/**
 * 根据经验值计算用户等级
 * @param {number} exp - 用户当前经验值
 * @returns {number} - 用户等级
 */
function calculateLevel(exp) {
    if (!exp || exp < 0) return 1;
    
    // 找到对应的等级
    for (let i = LEVEL_CONFIG.levels.length - 1; i >= 0; i--) {
        if (exp >= LEVEL_CONFIG.levels[i].requiredExp) {
            return LEVEL_CONFIG.levels[i].level;
        }
    }
    
    return 1; // 默认等级1
}

/**
 * 获取等级的详细信息
 * @param {number} exp - 用户当前经验值
 * @returns {object} - 等级详细信息
 */
function getLevelInfo(exp) {
    const currentLevel = calculateLevel(exp);
    const currentLevelConfig = LEVEL_CONFIG.levels.find(l => l.level === currentLevel);
    const nextLevelConfig = LEVEL_CONFIG.levels.find(l => l.level === currentLevel + 1);
    
    let progress = 100; // 默认满级进度
    let expToNext = 0;
    let currentLevelExp = 0;
    
    if (nextLevelConfig) {
        // 计算当前等级的起始经验值
        currentLevelExp = currentLevelConfig.requiredExp;
        // 升级到下一等级还需要的经验值
        expToNext = nextLevelConfig.requiredExp - exp;
        // 当前等级段的总经验值需求
        const levelExpRange = nextLevelConfig.requiredExp - currentLevelConfig.requiredExp;
        // 当前等级段已获得的经验值
        const currentLevelProgress = exp - currentLevelConfig.requiredExp;
        // 计算进度百分比
        progress = Math.floor((currentLevelProgress / levelExpRange) * 100);
    }
    
    return {
        level: currentLevel,
        title: currentLevelConfig.title,
        currentExp: exp,
        currentLevelExp: currentLevelExp,
        nextLevelExp: nextLevelConfig ? nextLevelConfig.requiredExp : null,
        expToNext: expToNext,
        progress: Math.max(0, Math.min(100, progress)),
        isMaxLevel: !nextLevelConfig
    };
}

/**
 * 增加经验值并检查升级
 * @param {number} currentExp - 当前经验值
 * @param {number} expToAdd - 要增加的经验值
 * @returns {object} - 包含新经验值、等级变化等信息
 */
function addExperience(currentExp, expToAdd) {
    const oldLevel = calculateLevel(currentExp);
    const newExp = currentExp + expToAdd;
    const newLevel = calculateLevel(newExp);
    
    const levelUp = newLevel > oldLevel;
    
    return {
        oldExp: currentExp,
        newExp: newExp,
        expGained: expToAdd,
        oldLevel: oldLevel,
        newLevel: newLevel,
        levelUp: levelUp,
        levelsGained: levelUp ? newLevel - oldLevel : 0
    };
}

/**
 * 获取指定等级的经验值范围
 * @param {number} level - 等级
 * @returns {object} - 经验值范围
 */
function getLevelExpRange(level) {
    const levelConfig = LEVEL_CONFIG.levels.find(l => l.level === level);
    const nextLevelConfig = LEVEL_CONFIG.levels.find(l => l.level === level + 1);
    
    if (!levelConfig) {
        return { minExp: 0, maxExp: 0 };
    }
    
    return {
        minExp: levelConfig.requiredExp,
        maxExp: nextLevelConfig ? nextLevelConfig.requiredExp - 1 : Infinity
    };
}

/**
 * 获取等级系统配置
 * @returns {object} - 配置信息
 */
function getLevelConfig() {
    return LEVEL_CONFIG;
}

/**
 * 根据行为类型获取经验值
 * @param {string} action - 行为类型
 * @param {number} multiplier - 倍数（默认1）
 * @returns {number} - 经验值
 */
function getExpByAction(action, multiplier = 1) {
    const baseExp = LEVEL_CONFIG.expSources[action] || 0;
    return baseExp * multiplier;
}

/**
 * 验证经验值是否有效
 * @param {number} exp - 经验值
 * @returns {boolean} - 是否有效
 */
function validateExp(exp) {
    return typeof exp === 'number' && exp >= 0 && exp <= 999999;
}

module.exports = {
    calculateLevel,
    getLevelInfo,
    addExperience,
    getLevelExpRange,
    getLevelConfig,
    getExpByAction,
    validateExp,
    LEVEL_CONFIG
}; 