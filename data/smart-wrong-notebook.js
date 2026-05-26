/**
 * 智能错题本系统
 * 包含：AI错因分析、自动生成个性化训练计划、错题知识点关联推荐
 */
(function() {
  'use strict';

  // ==================== 错题本数据结构 ====================

  /**
   * 错题记录结构
   * {
   *   id: string,                    // 错题ID
   *   exerciseId: string,            // 原题ID
   *   wrongAnswer: string,           // 错误答案
   *   correctAnswer: string,         // 正确答案
   *   errorCode: string,             // 错因码
   *   errorCategory: string,         // 错误类别
   *   knowledgePoints: string[],     // 涉及知识点
   *   timeSpent: number,             // 用时（秒）
   *   difficulty: string,            // 题目难度
   *   timestamp: string,             // 错误时间
   *   mastery: string,               // 掌握程度：new/learning/mastered
   *   reviewCount: number,           // 复习次数
   *   nextReview: string,            // 下次复习时间
   *   relatedExercises: string[],    // 关联题目
   *   aiAnalysis: object,            // AI分析结果
   *   personalizedPlan: object       // 个性化训练计划
   * }
   */

  // ==================== 间隔重复算法（Spaced Repetition）====================

  /**
   * 计算下次复习时间（基于艾宾浩斯遗忘曲线）
   */
  function calculateNextReview(reviewCount, mastery) {
    const intervals = [1, 3, 7, 14, 30, 60, 90]; // 天数
    const index = Math.min(reviewCount, intervals.length - 1);
    
    let days = intervals[index];
    
    // 根据掌握程度调整
    if (mastery === 'mastered') {
      days *= 1.5;
    } else if (mastery === 'new') {
      days *= 0.5;
    }
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + Math.floor(days));
    
    return nextReview.toISOString();
  }

  /**
   * 更新掌握程度
   */
  function updateMastery(wrongItem, reviewResult) {
    const { correct, timeSpent } = reviewResult;
    
    if (correct && timeSpent < 30) {
      // 快速正确回答
      if (wrongItem.mastery === 'new') {
        wrongItem.mastery = 'learning';
      } else if (wrongItem.mastery === 'learning' && wrongItem.reviewCount >= 3) {
        wrongItem.mastery = 'mastered';
      }
    } else if (!correct) {
      // 回答错误，重置掌握程度
      wrongItem.mastery = 'new';
      wrongItem.reviewCount = 0;
    }
    
    wrongItem.reviewCount++;
    wrongItem.nextReview = calculateNextReview(wrongItem.reviewCount, wrongItem.mastery);
    
    return wrongItem;
  }

  // ==================== AI错因分析 ====================

  /**
   * 深度AI错因分析
   */
  function performAIAnalysis(wrongItem, userData) {
    const analysis = {
      errorType: '',
      severity: '',
      rootCause: '',
      suggestions: [],
      relatedKnowledgePoints: [],
      trainingPlan: []
    };

    // 分析错误类型
    analysis.errorType = classifyErrorType(wrongItem);

    // 分析严重程度
    analysis.severity = assessErrorSeverity(wrongItem, userData);

    // 分析根本原因
    analysis.rootCause = identifyRootCause(wrongItem, userData);

    // 生成建议
    analysis.suggestions = generateSuggestions(analysis);

    // 关联知识点
    analysis.relatedKnowledgePoints = findRelatedKnowledgePoints(wrongItem);

    // 生成训练计划
    analysis.trainingPlan = generateTrainingPlan(analysis);

    return analysis;
  }

  /**
   * 分类错误类型
   */
  function classifyErrorType(wrongItem) {
    const { errorCode, timeSpent, difficulty } = wrongItem;

    if (errorCode) {
      const mapping = {
        'B1': '拼音错误',
        'B2': '识字错误',
        'B3': '词语错误',
        'R1': '阅读理解-信息提取',
        'R2': '阅读理解-逻辑推理',
        'W1': '作文-审题立意',
        'W2': '作文-语言表达',
        'W3': '作文-基础语法',
        'C1': '综合运用'
      };
      return mapping[errorCode] || '未知错误';
    }

    if (timeSpent > 60) {
      return '时间压力导致的错误';
    }

    if (difficulty === 'exam') {
      return '难度过高导致的错误';
    }

    return '基础不牢固导致的错误';
  }

  /**
   * 评估错误严重程度
   */
  function assessErrorSeverity(wrongItem, userData) {
    const { errorCode, reviewCount, mastery } = wrongItem;
    
    // 高严重度：基础知识点反复出错
    if (errorCode && errorCode.startsWith('B') && reviewCount >= 3 && mastery !== 'mastered') {
      return 'high';
    }

    // 中严重度：重复出错
    if (reviewCount >= 2 && mastery !== 'mastered') {
      return 'medium';
    }

    // 低严重度：首次出错
    if (reviewCount === 0) {
      return 'low';
    }

    return 'medium';
  }

  /**
   * 识别根本原因
   */
  function identifyRootCause(wrongItem, userData) {
    const { errorCode, timeSpent, wrongAnswer, correctAnswer } = wrongItem;
    const causes = [];

    // 原因1：知识点掌握不牢固
    if (errorCode) {
      causes.push('知识点掌握不牢固');
    }

    // 原因2：时间压力
    if (timeSpent > 60) {
      causes.push('答题时间不足，思考不充分');
    }

    // 原因3：粗心大意
    if (wrongAnswer && correctAnswer && 
        wrongAnswer.length === correctAnswer.length &&
        wrongAnswer.split('').filter((c, i) => c === correctAnswer[i]).length > wrongAnswer.length * 0.7) {
      causes.push('粗心大意，细节错误');
    }

    // 原因4：理解偏差
    if (errorCode && errorCode.startsWith('R')) {
      causes.push('理解能力有待提升');
    }

    // 原因5：练习不足
    if (userData && userData.practiceHistory && userData.practiceHistory.length < 5) {
      causes.push('练习量不足，缺乏熟练度');
    }

    return causes.join('；');
  }

  /**
   * 生成建议
   */
  function generateSuggestions(analysis) {
    const suggestions = [];

    switch (analysis.errorType) {
      case '拼音错误':
        suggestions.push('加强拼音基础练习，重点练习声母、韵母、声调');
        suggestions.push('多读多练，提高拼音拼读速度和准确率');
        break;
      case '识字错误':
        suggestions.push('增加识字量，重点练习笔画、部首、字形');
        suggestions.push('使用识字卡片，反复练习');
        break;
      case '词语错误':
        suggestions.push('积累词汇，重点练习近义词、反义词、词语搭配');
        suggestions.push('多阅读，在语境中理解词语含义');
        break;
      case '阅读理解-信息提取':
        suggestions.push('练习快速阅读，提高信息提取能力');
        suggestions.push('学会找关键词，定位原文依据');
        break;
      case '阅读理解-逻辑推理':
        suggestions.push('加强逻辑思维训练，学会分析文章结构');
        suggestions.push('多做阅读理解题，总结解题方法');
        break;
      case '作文-审题立意':
        suggestions.push('练习审题，明确写作要求');
        suggestions.push('学习立意方法，提高文章深度');
        break;
      case '作文-语言表达':
        suggestions.push('积累好词好句，丰富语言表达');
        suggestions.push('多读优秀范文，学习写作技巧');
        break;
      case '时间压力导致的错误':
        suggestions.push('练习限时答题，提高答题速度');
        suggestions.push('合理分配答题时间');
        break;
      default:
        suggestions.push('加强基础练习，巩固知识点');
        suggestions.push('多做练习题，提高熟练度');
    }

    return suggestions;
  }

  /**
   * 查找关联知识点
   */
  function findRelatedKnowledgePoints(wrongItem) {
    const { errorCode } = wrongItem;
    const mapping = {
      'B1': ['声母', '韵母', '声调', '音节'],
      'B2': ['笔画', '部首', '字形', '结构'],
      'B3': ['近义词', '反义词', '词语搭配', '成语'],
      'R1': ['信息提取', '理解分析', '概括归纳'],
      'R2': ['逻辑推理', '判断评价', '原文依据'],
      'W1': ['审题', '立意', '结构', '选材'],
      'W2': ['语言表达', '修辞手法', '描写方法'],
      'W3': ['标点符号', '病句修改', '句式变换'],
      'C1': ['综合运用', '迁移创新', '跨知识点']
    };

    return mapping[errorCode] || [];
  }

  /**
   * 生成训练计划
   */
  function generateTrainingPlan(analysis) {
    const plan = {
      phases: [],
      estimatedDuration: 0,
      dailyTasks: []
    };

    // 阶段1：知识点复习
    plan.phases.push({
      name: '知识点复习',
      duration: 7,
      tasks: analysis.relatedKnowledgePoints.map(kp => ({
        name: `${kp}专项训练`,
        type: 'practice',
        priority: 'high'
      }))
    });

    // 阶段2：错题练习
    plan.phases.push({
      name: '错题练习',
      duration: 14,
      tasks: [
        {
          name: '错题复习',
          type: 'review',
          priority: 'high'
        },
        {
          name: '同类题目练习',
          type: 'practice',
          priority: 'medium'
        }
      ]
    });

    // 阶段3：能力提升
    plan.phases.push({
      name: '能力提升',
      duration: 21,
      tasks: [
        {
          name: '综合训练',
          type: 'practice',
          priority: 'medium'
        },
        {
          name: '模拟测试',
          type: 'test',
          priority: 'low'
        }
      ]
    });

    plan.estimatedDuration = plan.phases.reduce((sum, phase) => sum + phase.duration, 0);

    // 生成每日任务
    plan.dailyTasks = generateDailyTasks(plan.phases);

    return plan;
  }

  /**
   * 生成每日任务
   */
  function generateDailyTasks(phases) {
    const tasks = [];
    let day = 1;

    phases.forEach(phase => {
      for (let i = 0; i < phase.duration; i++) {
        const dailyTask = {
          day: day++,
          tasks: phase.tasks.map(task => ({
            ...task,
            completed: false
          }))
        };
        tasks.push(dailyTask);
      }
    });

    return tasks;
  }

  // ==================== 错题知识点关联推荐 ====================

  /**
   * 推荐关联题目
   */
  function recommendRelatedQuestions(wrongItem, allExercises) {
    const recommendations = [];
    const { errorCode, knowledgePoints, difficulty } = wrongItem;

    // 推荐1：相同知识点
    if (knowledgePoints && knowledgePoints.length > 0) {
      const sameKP = allExercises.filter(e => 
        e.id !== wrongItem.exerciseId &&
        e.knowledgePoints &&
        e.knowledgePoints.some(kp => knowledgePoints.includes(kp))
      ).slice(0, 5);

      sameKP.forEach(e => {
        recommendations.push({
          exerciseId: e.id,
          type: 'same_knowledge_point',
          reason: '相同知识点练习',
          priority: 'high'
        });
      });
    }

    // 推荐2：相同错误码
    if (errorCode) {
      const sameErrorCode = allExercises.filter(e => 
        e.id !== wrongItem.exerciseId &&
        e.errorCode === errorCode
      ).slice(0, 3);

      sameErrorCode.forEach(e => {
        recommendations.push({
          exerciseId: e.id,
          type: 'same_error_code',
          reason: '同类错误针对性练习',
          priority: 'high'
        });
      });
    }

    // 推荐3：难度递进
    const levels = ['basic', 'improve', 'advanced', 'exam'];
    const currentIndex = levels.indexOf(difficulty || 'basic');
    
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1];
      const progressive = allExercises.filter(e => 
        e.id !== wrongItem.exerciseId &&
        e.difficulty === nextLevel
      ).slice(0, 3);

      progressive.forEach(e => {
        recommendations.push({
          exerciseId: e.id,
          type: 'progressive',
          reason: `难度提升至${nextLevel}`,
          priority: 'medium'
        });
      });
    }

    // 推荐4：综合应用
    const comprehensive = allExercises.filter(e => 
      e.id !== wrongItem.exerciseId &&
      e.type === '综合'
    ).slice(0, 2);

    comprehensive.forEach(e => {
      recommendations.push({
        exerciseId: e.id,
        type: 'comprehensive',
        reason: '综合应用练习',
        priority: 'low'
      });
    });

    return recommendations;
  }

  // ==================== 智能错题本管理 ====================

  /**
   * 添加错题
   */
  function addWrongItem(exerciseId, wrongAnswer, correctAnswer, errorCode, additionalData = {}) {
    const wrongItem = {
      id: generateWrongItemId(),
      exerciseId: exerciseId,
      wrongAnswer: wrongAnswer,
      correctAnswer: correctAnswer,
      errorCode: errorCode,
      errorCategory: classifyErrorType({ errorCode }),
      knowledgePoints: findRelatedKnowledgePoints({ errorCode }),
      timeSpent: additionalData.timeSpent || 0,
      difficulty: additionalData.difficulty || 'basic',
      timestamp: new Date().toISOString(),
      mastery: 'new',
      reviewCount: 0,
      nextReview: calculateNextReview(0, 'new'),
      relatedExercises: [],
      aiAnalysis: null,
      personalizedPlan: null
    };

    // 执行AI分析
    wrongItem.aiAnalysis = performAIAnalysis(wrongItem, additionalData.userData);

    return wrongItem;
  }

  /**
   * 更新错题复习结果
   */
  function updateWrongItemReview(wrongItemId, reviewResult) {
    const wrongItem = getWrongItem(wrongItemId);
    if (!wrongItem) return null;

    // 更新掌握程度
    updateMastery(wrongItem, reviewResult);

    // 如果已掌握，重新生成训练计划
    if (wrongItem.mastery === 'mastered') {
      wrongItem.personalizedPlan = null;
    } else {
      // 重新生成个性化训练计划
      wrongItem.personalizedPlan = generateTrainingPlan(wrongItem.aiAnalysis);
    }

    return wrongItem;
  }

  /**
   * 获取需要复习的错题
   */
  function getDueWrongItems(wrongList) {
    const now = new Date().toISOString();
    
    return wrongList.filter(w => 
      w.mastery !== 'mastered' &&
      w.nextReview &&
      w.nextReview <= now
    ).sort((a, b) => {
      // 优先级：高严重度 > 低复习次数 > 临近复习时间
      const severityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      const aSeverity = severityOrder[a.aiAnalysis?.severity] || 2;
      const bSeverity = severityOrder[b.aiAnalysis?.severity] || 2;
      
      if (aSeverity !== bSeverity) {
        return aSeverity - bSeverity;
      }
      
      return a.reviewCount - b.reviewCount;
    });
  }

  /**
   * 获取错题统计
   */
  function getWrongListStatistics(wrongList) {
    const stats = {
      total: wrongList.length,
      byCategory: {},
      bySeverity: {},
      byMastery: {},
      averageReviewCount: 0,
      masteredCount: 0,
      learningCount: 0,
      newCount: 0
    };

    wrongList.forEach(w => {
      // 按类别统计
      const category = w.errorCategory || '未知';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

      // 按严重程度统计
      const severity = w.aiAnalysis?.severity || 'medium';
      stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;

      // 按掌握程度统计
      const mastery = w.mastery || 'new';
      stats.byMastery[mastery] = (stats.byMastery[mastery] || 0) + 1;

      // 统计掌握程度数量
      if (mastery === 'mastered') stats.masteredCount++;
      else if (mastery === 'learning') stats.learningCount++;
      else stats.newCount++;

      // 累计复习次数
      stats.averageReviewCount += w.reviewCount || 0;
    });

    // 计算平均复习次数
    if (wrongList.length > 0) {
      stats.averageReviewCount = Math.round(stats.averageReviewCount / wrongList.length);
    }

    return stats;
  }

  /**
   * 生成错题报告
   */
  function generateWrongListReport(wrongList) {
    const stats = getWrongListStatistics(wrongList);
    const dueItems = getDueWrongItems(wrongList);

    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalWrong: stats.total,
        mastered: stats.masteredCount,
        learning: stats.learningCount,
        new: stats.newCount,
        dueForReview: dueItems.length,
        masteryRate: stats.total > 0 ? Math.round((stats.masteredCount / stats.total) * 100) : 0
      },
      errorDistribution: stats.byCategory,
      severityDistribution: stats.bySeverity,
      topErrors: getTopErrors(wrongList, 5),
      recommendations: generateRecommendations(stats, wrongList),
      actionItems: generateActionItems(dueItems)
    };

    return report;
  }

  /**
   * 获取高频错误
   */
  function getTopErrors(wrongList, limit = 5) {
    const errorCounts = {};

    wrongList.forEach(w => {
      const category = w.errorCategory || '未知';
      errorCounts[category] = (errorCounts[category] || 0) + 1;
    });

    return Object.entries(errorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([category, count]) => ({ category, count }));
  }

  /**
   * 生成建议
   */
  function generateRecommendations(stats, wrongList) {
    const recommendations = [];

    // 建议基于错误分布
    const topError = Object.entries(stats.byCategory)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (topError) {
      recommendations.push({
        type: 'focus_area',
        priority: 'high',
        title: `重点加强${topError[0]}`,
        description: `${topError[0]}类错误占比最高，建议专项训练`
      });
    }

    // 建议基于掌握程度
    if (stats.newCount > stats.total * 0.5) {
      recommendations.push({
        type: 'new_errors',
        priority: 'high',
        title: '及时复习新错题',
        description: '新错题较多，建议及时复习，防止遗忘'
      });
    }

    // 建议基于严重程度
    const highSeverityCount = stats.bySeverity['high'] || 0;
    if (highSeverityCount > 0) {
      recommendations.push({
        type: 'high_severity',
        priority: 'high',
        title: '优先处理高严重度错误',
        description: '有高严重度错误，建议优先处理'
      });
    }

    return recommendations;
  }

  /**
   * 生成行动项
   */
  function generateActionItems(dueItems) {
    const actionItems = [];

    dueItems.slice(0, 5).forEach(item => {
      actionItems.push({
        id: item.id,
        type: 'review',
        title: `复习错题：${item.exerciseId}`,
        priority: item.aiAnalysis?.severity || 'medium',
        estimatedTime: 5
      });
    });

    return actionItems;
  }

  // ==================== 工具函数 ====================

  function generateWrongItemId() {
    return `wrong_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function getWrongItem(wrongItemId) {
    const wrongList = JSON.parse(localStorage.getItem('wrongList') || '[]');
    return wrongList.find(w => w.id === wrongItemId);
  }

  // ==================== 导出API ====================

  window.SmartWrongNotebook = {
    // 错题管理
    addWrongItem,
    updateWrongItemReview,
    getDueWrongItems,
    getWrongListStatistics,
    
    // AI分析
    performAIAnalysis,
    
    // 推荐系统
    recommendRelatedQuestions,
    
    // 报告生成
    generateWrongListReport,
    
    // 间隔重复算法
    calculateNextReview,
    updateMastery,
    
    // 工具函数
    classifyErrorType,
    assessErrorSeverity,
    identifyRootCause,
    generateSuggestions,
    findRelatedKnowledgePoints
  };

  console.log('✅ 智能错题本系统已加载');
})();