// 个性化学习路径推荐引擎
window.PersonalizedRecommender = (function() {
  // 模拟用户学习数据
  let userData = {
    grade: '3',
    completedExercises: [],
    wrongItems: [],
    learningHistory: [],
    preferences: {
      preferredTime: 'afternoon',
      difficulty: 'medium'
    }
  };

  // 加载用户数据
  function loadUserData() {
    try {
      const saved = localStorage.getItem('learningUserData');
      if (saved) {
        userData = JSON.parse(saved);
      }
    } catch (e) {
      console.error('加载用户数据失败:', e);
    }
  }

  // 保存用户数据
  function saveUserData() {
    try {
      localStorage.setItem('learningUserData', JSON.stringify(userData));
    } catch (e) {
      console.error('保存用户数据失败:', e);
    }
  }

  // 获取推荐任务列表
  function getRecommendedTasks(count = 5) {
    const tasks = [];
    
    // 1. 错题复练优先
    if (userData.wrongItems.length > 0) {
      const recentWrong = userData.wrongItems.slice(0, 2).map(item => ({
        id: `wrong_${item.id}`,
        type: 'review',
        title: `复习: ${item.question}`,
        description: '针对错题进行巩固练习',
        priority: 'high',
        link: `practice.html#wrong-${item.id}`
      }));
      tasks.push(...recentWrong);
    }

    // 2. 基于学习历史推荐
    const historyPattern = analyzeHistory();
    if (historyPattern.weakSkills.length > 0) {
      const skillTask = {
        id: `skill_${historyPattern.weakSkills[0]}`,
        type: 'skill',
        title: `强化: ${getSkillName(historyPattern.weakSkills[0])}`,
        description: '针对薄弱环节进行专项训练',
        priority: 'medium',
        link: getSkillLink(historyPattern.weakSkills[0])
      };
      tasks.push(skillTask);
    }

    // 3. 年级同步任务
    const gradeTasks = getGradeTasks(userData.grade);
    tasks.push(...gradeTasks.slice(0, count - tasks.length));

    // 4. 拓展任务
    const expandTasks = getExpandTasks();
    tasks.push(...expandTasks.slice(0, count - tasks.length));

    return tasks.slice(0, count);
  }

  // 分析学习历史
  function analyzeHistory() {
    const pattern = {
      weakSkills: [],
      strongSkills: [],
      learningSpeed: 'normal',
      preferredTopics: []
    };

    // 简单分析错题分布
    const skillCount = {};
    userData.wrongItems.forEach(item => {
      const skill = item.skill || 'unknown';
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });

    // 找出薄弱技能
    Object.entries(skillCount).forEach(([skill, count]) => {
      if (count >= 2) {
        pattern.weakSkills.push(skill);
      }
    });

    return pattern;
  }

  // 获取技能名称
  function getSkillName(skillId) {
    const skillMap = {
      'B1': '字词拼音',
      'R1': '概括能力',
      'R2': '原文依据',
      'R3': '赏析语言',
      'R4': '材料数据',
      'W1': '写话观察',
      'W2': '重点段',
      'W3': '审题扣题',
      'C1': '综合题型'
    };
    return skillMap[skillId] || skillId;
  }

  // 获取技能链接
  function getSkillLink(skillId) {
    return `practice.html#pack-${skillId.toLowerCase()}`;
  }

  // 获取年级任务
  function getGradeTasks(grade) {
    const gradeTaskMap = {
      '1': [
        { id: 'g1_pinyin', type: 'practice', title: '拼音拼读练习', description: '巩固声母韵母拼读', priority: 'high', link: 'pinyin.html' },
        { id: 'g1_char', type: 'practice', title: '识字练习', description: '常用汉字认读', priority: 'high', link: 'practice.html#g1_003' }
      ],
      '2': [
        { id: 'g2_word', type: 'practice', title: '词语积累', description: '近义词反义词辨析', priority: 'high', link: 'vocabulary.html' },
        { id: 'g2_sentence', type: 'practice', title: '句子训练', description: '扩句缩句练习', priority: 'medium', link: 'grammar.html' }
      ],
      '3': [
        { id: 'g3_paragraph', type: 'practice', title: '段落阅读', description: '自然段理解训练', priority: 'high', link: 'practice.html#g3_002' },
        { id: 'g3_writing', type: 'practice', title: '片段写作', description: '看图写话练习', priority: 'high', link: 'composition.html' }
      ],
      '4': [
        { id: 'g4_reading', type: 'practice', title: '阅读理解', description: '记叙文阅读训练', priority: 'high', link: 'practice.html#g4_001' },
        { id: 'g4_essay', type: 'practice', title: '作文练习', description: '完整作文写作', priority: 'high', link: 'composition.html' }
      ],
      '5': [
        { id: 'g5_synthesis', type: 'practice', title: '综合阅读', description: '多种文体阅读', priority: 'high', link: 'practice.html#g5_001' },
        { id: 'g5_rhetoric', type: 'practice', title: '修辞赏析', description: '修辞手法分析', priority: 'medium', link: 'grammar.html#rhetoric' }
      ],
      '6': [
        { id: 'g6_comprehensive', type: 'practice', title: '小升初综合', description: '小升初专题训练', priority: 'high', link: 'practice.html#g6_001' },
        { id: 'g6_review', type: 'practice', title: '系统复习', description: '全年级知识梳理', priority: 'high', link: 'knowledge-map.html' }
      ]
    };
    return gradeTaskMap[grade] || [];
  }

  // 获取拓展任务
  function getExpandTasks() {
    return [
      { id: 'expand_read', type: 'expand', title: '课外阅读', description: '推荐阅读材料', priority: 'low', link: 'reading.html' },
      { id: 'expand_vocab', type: 'expand', title: '词汇拓展', description: '成语典故学习', priority: 'low', link: 'vocabulary.html#idioms' }
    ];
  }

  // 记录学习记录
  function recordLearning(exerciseId, result, timeSpent) {
    const record = {
      exerciseId,
      result,
      timeSpent,
      timestamp: Date.now()
    };
    userData.learningHistory.push(record);
    
    // 保存
    saveUserData();
  }

  // 添加错题
  function addWrongItem(item) {
    userData.wrongItems.push({
      ...item,
      addedTime: Date.now(),
      reviewCount: 0
    });
    saveUserData();
  }

  // 更新用户年级
  function updateGrade(grade) {
    userData.grade = grade;
    saveUserData();
  }

  // 获取学习统计
  function getLearningStats() {
    const total = userData.learningHistory.length;
    const correct = userData.learningHistory.filter(r => r.result === 'correct').length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return {
      totalExercises: total,
      correctCount: correct,
      accuracy,
      wrongCount: userData.wrongItems.length,
      streak: calculateStreak()
    };
  }

  // 计算连续学习天数
  function calculateStreak() {
    const today = new Date().toDateString();
    let streak = 0;
    const dates = new Set();
    
    userData.learningHistory.forEach(record => {
      const date = new Date(record.timestamp).toDateString();
      dates.add(date);
    });

    const sortedDates = Array.from(dates).sort().reverse();
    const todayIdx = sortedDates.indexOf(today);
    
    if (todayIdx !== -1) {
      streak = 1;
      let checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - 1);
      
      while (dates.has(checkDate.toDateString())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
    
    return streak;
  }

  // 初始化
  loadUserData();

  return {
    getRecommendedTasks,
    recordLearning,
    addWrongItem,
    updateGrade,
    getLearningStats,
    userData
  };
})();