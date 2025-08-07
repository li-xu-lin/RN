import { useState, useEffect } from 'react';
import DivinationService from '../services/DivinationService';

// 塔罗占卜Hook
export const useTarotReading = (spreadType = 'single', question = '') => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const drawCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cardCount = spreadType === 'single' ? 1 : 
                      spreadType === 'love' ? 3 : 
                      spreadType === 'celtic' ? 10 : 1;
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const drawnCards = DivinationService.drawTarotCards(cardCount, question);
      setCards(drawnCards);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveReading = async () => {
    try {
      const record = {
        type: 'tarot',
        spreadType,
        question,
        cards,
        result: cards.map(c => c.name).join(', '),
        accuracy: Math.floor(Math.random() * 30) + 70
      };
      
      await DivinationService.saveDivinationRecord(record);
      return record;
    } catch (err) {
      throw new Error('保存失败');
    }
  };

  return {
    cards,
    loading,
    error,
    drawCards,
    saveReading
  };
};

// 星座运势Hook
export const useZodiacFortune = (zodiacSign) => {
  const [fortune, setFortune] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (zodiacSign) {
      setLoading(true);
      
      // 模拟API调用
      setTimeout(() => {
        const fortuneData = DivinationService.calculateZodiacFortune(zodiacSign);
        setFortune(fortuneData);
        setLoading(false);
      }, 800);
    }
  }, [zodiacSign]);

  const refreshFortune = () => {
    if (zodiacSign) {
      setLoading(true);
      setTimeout(() => {
        const fortuneData = DivinationService.calculateZodiacFortune(zodiacSign);
        setFortune(fortuneData);
        setLoading(false);
      }, 800);
    }
  };

  return {
    fortune,
    loading,
    refreshFortune
  };
};

// 占卜历史Hook
export const useDivinationHistory = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const [historyData, statsData] = await Promise.all([
        DivinationService.getDivinationHistory(),
        DivinationService.getUserStats()
      ]);
      
      setHistory(historyData);
      setStats(statsData);
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const addRecord = async (record) => {
    try {
      const newRecord = await DivinationService.saveDivinationRecord(record);
      setHistory(prev => [newRecord, ...prev]);
      
      // 更新统计
      const newStats = await DivinationService.getUserStats();
      setStats(newStats);
      
      return newRecord;
    } catch (error) {
      throw error;
    }
  };

  return {
    history,
    stats,
    loading,
    loadHistory,
    addRecord
  };
};

// 每日运势Hook
export const useDailyFortune = () => {
  const [dailyFortune, setDailyFortune] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查今日运势是否已加载
    const today = new Date().toDateString();
    const cached = localStorage.getItem('daily_fortune');
    
    if (cached) {
      const cachedData = JSON.parse(cached);
      if (cachedData.date === today) {
        setDailyFortune(cachedData);
        setLoading(false);
        return;
      }
    }

    // 生成新的每日运势
    setTimeout(() => {
      const fortune = DivinationService.generateDailyFortune();
      setDailyFortune(fortune);
      
      // 缓存到本地
      localStorage.setItem('daily_fortune', JSON.stringify(fortune));
      setLoading(false);
    }, 1000);
  }, []);

  return {
    dailyFortune,
    loading
  };
};

// 星座配对Hook
export const useZodiacMatch = () => {
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateMatch = async (sign1, sign2) => {
    try {
      setLoading(true);
      
      // 模拟计算延迟
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const compatibility = DivinationService.calculateZodiacMatch(sign1, sign2);
      const sign1Data = DivinationService.zodiacSigns.find(z => z.id === sign1);
      const sign2Data = DivinationService.zodiacSigns.find(z => z.id === sign2);
      
      const result = {
        sign1: sign1Data,
        sign2: sign2Data,
        compatibility,
        analysis: generateMatchAnalysis(compatibility),
        advice: generateMatchAdvice(compatibility)
      };
      
      setMatchResult(result);
    } catch (error) {
      console.error('配对计算失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMatchAnalysis = (score) => {
    if (score >= 90) return '你们是天作之合！彼此的能量非常匹配，容易产生共鸣。';
    if (score >= 70) return '很好的配对！虽然有些差异，但正是这些不同让关系更有趣。';
    if (score >= 50) return '中等配对。需要更多的理解和包容，但努力是值得的。';
    if (score >= 30) return '具有挑战性的配对。需要双方都付出更多努力来维持关系。';
    return '这个配对需要谨慎考虑。你们的性格差异可能比较大。';
  };

  const generateMatchAdvice = (score) => {
    if (score >= 90) return '继续保持现在的状态，你们的关系会越来越好。';
    if (score >= 70) return '多沟通，尊重彼此的不同，关系会更加稳固。';
    if (score >= 50) return '学会妥协和理解，找到平衡点很重要。';
    if (score >= 30) return '需要更多的耐心和包容，慢慢磨合。';
    return '如果真心相爱，任何困难都可以克服。';
  };

  return {
    matchResult,
    loading,
    calculateMatch
  };
};

// 月相Hook
export const useMoonPhase = () => {
  const [moonPhase, setMoonPhase] = useState(null);

  useEffect(() => {
    const phase = DivinationService.getMoonPhase();
    setMoonPhase(phase);
  }, []);

  return {
    moonPhase
  };
}; 