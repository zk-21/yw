/**
 * 智能学习路径推荐引擎
 * 基于用户学习数据生成个性化学习建议
 */
(function() {
  'use strict';

  // 能力等级定义
  const SKILL_LEVELS = {
    NOVICE: { label: '入门', minScore: 0, maxScore: 30 },
    BEGINNER: { label: '初级', minScore: 31, maxScore: 50 },
    INTERMEDIATE: { label: '中级', minScore: 51, maxScore: 70 },
    ADVANCED: { label: '高级', minScore: 71, maxScore: 85 },
    EXPERT: { label: '拔尖', minScore: 86, maxScore: 100 }
  };

  // 知识点权重配置
  const SKILL_WEIGHTS = {
    '阅读': { baseWeight: 1.0, difficultyMultiplier: 1.1 },
    '作文': { baseWeight: 1.0, difficultyMultiplier: 1.2 },
    '基础知识': { baseWeight: 0.8, difficultyMultiplier: 0.9 },
    '口语表达': { baseWeight: 0.7, difficultyMultiplier: 0.85 }
  };

  // 学习目标配置
  const LEARNING_GOALS = {
    DIAGNOSIS: { name: '诊断测评', duration: 15, priority: 'high' },
    TRAINING: { name: '针对性训练', duration: 20, priority: 'medium' },
    REVIEW: { name: '错题复习', duration: 10, priority: 'high' },
    ADVANCED: { name: '进阶挑战', duration: 25, priority: 'low' },
    COMPOSITION: { name: '作文练习', duration: 25, priority: 'medium' },
    READING: { name: '阅读训练', duration: 15, priority: 'medium' },
    VOCABULARY: { name: '词汇积累', duration: 8, priority: 'low' },
    GRAMMAR: { name: '语法巩固', duration: 10, priority: 'low' }
  };

  function getSkillLevel(score) {
    for (const [key, level] of Object.entries(SKILL_LEVELS)) {
      if (score >= level.minScore && score <= level.maxScore) {
        return { id: key, ...level };
      }
    }
    return SKILL_LEVELS.NOVICE;
  }

  function calculateMasteryRate(wrongList, masteryType = 'mastered') {
    if (!wrongList || wrongList.length === 0) return 0;
    const mastered = wrongList.filter(w => w.mastery === masteryType).length;
    return Math.round((mastered / wrongList.length) * 100);
  }

  function analyzeWeakPoints(lastResult) {
    if (!lastResult || !lastResult.details) return [];
    
    const weakPoints = [];
    Object.entries(lastResult.details).forEach(([key, value]) => {
      if (value.score < 60) {
        weakPoints.push({
          skill: key,
          score: value.score,
          maxScore: value.maxScore || 100,
          weight: SKILL_WEIGHTS[key]?.baseWeight || 1.0
        });
      }
    });
    
    return weakPoints.sort((a, b) => a.score - b.score);
  }

  function generateDailyTasks(data) {
    const { lastResult, wrongList, streak, rewardData } = data;
    const tasks = [];
    const now = new Date().toISOString();
    
    // 计算超期错题数量
    const overdueCount = wrongList.filter(w => 
      w.mastery !== 'mastered' && w.nextReview && w.nextReview < now
    ).length;

    // 分析薄弱点
    const weakPoints = analyzeWeakPoints(lastResult);
    
    // 任务1：错题复习（高优先级）
    if (overdueCount > 0) {
      tasks.push({
        id: 'review-overdue',
        title: '复习超期错题',
        description: `有 ${overdueCount} 道题需要复习，加深记忆`,
        duration: Math.min(overdueCount * 3, 15),
        priority: 'high',
        type: 'REVIEW',
        link: 'practice.html#wrong-notebook'
      });
    } else if (wrongList.length > 0) {
      tasks.push({
        id: 'review-all',
        title: '错题巩固',
        description: '复习已掌握的错题，防止遗忘',
        duration: 10,
        priority: 'medium',
        type: 'REVIEW',
        link: 'practice.html#wrong-notebook'
      });
    }

    // 任务2：诊断或针对性训练
    const diagScore = lastResult?.totalScore || 0;
    if (weakPoints.length > 0) {
      const weakest = weakPoints[0];
      tasks.push({
        id: 'targeted-training',
        title: `${weakest.skill}专项训练`,
        description: `该知识点得分较低（${weakest.score}分），需要加强`,
        duration: 20,
        priority: 'high',
        type: 'TRAINING',
        skill: weakest.skill,
        link: 'practice.html#flow-training'
      });
    } else if (diagScore > 0 && diagScore < 12) {
      tasks.push({
        id: 'general-training',
        title: '针对性训练',
        description: '根据诊断结果，提升薄弱环节',
        duration: 20,
        priority: 'medium',
        type: 'TRAINING',
        link: 'practice.html#flow-training'
      });
    } else if (!diagScore) {
      tasks.push({
        id: 'diagnosis',
        title: '能力诊断',
        description: '了解当前水平，找到学习方向',
        duration: 15,
        priority: 'high',
        type: 'DIAGNOSIS',
        link: 'practice.html#diagnosis'
      });
    } else {
      tasks.push({
        id: 'advanced',
        title: '进阶挑战',
        description: '挑战更高难度，突破自我',
        duration: 25,
        priority: 'low',
        type: 'ADVANCED',
        link: 'practice.html#diagnosis'
      });
    }

    // 任务3：阅读或作文
    const grade = lastResult?.gradeLabel;
    if (grade) {
      tasks.push({
        id: 'composition',
        title: '阅读与写作',
        description: '本周阅读训练 + 小练笔',
        duration: 25,
        priority: 'medium',
        type: 'COMPOSITION',
        link: 'composition.html'
      });
    } else {
      tasks.push({
        id: 'vocabulary',
        title: '积累古诗',
        description: '学习一首古诗，培养语感',
        duration: 10,
        priority: 'low',
        type: 'VOCABULARY',
        link: 'pinyin.html'
      });
    }

    // 添加基础巩固任务（如果学习天数较少）
    if (streak < 7) {
      tasks.push({
        id: 'grammar',
        title: '语法巩固',
        description: '每天5分钟，夯实基础',
        duration: 8,
        priority: 'low',
        type: 'GRAMMAR',
        link: 'grammar.html'
      });
    }

    return tasks.slice(0, 4).sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  function generateWeeklyPlan(data) {
    const { lastResult, wrongList, streak } = data;
    const plan = {
      weekStart: new Date().toISOString(),
      objectives: [],
      dailyTasks: [],
      estimatedHours: 0
    };

    const weakPoints = analyzeWeakPoints(lastResult);
    const masteryRate = calculateMasteryRate(wrongList);

    // 设置本周目标
    if (weakPoints.length > 0) {
      plan.objectives.push(`提升 ${weakPoints[0].skill} 能力（当前${weakPoints[0].score}分）`);
    }
    plan.objectives.push(`错题复练率达到 ${Math.min(masteryRate + 20, 100)}%`);
    plan.objectives.push(`保持连续打卡 ${streak + 7} 天`);

    // 生成每日任务
    const dailyTypes = ['DIAGNOSIS', 'TRAINING', 'COMPOSITION', 'REVIEW', 'READING', 'VOCABULARY', 'GRAMMAR'];
    
    for (let day = 0; day < 7; day++) {
      const dayTasks = [];
      let totalDuration = 0;

      // 根据星期安排不同重点
      if (day === 0 || day === 6) {
        // 周末：诊断 + 作文
        dayTasks.push({ type: 'DIAGNOSIS', duration: 15 });
        dayTasks.push({ type: 'COMPOSITION', duration: 30 });
        totalDuration = 45;
      } else if (day % 2 === 0) {
        // 偶数天：阅读 + 语法
        dayTasks.push({ type: 'READING', duration: 15 });
        dayTasks.push({ type: 'GRAMMAR', duration: 10 });
        if (wrongList.length > 0) {
          dayTasks.push({ type: 'REVIEW', duration: 10 });
          totalDuration = 35;
        } else {
          totalDuration = 25;
        }
      } else {
        // 奇数天：训练 + 词汇
        dayTasks.push({ type: 'TRAINING', duration: 20 });
        dayTasks.push({ type: 'VOCABULARY', duration: 8 });
        if (wrongList.length > 0) {
          dayTasks.push({ type: 'REVIEW', duration: 10 });
          totalDuration = 38;
        } else {
          totalDuration = 28;
        }
      }

      plan.dailyTasks.push({
        day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][day],
        tasks: dayTasks,
        totalMinutes: totalDuration
      });

      plan.estimatedHours += totalDuration;
    }

    plan.estimatedHours = Math.round(plan.estimatedHours / 60);

    return plan;
  }

  function getPersonalizedRecommendations(data) {
    const { lastResult, wrongList, streak, rewardData } = data;
    
    const recommendations = {
      dailyTasks: generateDailyTasks(data),
      weeklyPlan: generateWeeklyPlan(data),
      skillLevel: getSkillLevel(lastResult?.totalScore ? (lastResult.totalScore / 15) * 100 : 0),
      weakPoints: analyzeWeakPoints(lastResult),
      masteryRate: calculateMasteryRate(wrongList),
      streak: streak,
      points: rewardData?.points || 0
    };

    return recommendations;
  }

  // ── 公开 API ──────────────────────────────────────────────
  window.LearningPathRecommender = {
    SKILL_LEVELS,
    LEARNING_GOALS,
    
    getSkillLevel,
    calculateMasteryRate,
    analyzeWeakPoints,
    generateDailyTasks,
    generateWeeklyPlan,
    getPersonalizedRecommendations
  };
})();