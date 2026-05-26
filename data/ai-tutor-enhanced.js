/**
 * 增强版AI辅导系统
 * 提供智能作文批改、个性化错题讲解、学习难点自动识别
 */
(function() {
  'use strict';

  // 作文评分维度
  const COMPOSITION_CRITERIA = {
    structure: { name: '结构完整', maxScore: 20, weight: 0.2 },
    content: { name: '内容充实', maxScore: 30, weight: 0.3 },
    language: { name: '语言表达', maxScore: 25, weight: 0.25 },
    creativity: { name: '创意新颖', maxScore: 15, weight: 0.15 },
    handwriting: { name: '书写规范', maxScore: 10, weight: 0.1 }
  };

  // 错因分析模板
  const ERROR_ANALYSIS_TEMPLATES = {
    'R1': {
      name: '审题不清',
      description: '没有正确理解题目要求',
      causes: ['没有圈画关键词', '忽视题目限制条件', '误解题目意图'],
      suggestions: [
        '先通读题目，圈画出关键词',
        '分析题目中的限制条件',
        '确认题目的核心要求'
      ],
      practiceLink: 'practice.html#diagnosis'
    },
    'R2': {
      name: '找依据弱',
      description: '无法从原文中找到答题依据',
      causes: ['不会定位关键段落', '找不到关键词', '缺乏找依据的方法'],
      suggestions: [
        '学习使用关键词定位法',
        '练习在原文中划线标记',
        '掌握段落结构分析技巧'
      ],
      practiceLink: 'practice.html#flow-training'
    },
    'R3': {
      name: '概括能力弱',
      description: '无法准确概括文章内容',
      causes: ['分不清主次信息', '不会提取中心思想', '语言表达不简洁'],
      suggestions: [
        '学习提取段落中心句',
        '练习用一句话概括段落',
        '掌握概括的常用方法'
      ],
      practiceLink: 'practice.html#flow-training'
    },
    'L1': {
      name: '表达不完整',
      description: '回答不完整，逻辑不清晰',
      causes: ['思路混乱', '缺乏答题模板', '语言组织能力不足'],
      suggestions: [
        '学习答题的基本结构',
        '使用"因为...所以..."句式',
        '先列提纲再组织语言'
      ],
      practiceLink: 'agent.html'
    },
    'L2': {
      name: '语言不规范',
      description: '用词不当，语法错误',
      causes: ['词汇量不足', '语法知识薄弱', '缺乏语言积累'],
      suggestions: [
        '每天积累5个好词好句',
        '学习常用句式结构',
        '多阅读优秀范文'
      ],
      practiceLink: 'vocabulary.html'
    },
    'L3': {
      name: '错别字多',
      description: '书写错误较多',
      causes: ['汉字基础不牢', '书写不认真', '缺乏检查习惯'],
      suggestions: [
        '重点练习易错字',
        '养成写完检查的习惯',
        '使用田字格练习书写'
      ],
      practiceLink: 'pinyin.html'
    }
  };

  // 学习难点检测规则
  const DIFFICULTY_RULES = {
    frequentErrors: {
      threshold: 3,
      message: '该知识点连续错误多次，建议重点复习'
    },
    timeSpent: {
      threshold: 60,
      message: '答题时间过长，说明对知识点掌握不熟练'
    },
    scoreDrop: {
      threshold: 20,
      message: '成绩明显下降，需要分析原因'
    },
    conceptConfusion: {
      threshold: 0.7,
      message: '存在概念混淆，需要对比辨析'
    }
  };

  function analyzeComposition(text, grade = '3') {
    const result = {
      overallScore: 0,
      breakdown: {},
      comments: [],
      suggestions: [],
      improvementAreas: []
    };

    // 简单的作文分析（实际应用中会调用AI）
    const textLength = text.length;
    const paragraphCount = text.split(/[。！？]/).filter(p => p.trim().length > 0).length;
    const wordVariety = new Set(text.replace(/[，。！？、；：""''（）\s]+/g, '').split('')).size;
    const hasStructure = text.includes('开头') || text.includes('结尾') || paragraphCount >= 3;

    // 结构评分
    const structureScore = hasStructure ? Math.min(paragraphCount * 5, 20) : 10;
    result.breakdown.structure = { score: structureScore, maxScore: 20 };
    if (structureScore < 15) {
      result.improvementAreas.push('结构');
      result.suggestions.push('可以增加段落划分，让文章结构更清晰');
    }

    // 内容评分
    const contentScore = Math.min(textLength / 10, 30);
    result.breakdown.content = { score: Math.round(contentScore), maxScore: 30 };
    if (contentScore < 20) {
      result.improvementAreas.push('内容');
      result.suggestions.push('可以增加更多细节描写，让内容更充实');
    }

    // 语言评分
    const languageScore = Math.min(wordVariety / 3, 25);
    result.breakdown.language = { score: Math.round(languageScore), maxScore: 25 };
    if (languageScore < 18) {
      result.improvementAreas.push('语言');
      result.suggestions.push('可以使用更多丰富的词汇和句式');
    }

    // 创意评分
    const creativityScore = text.includes('我觉得') || text.includes('我认为') || text.includes('想象') ? 12 : 8;
    result.breakdown.creativity = { score: creativityScore, maxScore: 15 };
    if (creativityScore < 10) {
      result.suggestions.push('可以加入更多自己的想法和感受');
    }

    // 书写评分（模拟）
    result.breakdown.handwriting = { score: 8, maxScore: 10 };

    // 计算总分
    let totalScore = 0;
    Object.entries(result.breakdown).forEach(([key, value]) => {
      totalScore += value.score * (COMPOSITION_CRITERIA[key]?.weight || 0.2);
    });
    result.overallScore = Math.round(totalScore);

    // 生成评语
    if (result.overallScore >= 90) {
      result.comments.push('非常优秀！文章结构清晰，内容充实，语言流畅。');
    } else if (result.overallScore >= 80) {
      result.comments.push('写得不错！继续加油，在细节上再下功夫会更好。');
    } else if (result.overallScore >= 60) {
      result.comments.push('还需要努力，按照建议修改会有很大进步。');
    } else {
      result.comments.push('需要多练习，可以参考优秀范文学习写作技巧。');
    }

    return result;
  }

  function analyzeWrongAnswer(question, userAnswer, correctAnswer, errorCategory) {
    const analysis = {
      question: question,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      errorCategory: errorCategory,
      analysis: '',
      suggestions: [],
      relatedConcepts: [],
      practiceTasks: []
    };

    const template = ERROR_ANALYSIS_TEMPLATES[errorCategory];
    if (template) {
      analysis.analysis = template.description;
      analysis.suggestions = [...template.suggestions];
      analysis.practiceTasks.push({
        name: `专项练习：${template.name}`,
        link: template.practiceLink
      });
    }

    // 对比分析
    if (userAnswer && correctAnswer) {
      const userLength = userAnswer.length;
      const correctLength = correctAnswer.length;
      
      if (userLength < correctLength * 0.5) {
        analysis.suggestions.push('回答过于简略，需要更完整的表述');
      }

      // 找不同点（简化版）
      const userWords = new Set(userAnswer.replace(/[，。！？、；：""''（）\s]+/g, '').split(''));
      const correctWords = new Set(correctAnswer.replace(/[，。！？、；：""''（）\s]+/g, '').split(''));
      const missingWords = [...correctWords].filter(w => !userWords.has(w));
      
      if (missingWords.length > 3) {
        analysis.suggestions.push(`可以使用这些关键词：${missingWords.slice(0, 3).join('、')}`);
      }
    }

    // 添加相关概念
    if (errorCategory.startsWith('R')) {
      analysis.relatedConcepts = ['阅读理解技巧', '原文定位', '信息提取'];
    } else {
      analysis.relatedConcepts = ['语言表达', '句式结构', '词汇运用'];
    }

    return analysis;
  }

  function detectLearningDifficulties(learningHistory) {
    const difficulties = [];
    if (!learningHistory || !learningHistory.length) return difficulties;

    const errorCounts = {};
    const timeSpent = {};
    const scores = [];

    learningHistory.forEach(record => {
      // 统计错误次数
      if (record.errorCategory) {
        errorCounts[record.errorCategory] = (errorCounts[record.errorCategory] || 0) + 1;
      }

      // 统计答题时间
      if (record.timeSpent && record.questionId) {
        timeSpent[record.questionId] = (timeSpent[record.questionId] || 0) + record.timeSpent;
      }

      // 收集成绩
      if (record.score !== undefined) {
        scores.push(record.score);
      }
    });

    // 检测高频错误
    Object.entries(errorCounts).forEach(([category, count]) => {
      if (count >= DIFFICULTY_RULES.frequentErrors.threshold) {
        const template = ERROR_ANALYSIS_TEMPLATES[category];
        difficulties.push({
          type: 'frequentErrors',
          message: DIFFICULTY_RULES.frequentErrors.message,
          detail: `${template?.name || category} 错误 ${count} 次`,
          category: category,
          suggestions: template?.suggestions || []
        });
      }
    });

    // 检测耗时过长的题目
    Object.entries(timeSpent).forEach(([qId, time]) => {
      if (time >= DIFFICULTY_RULES.timeSpent.threshold) {
        difficulties.push({
          type: 'timeSpent',
          message: DIFFICULTY_RULES.timeSpent.message,
          detail: `题目 ${qId} 耗时 ${time} 秒`,
          questionId: qId
        });
      }
    });

    // 检测成绩下降
    if (scores.length >= 2) {
      const recentScore = scores[scores.length - 1];
      const previousScore = scores[scores.length - 2];
      if (previousScore - recentScore >= DIFFICULTY_RULES.scoreDrop.threshold) {
        difficulties.push({
          type: 'scoreDrop',
          message: DIFFICULTY_RULES.scoreDrop.message,
          detail: `成绩从 ${previousScore} 分下降到 ${recentScore} 分`
        });
      }
    }

    return difficulties;
  }

  function generatePersonalizedExplanation(wrongItem, userProfile = {}) {
    const analysis = analyzeWrongAnswer(
      wrongItem.question,
      wrongItem.userAnswer,
      wrongItem.correctAnswer,
      wrongItem.errorCategory
    );

    // 根据用户特征调整讲解方式
    const grade = userProfile.grade || '3';
    const readingLevel = userProfile.readingLevel || 'intermediate';
    
    let explanation = '';
    
    if (readingLevel === 'beginner' || parseInt(grade) <= 2) {
      // 低年级或阅读能力较弱：更简单的语言
      explanation = `
这道题你答错了，没关系，我们一起来看看为什么。

题目是：${wrongItem.question}

你的答案：${wrongItem.userAnswer}
正确答案：${wrongItem.correctAnswer}

问题出在：${analysis.analysis}

老师告诉你怎么做：
${analysis.suggestions.slice(0, 2).map((s, i) => `${i + 1}. ${s}`).join('\n')}

接下来你可以：
${analysis.practiceTasks.map(t => `• ${t.name}`).join('\n')}
      `;
    } else {
      // 高年级或阅读能力较强：更详细的分析
      explanation = `
【错题分析】

题目：${wrongItem.question}

你的答案：${wrongItem.userAnswer}
正确答案：${wrongItem.correctAnswer}

【错误原因】
${analysis.analysis}

【问题根源】
${ERROR_ANALYSIS_TEMPLATES[wrongItem.errorCategory]?.causes?.map((c, i) => `${i + 1}. ${c}`).join('\n') || '需要进一步分析'}

【改进建议】
${analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

【相关知识点】
${analysis.relatedConcepts.map(c => `• ${c}`).join('\n')}

【推荐练习】
${analysis.practiceTasks.map(t => `• [${t.name}](${t.link})`).join('\n')}
      `;
    }

    return explanation.trim();
  }

  // ── 公开 API ──────────────────────────────────────────────
  window.AITutorEnhanced = {
    COMPOSITION_CRITERIA,
    ERROR_ANALYSIS_TEMPLATES,
    
    analyzeComposition,
    analyzeWrongAnswer,
    detectLearningDifficulties,
    generatePersonalizedExplanation
  };
})();