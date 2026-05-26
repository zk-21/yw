/**
 * 增强版智能学习路径推荐引擎
 * 包含：基于学习行为的智能推荐、难度自适应调整、学习路径优化、AI错因分析、个性化训练计划
 */
(function() {
  'use strict';

  // ==================== 核心配置 ====================

  // 能力等级定义
  const SKILL_LEVELS = {
    NOVICE: { label: '入门', minScore: 0, maxScore: 30, color: '#ef4444' },
    BEGINNER: { label: '初级', minScore: 31, maxScore: 50, color: '#f97316' },
    INTERMEDIATE: { label: '中级', minScore: 51, maxScore: 70, color: '#eab308' },
    ADVANCED: { label: '高级', minScore: 71, maxScore: 85, color: '#22c55e' },
    EXPERT: { label: '拔尖', minScore: 86, maxScore: 100, color: '#3b82f6' }
  };

  // 知识点权重配置
  const SKILL_WEIGHTS = {
    '阅读': { baseWeight: 1.0, difficultyMultiplier: 1.1 },
    '作文': { baseWeight: 1.0, difficultyMultiplier: 1.2 },
    '基础知识': { baseWeight: 0.8, difficultyMultiplier: 0.9 },
    '口语表达': { baseWeight: 0.7, difficultyMultiplier: 0.85 }
  };

  // 难度等级定义
  const DIFFICULTY_LEVELS = {
    'basic': { label: '基础', minScore: 0, maxScore: 60, step: 0.1 },
    'improve': { label: '提高', minScore: 61, maxScore: 80, step: 0.08 },
    'advanced': { label: '拔尖', minScore: 81, maxScore: 90, step: 0.05 },
    'exam': { label: '小升初', minScore: 91, maxScore: 100, step: 0.03 }
  };

  // 错因码映射到知识点
  const ERROR_CODE_MAPPING = {
    'B1': { category: '拼音', knowledgePoints: ['声母', '韵母', '声调'], relatedSkills: ['基础知识'] },
    'B2': { category: '识字', knowledgePoints: ['笔画', '部首', '字形'], relatedSkills: ['基础知识'] },
    'B3': { category: '词语', knowledgePoints: ['近义词', '反义词', '词语搭配'], relatedSkills: ['基础知识'] },
    'R1': { category: '阅读理解', knowledgePoints: ['信息提取', '理解分析', '概括归纳'], relatedSkills: ['阅读'] },
    'R2': { category: '阅读理解', knowledgePoints: ['原文依据', '逻辑推理', '判断评价'], relatedSkills: ['阅读'] },
    'W1': { category: '作文', knowledgePoints: ['审题', '立意', '结构'], relatedSkills: ['作文'] },
    'W2': { category: '作文', knowledgePoints: ['语言表达', '修辞手法', '描写方法'], relatedSkills: ['作文'] },
    'W3': { category: '作文', knowledgePoints: ['标点符号', '病句修改', '句式变换'], relatedSkills: ['基础知识'] },
    'C1': { category: '综合', knowledgePoints: ['综合运用', '迁移创新'], relatedSkills: ['阅读', '作文'] }
  };

  // ==================== 学习行为分析 ====================

  /**
   * 分析用户学习行为
   */
  function analyzeLearningBehavior(userData) {
    const { wrongList, practiceHistory, lastResult } = userData;
    
    const behavior = {
      totalPractices: practiceHistory?.length || 0,
      averageAccuracy: calculateAverageAccuracy(practiceHistory),
      averageTimePerQuestion: calculateAverageTime(practiceHistory),
      errorFrequency: calculateErrorFrequency(wrongList),
      improvementRate: calculateImprovementRate(practiceHistory),
      preferredDifficulty: calculatePreferredDifficulty(practiceHistory),
      activeTimeSlots: calculateActiveTimeSlots(practiceHistory),
      consistency: calculateConsistency(practiceHistory)
    };

    return behavior;
  }

  /**
   * 计算平均正确率
   */
  function calculateAverageAccuracy(practiceHistory) {
    if (!practiceHistory || practiceHistory.length === 0) return 0;
    
    const total = practiceHistory.reduce((sum, p) => sum + (p.accuracy || 0), 0);
    return Math.round(total / practiceHistory.length);
  }

  /**
   * 计算平均每题用时
   */
  function calculateAverageTime(practiceHistory) {
    if (!practiceHistory || practiceHistory.length === 0) return 0;
    
    const totalTime = practiceHistory.reduce((sum, p) => sum + (p.duration || 0), 0);
    const totalQuestions = practiceHistory.reduce((sum, p) => sum + (p.questionCount || 0), 0);
    
    return totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;
  }

  /**
   * 计算错误频率
   */
  function calculateErrorFrequency(wrongList) {
    if (!wrongList || wrongList.length === 0) return {};

    const frequency = {};
    wrongList.forEach(w => {
      const errorCode = w.errorCode || 'unknown';
      frequency[errorCode] = (frequency[errorCode] || 0) + 1;
    });

    return frequency;
  }

  /**
   * 计算进步率
   */
  function calculateImprovementRate(practiceHistory) {
    if (!practiceHistory || practiceHistory.length < 2) return 0;

    const recent = practiceHistory.slice(-5);
    const recentAvg = recent.reduce((sum, p) => sum + (p.accuracy || 0), 0) / recent.length;
    
    const earlier = practiceHistory.slice(0, -5);
    const earlierAvg = earlier.length > 0 ? 
      earlier.reduce((sum, p) => sum + (p.accuracy || 0), 0) / earlier.length : recentAvg;

    return Math.round(((recentAvg - earlierAvg) / earlierAvg) * 100);
  }

  /**
   * 计算偏好的难度
   */
  function calculatePreferredDifficulty(practiceHistory) {
    if (!practiceHistory || practiceHistory.length === 0) return 'basic';

    const difficultyCount = {};
    practiceHistory.forEach(p => {
      const difficulty = p.difficulty || 'basic';
      difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
    });

    return Object.entries(difficultyCount)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * 计算活跃时间段
   */
  function calculateActiveTimeSlots(practiceHistory) {
    if (!practiceHistory || practiceHistory.length === 0) return [];

    const timeSlots = {};
    practiceHistory.forEach(p => {
      if (p.timestamp) {
        const hour = new Date(p.timestamp).getHours();
        const slot = hour < 12 ? '上午' : hour < 18 ? '下午' : '晚上';
        timeSlots[slot] = (timeSlots[slot] || 0) + 1;
      }
    });

    return Object.entries(timeSlots)
      .sort((a, b) => b[1] - a[1])
      .map(([slot, count]) => ({ slot, count }));
  }

  /**
   * 计算学习一致性
   */
  function calculateConsistency(practiceHistory) {
    if (!practiceHistory || practiceHistory.length < 7) return 0;

    const last7Days = practiceHistory.slice(-7);
    const days = new Set(last7Days.map(p => 
      new Date(p.timestamp).toDateString()
    )).size;

    return Math.round((days / 7) * 100);
  }

  // ==================== 难度自适应调整 ====================

  /**
   * 根据用户表现调整难度
   */
  function adjustDifficulty(userData) {
    const { lastResult, wrongList, practiceHistory } = userData;
    const behavior = analyzeLearningBehavior(userData);

    let currentDifficulty = 'basic';
    let adjustmentReason = '';

    // 基于最近表现调整
    if (lastResult && lastResult.totalScore) {
      const score = lastResult.totalScore;
      
      if (score >= 90 && currentDifficulty !== 'exam') {
        currentDifficulty = 'exam';
        adjustmentReason = '表现优秀，提升至小升初难度';
      } else if (score >= 80 && currentDifficulty !== 'advanced') {
        currentDifficulty = 'advanced';
        adjustmentReason = '表现良好，提升至拔尖难度';
      } else if (score >= 60 && currentDifficulty !== 'improve') {
        currentDifficulty = 'improve';
        adjustmentReason = '表现稳定，提升至提高难度';
      } else if (score < 50 && currentDifficulty !== 'basic') {
        currentDifficulty = 'basic';
        adjustmentReason = '需要巩固基础，调整为基础难度';
      }
    }

    // 基于错误频率微调
    const errorFreq = behavior.errorFrequency;
    const totalErrors = Object.values(errorFreq).reduce((sum, count) => sum + count, 0);
    
    if (totalErrors > 10 && currentDifficulty !== 'basic') {
      currentDifficulty = 'basic';
      adjustmentReason = '错误较多，建议巩固基础';
    }

    // 基于进步率调整
    if (behavior.improvementRate > 20 && currentDifficulty !== 'exam') {
      const levels = ['basic', 'improve', 'advanced', 'exam'];
      const currentIndex = levels.indexOf(currentDifficulty);
      if (currentIndex < levels.length - 1) {
        currentDifficulty = levels[currentIndex + 1];
        adjustmentReason = '进步明显，提升难度';
      }
    }

    return {
      currentDifficulty,
      adjustmentReason,
      suggestedDifficulty: calculateSuggestedDifficulty(behavior),
      confidence: calculateDifficultyConfidence(behavior)
    };
  }

  /**
   * 计算建议难度
   */
  function calculateSuggestedDifficulty(behavior) {
    const avgAccuracy = behavior.averageAccuracy;
    const improvementRate = behavior.improvementRate;

    if (avgAccuracy >= 90 && improvementRate >= 10) {
      return 'exam';
    } else if (avgAccuracy >= 80) {
      return 'advanced';
    } else if (avgAccuracy >= 60) {
      return 'improve';
    } else {
      return 'basic';
    }
  }

  /**
   * 计算难度调整置信度
   */
  function calculateDifficultyConfidence(behavior) {
    let confidence = 0.5;

    if (behavior.totalPractices >= 10) confidence += 0.2;
    if (behavior.consistency >= 70) confidence += 0.2;
    if (behavior.improvementRate !== 0) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  // ==================== AI错因分析 ====================

  /**
   * AI错因分析
   */
  function analyzeErrorCauses(wrongList) {
    if (!wrongList || wrongList.length === 0) {
      return {
        totalErrors: 0,
        errorCategories: {},
        weakKnowledgePoints: [],
        errorPatterns: [],
        suggestions: []
      };
    }

    const analysis = {
      totalErrors: wrongList.length,
      errorCategories: {},
      weakKnowledgePoints: [],
      errorPatterns: [],
      suggestions: []
    };

    // 分析错误类别
    wrongList.forEach(wrong => {
      const errorCode = wrong.errorCode || 'unknown';
      const mapping = ERROR_CODE_MAPPING[errorCode] || { category: '未知', knowledgePoints: [] };
      
      if (!analysis.errorCategories[mapping.category]) {
        analysis.errorCategories[mapping.category] = 0;
      }
      analysis.errorCategories[mapping.category]++;

      // 收集薄弱知识点
      mapping.knowledgePoints.forEach(kp => {
        if (!analysis.weakKnowledgePoints.includes(kp)) {
          analysis.weakKnowledgePoints.push(kp);
        }
      });
    });

    // 分析错误模式
    analysis.errorPatterns = detectErrorPatterns(wrongList);

    // 生成建议
    analysis.suggestions = generateErrorSuggestions(analysis);

    return analysis;
  }

  /**
   * 检测错误模式
   */
  function detectErrorPatterns(wrongList) {
    const patterns = [];

    // 模式1：同一知识点反复出错
    const knowledgePointErrors = {};
    wrongList.forEach(w => {
      const errorCode = w.errorCode || 'unknown';
      const mapping = ERROR_CODE_MAPPING[errorCode];
      if (mapping) {
        mapping.knowledgePoints.forEach(kp => {
          if (!knowledgePointErrors[kp]) {
            knowledgePointErrors[kp] = [];
          }
          knowledgePointErrors[kp].push(w);
        });
      }
    });

    Object.entries(knowledgePointErrors).forEach(([kp, errors]) => {
      if (errors.length >= 3) {
        patterns.push({
          type: 'repeated_error',
          description: `"${kp}"知识点反复出错（${errors.length}次）`,
          severity: 'high',
          relatedExercises: errors.map(e => e.id)
        });
      }
    });

    // 模式2：时间相关错误
    const timeRelatedErrors = wrongList.filter(w => w.timeSpent && w.timeSpent > 60);
    if (timeRelatedErrors.length > wrongList.length * 0.3) {
      patterns.push({
        type: 'time_pressure',
        description: '答题时间过长，可能存在时间压力',
        severity: 'medium',
        suggestion: '建议加强时间管理训练'
      });
    }

    // 模式3：难度相关错误
    const difficultyErrors = {};
    wrongList.forEach(w => {
      const difficulty = w.difficulty || 'basic';
      difficultyErrors[difficulty] = (difficultyErrors[difficulty] || 0) + 1;
    });

    const maxDifficultyErrors = Object.entries(difficultyErrors)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (maxDifficultyErrors && maxDifficultyErrors[1] >= 3) {
      patterns.push({
        type: 'difficulty_related',
        description: `${maxDifficultyErrors[0]}难度题目错误较多`,
        severity: 'medium',
        suggestion: `建议先巩固${maxDifficultyErrors[0]}难度基础`
      });
    }

    return patterns;
  }

  /**
   * 生成错误建议
   */
  function generateErrorSuggestions(analysis) {
    const suggestions = [];

    // 基于错误类别生成建议
    Object.entries(analysis.errorCategories).forEach(([category, count]) => {
      const percentage = Math.round((count / analysis.totalErrors) * 100);
      
      if (percentage >= 40) {
        suggestions.push({
          type: 'focus_area',
          priority: 'high',
          title: `重点加强${category}`,
          description: `${category}类错误占比${percentage}%，建议专项训练`,
          action: `前往${category}专项训练`
        });
      }
    });

    // 基于错误模式生成建议
    analysis.errorPatterns.forEach(pattern => {
      if (pattern.type === 'repeated_error') {
        suggestions.push({
          type: 'repeated_practice',
          priority: 'high',
          title: '针对性复习',
          description: pattern.description,
          action: '查看错题本，针对性复习'
        });
      } else if (pattern.type === 'time_pressure') {
        suggestions.push({
          type: 'time_management',
          priority: 'medium',
          title: '时间管理训练',
          description: pattern.description,
          action: '练习限时答题'
        });
      }
    });

    return suggestions;
  }

  // ==================== 个性化训练计划生成 ====================

  /**
   * 生成个性化训练计划
   */
  function generatePersonalizedPlan(userData) {
    const { wrongList, lastResult, practiceHistory } = userData;
    const behavior = analyzeLearningBehavior(userData);
    const difficultyAdjustment = adjustDifficulty(userData);
    const errorAnalysis = analyzeErrorCauses(wrongList);

    const plan = {
      planId: generatePlanId(),
      createdAt: new Date().toISOString(),
      userLevel: calculateUserLevel(behavior),
      targetDifficulty: difficultyAdjustment.currentDifficulty,
      duration: calculatePlanDuration(behavior),
      modules: []
    };

    // 模块1：错题复习
    if (wrongList.length > 0) {
      plan.modules.push({
        id: 'error_review',
        name: '错题复习',
        priority: 'high',
        duration: Math.min(wrongList.length * 5, 30),
        exercises: selectErrorReviewExercises(wrongList, errorAnalysis),
        objectives: errorAnalysis.weakKnowledgePoints
      });
    }

    // 模块2：薄弱点强化
    if (errorAnalysis.weakKnowledgePoints.length > 0) {
      plan.modules.push({
        id: 'weak_point_training',
        name: '薄弱点强化',
        priority: 'high',
        duration: 25,
        exercises: selectWeakPointExercises(errorAnalysis, difficultyAdjustment),
        objectives: errorAnalysis.weakKnowledgePoints.slice(0, 3)
      });
    }

    // 模块3：能力提升
    plan.modules.push({
      id: 'skill_improvement',
      name: '能力提升',
      priority: 'medium',
      duration: 20,
      exercises: selectSkillImprovementExercises(behavior, difficultyAdjustment),
      objectives: ['阅读理解', '作文', '基础知识']
    });

    // 模块4：综合训练
    if (behavior.totalPractices >= 5) {
      plan.modules.push({
        id: 'comprehensive_training',
        name: '综合训练',
        priority: 'low',
        duration: 30,
        exercises: selectComprehensiveExercises(difficultyAdjustment),
        objectives: ['综合运用', '迁移创新']
      });
    }

    return plan;
  }

  /**
   * 计算用户等级
   */
  function calculateUserLevel(behavior) {
    const score = behavior.averageAccuracy + (behavior.improvementRate * 0.5) + (behavior.consistency * 0.3);
    
    for (const [key, level] of Object.entries(SKILL_LEVELS)) {
      if (score >= level.minScore && score <= level.maxScore) {
        return { id: key, ...level };
      }
    }
    return SKILL_LEVELS.NOVICE;
  }

  /**
   * 计算计划时长
   */
  function calculatePlanDuration(behavior) {
    let baseDuration = 60;
    
    if (behavior.consistency >= 80) baseDuration += 20;
    if (behavior.improvementRate > 10) baseDuration += 10;
    
    return baseDuration;
  }

  /**
   * 选择错题复习题目
   */
  function selectErrorReviewExercises(wrongList, errorAnalysis) {
    const now = new Date().toISOString();
    
    // 优先选择超期未复习的错题
    const overdue = wrongList.filter(w => 
      w.mastery !== 'mastered' && w.nextReview && w.nextReview < now
    ).slice(0, 5);

    // 再选择高错误频率的错题
    const highFreq = wrongList.filter(w => 
      !overdue.includes(w) && w.mastery !== 'mastered'
    ).slice(0, 5);

    return [...overdue, ...highFreq].map(w => ({
      id: w.id,
      type: 'error_review',
      priority: 'high',
      errorCode: w.errorCode
    }));
  }

  /**
   * 选择薄弱点训练题目
   */
  function selectWeakPointExercises(errorAnalysis, difficultyAdjustment) {
    const exercises = [];
    
    errorAnalysis.weakKnowledgePoints.forEach(kp => {
      exercises.push({
        id: generateExerciseId(),
        type: 'weak_point',
        knowledgePoint: kp,
        difficulty: difficultyAdjustment.currentDifficulty,
        priority: 'high'
      });
    });

    return exercises.slice(0, 10);
  }

  /**
   * 选择能力提升题目
   */
  function selectSkillImprovementExercises(behavior, difficultyAdjustment) {
    const exercises = [];
    const skills = ['阅读', '作文', '基础知识'];
    
    skills.forEach(skill => {
      exercises.push({
        id: generateExerciseId(),
        type: 'skill_improvement',
        skill: skill,
        difficulty: difficultyAdjustment.currentDifficulty,
        priority: 'medium'
      });
    });

    return exercises;
  }

  /**
   * 选择综合训练题目
   */
  function selectComprehensiveExercises(difficultyAdjustment) {
    const exercises = [];
    
    for (let i = 0; i < 5; i++) {
      exercises.push({
        id: generateExerciseId(),
        type: 'comprehensive',
        difficulty: difficultyAdjustment.currentDifficulty,
        priority: 'low'
      });
    }

    return exercises;
  }

  // ==================== 错题知识点关联推荐 ====================

  /**
   * 错题知识点关联推荐
   */
  function recommendRelatedExercises(wrongExerciseId, wrongList, allExercises) {
    const wrongExercise = wrongList.find(w => w.id === wrongExerciseId);
    if (!wrongExercise) return [];

    const errorCode = wrongExercise.errorCode || 'unknown';
    const mapping = ERROR_CODE_MAPPING[errorCode];
    
    if (!mapping) return [];

    const recommendations = [];

    // 推荐1：相同知识点的其他题目
    const sameKnowledgePoint = allExercises.filter(e => 
      e.id !== wrongExerciseId &&
      mapping.knowledgePoints.some(kp => 
        e.knowledgePoints && e.knowledgePoints.includes(kp)
      )
    ).slice(0, 3);

    sameKnowledgePoint.forEach(e => {
      recommendations.push({
        id: e.id,
        type: 'same_knowledge_point',
        reason: '相同知识点练习',
        knowledgePoints: mapping.knowledgePoints,
        priority: 'high'
      });
    });

    // 推荐2：相同错误码的题目
    const sameErrorCode = allExercises.filter(e => 
      e.id !== wrongExerciseId &&
      e.errorCode === errorCode
    ).slice(0, 2);

    sameErrorCode.forEach(e => {
      recommendations.push({
        id: e.id,
        type: 'same_error_code',
        reason: '同类错误针对性练习',
        priority: 'high'
      });
    });

    // 推荐3：相关技能的题目
    mapping.relatedSkills.forEach(skill => {
      const relatedSkillExercises = allExercises.filter(e => 
        e.id !== wrongExerciseId &&
        e.skills && e.skills.includes(skill)
      ).slice(0, 2);

      relatedSkillExercises.forEach(e => {
        recommendations.push({
          id: e.id,
          type: 'related_skill',
          reason: `${skill}能力提升`,
          skill: skill,
          priority: 'medium'
        });
      });
    });

    // 推荐4：难度递进的题目
    const currentDifficulty = wrongExercise.difficulty || 'basic';
    const levels = ['basic', 'improve', 'advanced', 'exam'];
    const currentIndex = levels.indexOf(currentDifficulty);
    
    if (currentIndex < levels.length - 1) {
      const nextDifficulty = levels[currentIndex + 1];
      const progressiveExercises = allExercises.filter(e => 
        e.id !== wrongExerciseId &&
        e.difficulty === nextDifficulty
      ).slice(0, 2);

      progressiveExercises.forEach(e => {
        recommendations.push({
          id: e.id,
          type: 'progressive',
          reason: `难度提升至${DIFFICULTY_LEVELS[nextDifficulty].label}`,
          difficulty: nextDifficulty,
          priority: 'low'
        });
      });
    }

    return recommendations;
  }

  // ==================== 学习路径优化 ====================

  /**
   * 优化学习路径
   */
  function optimizeLearningPath(userData) {
    const { wrongList, lastResult, practiceHistory } = userData;
    const behavior = analyzeLearningBehavior(userData);
    const difficultyAdjustment = adjustDifficulty(userData);
    const errorAnalysis = analyzeErrorCauses(wrongList);

    const path = {
      pathId: generatePathId(),
      createdAt: new Date().toISOString(),
      currentPhase: determineCurrentPhase(behavior),
      phases: [],
      milestones: [],
      estimatedCompletion: estimateCompletion(behavior)
    };

    // 阶段1：基础巩固
    if (behavior.averageAccuracy < 60) {
      path.phases.push({
        id: 'foundation',
        name: '基础巩固',
        duration: 14,
        objectives: ['掌握基础知识', '提高正确率'],
        tasks: generateFoundationTasks(errorAnalysis)
      });
    }

    // 阶段2：能力提升
    if (behavior.averageAccuracy >= 60 && behavior.averageAccuracy < 80) {
      path.phases.push({
        id: 'improvement',
        name: '能力提升',
        duration: 21,
        objectives: ['提升阅读能力', '加强作文训练'],
        tasks: generateImprovementTasks(behavior)
      });
    }

    // 阶段3：综合应用
    if (behavior.averageAccuracy >= 80) {
      path.phases.push({
        id: 'application',
        name: '综合应用',
        duration: 28,
        objectives: ['综合运用', '迁移创新'],
        tasks: generateApplicationTasks(difficultyAdjustment)
      });
    }

    // 设置里程碑
    path.milestones = generateMilestones(path.phases);

    return path;
  }

  /**
   * 确定当前阶段
   */
  function determineCurrentPhase(behavior) {
    if (behavior.averageAccuracy < 60) return 'foundation';
    if (behavior.averageAccuracy < 80) return 'improvement';
    return 'application';
  }

  /**
   * 生成基础巩固任务
   */
  function generateFoundationTasks(errorAnalysis) {
    const tasks = [];
    
    errorAnalysis.weakKnowledgePoints.forEach(kp => {
      tasks.push({
        id: generateTaskId(),
        name: `${kp}专项训练`,
        type: 'practice',
        duration: 10,
        priority: 'high'
      });
    });

    return tasks;
  }

  /**
   * 生成能力提升任务
   */
  function generateImprovementTasks(behavior) {
    const tasks = [];
    
    tasks.push({
      id: generateTaskId(),
      name: '阅读理解训练',
      type: 'practice',
      duration: 15,
      priority: 'high'
    });

    tasks.push({
      id: generateTaskId(),
      name: '作文写作练习',
      type: 'practice',
      duration: 20,
      priority: 'medium'
    });

    return tasks;
  }

  /**
   * 生成综合应用任务
   */
  function generateApplicationTasks(difficultyAdjustment) {
    const tasks = [];
    
    tasks.push({
      id: generateTaskId(),
      name: '综合测试',
      type: 'test',
      duration: 30,
      priority: 'high'
    });

    tasks.push({
      id: generateTaskId(),
      name: '小升初模拟',
      type: 'exam',
      duration: 45,
      priority: 'medium'
    });

    return tasks;
  }

  /**
   * 生成里程碑
   */
  function generateMilestones(phases) {
    const milestones = [];
    let cumulativeDays = 0;

    phases.forEach(phase => {
      cumulativeDays += phase.duration;
      milestones.push({
        id: generateMilestoneId(),
        name: `${phase.name}完成`,
        targetDate: cumulativeDays,
        objectives: phase.objectives
      });
    });

    return milestones;
  }

  /**
   * 估算完成时间
   */
  function estimateCompletion(behavior) {
    const baseDays = 30;
    const consistencyBonus = behavior.consistency >= 70 ? -5 : 5;
    const improvementBonus = behavior.improvementRate > 10 ? -3 : 3;
    
    return Math.max(baseDays + consistencyBonus + improvementBonus, 14);
  }

  // ==================== 工具函数 ====================

  function generatePlanId() {
    return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function generatePathId() {
    return `path_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function generateExerciseId() {
    return `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function generateMilestoneId() {
    return `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ==================== 导出API ====================

  window.LearningPathEnhanced = {
    // 学习行为分析
    analyzeLearningBehavior,
    
    // 难度自适应
    adjustDifficulty,
    
    // AI错因分析
    analyzeErrorCauses,
    
    // 个性化训练计划
    generatePersonalizedPlan,
    
    // 错题知识点关联推荐
    recommendRelatedExercises,
    
    // 学习路径优化
    optimizeLearningPath,
    
    // 工具函数
    SKILL_LEVELS,
    DIFFICULTY_LEVELS,
    ERROR_CODE_MAPPING
  };

  console.log('✅ 增强版学习路径推荐引擎已加载');
})();