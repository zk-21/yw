(function() {
  const PACKS = {
    B1: { id: 'b1', code: 'B1', title: '字词基础训练包', problem: '按偏旁和语境区分字词，不凭感觉作答。', href: 'practice.html#pack-b1' },
    R1: { id: 'r1', code: 'R1', title: '概括训练包', problem: '先抓主干信息，再用自己的话概括。', href: 'practice.html#pack-r1' },
    R2: { id: 'r2', code: 'R2', title: '原文依据训练包', problem: '观点后面必须跟原文依据。', href: 'practice.html#pack-r2' },
    R3: { id: 'r3', code: 'R3', title: '赏析和说明文训练包', problem: '答题要说清词义、方法、变化和表达效果。', href: 'practice.html#pack-r3' },
    R4: { id: 'r4', code: 'R4', title: '非连续文本训练包', problem: '建议和结论都要带材料依据或数据比较。', href: 'practice.html#pack-r4' },
    W1: { id: 'w1', code: 'W1', title: '写话和观察训练包', problem: '把样子、变化、动作和感受写具体。', href: 'practice.html#pack-w1' },
    W2: { id: 'w2', code: 'W2', title: '重点段升格训练包', problem: '抓重点场景，补动作、心理和成长认识。', href: 'practice.html#pack-w2' },
    W3: { id: 'w3', code: 'W3', title: '审题扣题训练包', problem: '先扣题眼，再定中心和重点段。', href: 'practice.html#pack-w3' },
    C1: { id: 'c1', code: 'C1', title: '综合题型训练包', problem: '先判断题型，再决定答题层次。', href: 'practice.html#pack-c1' }
  };

  const PAPER_META = {
    a: { label: 'A卷诊断', button: '生成A卷系统判定', nextLabel: '训练后做B卷' },
    b: { label: 'B卷复测', button: '生成B卷复测结果', nextLabel: '通过后进C卷评分器' }
  };

  const GRADE_CONFIGS = {
    '1': {
      grade: '1',
      fileName: 'grade1.html',
      label: '一年级',
      stageId: 'grade1-stage-assessment',
      bTestId: 'grade1-b-test',
      a: [
        { no: 1, title: '拼读 p-én、q-iú、m-āo', points: 3, code: 'B1', reason: '只读声母，漏读韵母或声调。', standard: 'pén、qiú、māo' },
        { no: 2, title: '给“花、球、猫”各组1个词', points: 3, code: 'B1', reason: '只会认字，不会把字放进词语。', standard: '花朵、皮球、小猫等' },
        { no: 3, title: '第一句话写谁在哪里做什么', points: 3, code: 'R1', reason: '回答不完整，没有说全“谁+在哪里+做什么”。', standard: '小猫在院子里玩球。' },
        { no: 4, title: '感叹号要读出什么语气', points: 2, code: 'R1', reason: '只会读字，不会根据标点读出语气。', standard: '开心、高兴的语气。' },
        { no: 5, title: '看图说话：小朋友浇花，说3句话', points: 5, code: 'W1', reason: '句子太短，缺时间、地点、动作或心情。', standard: '至少包含时间、地点、人物、动作和心情。' }
      ],
      b: [
        { no: 1, title: '拼读 t-ù、h-uā、k-iǎo', points: 1, code: 'B1', reason: '拼音迁移不稳，不能完整连读。', standard: '先分开读，再连成完整音节。' },
        { no: 2, title: '给“水、鸟、书”组词，并选一个说句子', points: 1, code: 'B1', reason: '会组词但不会说完整句子。', standard: '词语正确，句子有完整意思。' },
        { no: 3, title: '读句子后回答“谁在哪里做什么”', points: 1, code: 'R1', reason: '信息提取不完整。', standard: '人物、地点、事情都说全。' },
        { no: 4, title: '看图说话：小朋友捡起地上的纸', points: 1, code: 'W1', reason: '看图说话缺动作和心情。', standard: '至少3句，交代动作过程和心情。' }
      ]
    },
    '2': {
      grade: '2',
      fileName: 'grade2.html',
      label: '二年级',
      stageId: 'grade2-stage-assessment',
      bTestId: 'grade2-b-test',
      a: [
        { no: 1, title: '选字填空：晴/清/睛', points: 3, code: 'B1', reason: '不看偏旁和语境。', standard: '晴、清、睛' },
        { no: 2, title: '贝贝和妈妈去哪里，做什么', points: 2, code: 'R1', reason: '只抓一个词，没有回答完整。', standard: '去公园看花。' },
        { no: 3, title: '老奶奶为什么夸贝贝', points: 3, code: 'R2', reason: '只写评价，不写具体原因。', standard: '因为贝贝帮老奶奶捡起掉在地上的袋子。' },
        { no: 4, title: '用一句话概括短文主要内容', points: 4, code: 'R1', reason: '漏主要事件或结果。', standard: '人物、事情、结果都完整。' },
        { no: 5, title: '扩写“贝贝帮助老奶奶”成一段话', points: 6, code: 'W1', reason: '只有评价，没有动作过程。', standard: '写出动作顺序和心情变化。' }
      ],
      b: [
        { no: 1, title: '选字填空：园/圆', points: 1, code: 'B1', reason: '形近字迁移不稳。', standard: '园、圆' },
        { no: 2, title: '小雨为什么把伞借给同学', points: 1, code: 'R2', reason: '原因题脱离原文。', standard: '因为同学没带伞，外面正在下雨。' },
        { no: 3, title: '概括“小雨借伞”短文', points: 1, code: 'R1', reason: '概括只写一部分信息。', standard: '人物、事情、结果完整。' },
        { no: 4, title: '扩写“小雨借伞”成4句话', points: 1, code: 'W1', reason: '写话没有动作、语言和心情。', standard: '至少4句，动作、语言、心情齐全。' }
      ]
    },
    '3': {
      grade: '3',
      fileName: 'grade3.html',
      label: '三年级',
      stageId: 'grade3-stage-assessment',
      bTestId: 'grade3-b-test',
      a: [
        { no: 1, title: '找中心句', points: 1, code: 'R1', reason: '把地点词当中心句。', standard: '放学后，操场上真热闹。' },
        { no: 2, title: '概括“操场热闹”这段', points: 3, code: 'R1', reason: '概括时照抄原句。', standard: '放学后，操场上同学们跳绳、跑步、踢球，到处都是欢笑声。' },
        { no: 3, title: '绿豆第一天是什么样子', points: 2, code: 'W1', reason: '只写对象，不写样子。', standard: '硬硬的、小小的。' },
        { no: 4, title: '第三天发生了什么变化', points: 3, code: 'W1', reason: '只写“发芽了”，没有变化细节。', standard: '绿豆裂开了一道缝，白白的小芽探出了头。' },
        { no: 5, title: '写一段观察片段', points: 6, code: 'W1', reason: '观察片段没有顺序和感受。', standard: '顺序、变化、感受都要交代。' }
      ],
      b: [
        { no: 1, title: '找中心句：图书角真安静', points: 1, code: 'R1', reason: '中心句迁移不稳。', standard: '图书角真安静。' },
        { no: 2, title: '概括“图书角安静”这段', points: 1, code: 'R1', reason: '概括仍然照抄。', standard: '用自己的话保留主干信息。' },
        { no: 3, title: '写绿豆第五天的变化', points: 1, code: 'W1', reason: '变化描写仍然太空。', standard: '写出样子和变化。' },
        { no: 4, title: '围绕“花坛真美”写4句话', points: 1, code: 'W1', reason: '句子没有围绕同一个中心。', standard: '每句话都服务同一个中心。' }
      ]
    },
    '4': {
      grade: '4',
      fileName: 'grade4.html',
      label: '四年级',
      stageId: 'grade4-stage-assessment',
      bTestId: 'grade4-b-test',
      a: [
        { no: 1, title: '概括短文主要内容', points: 4, code: 'R1', reason: '概括漏结果或过于啰嗦。', standard: '人物、事件、结果完整。' },
        { no: 2, title: '小林上台前是什么心情，从哪里看出', points: 3, code: 'R2', reason: '心情题没有原文依据。', standard: '心情判断后要跟两处依据。' },
        { no: 3, title: '小林是怎样的人', points: 4, code: 'R2', reason: '人物特点只有一个词，没有分析。', standard: '特点、依据、分析齐全。' },
        { no: 4, title: '赏析“雨点落在窗户上，像一串串小鼓点”', points: 4, code: 'R3', reason: '赏析只写“生动”。', standard: '方法、特点、效果都写到。' },
        { no: 5, title: '写一段“紧张”，不能出现“紧张”二字', points: 5, code: 'W2', reason: '重点场景没有细节。', standard: '动作、神态、心理都要写。' }
      ],
      b: [
        { no: 1, title: '概括“晓雨第一次主持班会”的短文', points: 1, code: 'R1', reason: '概括迁移不稳。', standard: '人物、事件、结果完整。' },
        { no: 2, title: '晓雨为什么害怕，从哪里看出', points: 1, code: 'R2', reason: '观点后仍然缺依据。', standard: '观点后必须有原文依据。' },
        { no: 3, title: '赏析“掌声像春风一样涌过来”', points: 1, code: 'R3', reason: '赏析仍然说不全。', standard: '方法、特点、效果完整。' },
        { no: 4, title: '写一段“不安”，不能出现“不安”二字', points: 1, code: 'W2', reason: '重点场景细节还不够。', standard: '动作、神态、心理细节齐全。' }
      ]
    },
    '5': {
      grade: '5',
      fileName: 'grade5.html',
      label: '五年级',
      stageId: 'grade5-stage-assessment',
      bTestId: 'grade5-b-test',
      a: [
        { no: 1, title: '“大约”能删去吗，为什么', points: 4, code: 'R3', reason: '说明文语言题只会说“不准确”。', standard: '词义、删后变化、准确性都要说明。' },
        { no: 2, title: '材料A主要说明什么', points: 4, code: 'R1', reason: '概括漏说明对象或条件。', standard: '说明对象、特点和影响因素齐全。' },
        { no: 3, title: '材料B中的爸爸是怎样的人', points: 5, code: 'R2', reason: '人物题没有两处依据。', standard: '特点、两处依据、分析齐全。' },
        { no: 4, title: '“我低头看着热气，忽然说不出话来”表达了什么', points: 3, code: 'R2', reason: '情感题只写“感动”。', standard: '情感和原因都要分析。' },
        { no: 5, title: '给《那一次，我懂得了坚持》列中心和详写段', points: 5, code: 'W2', reason: '作文中心没有成长认识。', standard: '中心、详写和成长认识都要交代。' }
      ],
      b: [
        { no: 1, title: '“几乎全部”能删去“几乎”吗', points: 1, code: 'R3', reason: '说明文语言准确性迁移不稳。', standard: '词义、删后变化、准确性完整。' },
        { no: 2, title: '概括海鸟迁徙材料', points: 1, code: 'R1', reason: '概括仍然漏对象或条件。', standard: '说明对象和影响因素都不漏。' },
        { no: 3, title: '爷爷是怎样的人，从两处细节说明', points: 1, code: 'R2', reason: '人物题仍然缺依据。', standard: '特点、两处依据、分析齐全。' },
        { no: 4, title: '给《那一次，我学会了负责》列中心和详写段', points: 1, code: 'W2', reason: '作文中心和详写段还不够扣题。', standard: '中心有认识，详写最能表现变化。' }
      ]
    },
    '6': {
      grade: '6',
      fileName: 'grade6.html',
      label: '六年级',
      stageId: 'section-assessment',
      bTestId: 'grade6-b-test',
      a: [
        { no: 1, title: '判断“这段话在文中有什么作用”属于什么题型', points: 1, code: 'C1', reason: '题型判断不准。', standard: '句段作用题。' },
        { no: 2, title: '“通常”能删去吗，为什么', points: 4, code: 'R3', reason: '语言准确性题漏删后变化。', standard: '词义、删后变化、文体特点齐全。' },
        { no: 3, title: '根据材料B给学生提一条运动建议', points: 4, code: 'R4', reason: '建议题没有引用材料。', standard: '建议要带材料依据。' },
        { no: 4, title: '根据材料B说明运动有什么好处', points: 4, code: 'R4', reason: '数据题不会比较。', standard: '数据、结论、建议齐全。' },
        { no: 5, title: '给《这一次，我长大了》列提纲', points: 5, code: 'W3', reason: '作文提纲没扣题眼。', standard: '题眼、中心、详写都明确。' }
      ],
      b: [
        { no: 1, title: '判断“结尾一句在全文中的作用”属于什么题型', points: 1, code: 'C1', reason: '综合题型迁移不稳。', standard: '先判断题型，再确定答题层次。' },
        { no: 2, title: '“一般情况下”能删去吗', points: 1, code: 'R3', reason: '限制词分析不完整。', standard: '词义、删后变化和严谨性齐全。' },
        { no: 3, title: '根据阅读数据提出建议', points: 1, code: 'R4', reason: '建议没有数据依据。', standard: '建议中必须引用数据。' },
        { no: 4, title: '给《这一次，我做对了》列提纲', points: 1, code: 'W3', reason: '提纲没有扣题眼和中心。', standard: '题眼、中心、详写和点题都明确。' }
      ]
    }
  };

  function safeParse(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      try { localStorage.removeItem(key); } catch (_) {}
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCurrentGrade() {
    const match = window.location.pathname.match(/grade([1-6])(?:\.html)?$/i);
    return match ? match[1] : '';
  }

  function getQuestionId(grade, paper, no) {
    return `grade-stage-${grade}-${paper}-${no}`;
  }

  function getPaperHref(config, paper) {
    return paper === 'b'
      ? `${config.fileName}#${config.bTestId}`
      : `${config.fileName}#${config.stageId}`;
  }

  function getTotalPoints(questions) {
    return questions.reduce(function(sum, item) {
      return sum + (item.points || 0);
    }, 0);
  }

  function getUniqueCodes(questions) {
    return Array.from(new Set(questions.map(function(item) {
      return item.code;
    })));
  }

  function readFlowStatus() {
    const parsed = safeParse('flowPackStatus', {});
    return parsed && typeof parsed === 'object' ? parsed : {};
  }

  function writeFlowStatus(status) {
    safeSet('flowPackStatus', status);
  }

  function updateFlowStatusForPaper(paper, allCodes, wrongCodes) {
    const nextStatus = readFlowStatus();
    const wrongSet = new Set(wrongCodes);
    if (paper === 'b') {
      allCodes.forEach(function(code) {
        const pack = PACKS[code];
        if (!pack) return;
        nextStatus[pack.id] = wrongSet.has(code) ? 'retry' : 'passed';
      });
    } else {
      wrongCodes.forEach(function(code) {
        const pack = PACKS[code];
        if (!pack) return;
        nextStatus[pack.id] = 'retry';
      });
    }
    writeFlowStatus(nextStatus);
  }

  function saveScoreHistory(result) {
    const history = safeParse('scoreHistory', []);
    const next = Array.isArray(history) ? history : [];
    const percent = result.totalPoints ? Math.round((result.score / result.totalPoints) * 100) : 0;
    next.push({
      grade: result.grade,
      gradeLabel: result.gradeLabel,
      paper: result.paper,
      paperLabel: result.paperLabel,
      percent: percent,
      wrongCount: result.wrongCount,
      wrongCodes: result.wrongCodes || [],
      createdAt: result.createdAt
    });
    while (next.length > 12) {
      next.shift();
    }
    safeSet('scoreHistory', next);
  }

  function saveWrongItems(config, paper, wrongQuestions, timestamp) {
    const paperLabel = PAPER_META[paper].label;
    const stageKey = `${config.grade}-${paper}`;
    const wrongList = safeParse('wrongAnswers', []);
    const nextWrongList = Array.isArray(wrongList)
      ? wrongList.filter(function(item) {
          return item.stageAssessmentId !== stageKey;
        })
      : [];

    wrongQuestions.forEach(function(question) {
      const pack = PACKS[question.code];
      if (!pack) return;
      nextWrongList.push({
        type: `${config.label}${paperLabel}`,
        question: `第${question.no}题：${question.title}`,
        userAnswer: '本题未达标或需要回炉',
        correctAnswer: question.standard || `对应错因码：${question.code}`,
        tip: `错因：${question.reason || pack.problem}。建议进入${question.code} ${pack.title}训练。`,
        mistakeReason: question.reason || pack.problem,
        errorCategory: pack.id,
        errorCode: question.code,
        questionId: getQuestionId(config.grade, paper, question.no),
        diagnosisPaper: paper,
        diagnosisGrade: config.grade,
        timestamp: timestamp,
        stageAssessmentId: stageKey,
        flowKey: `grade-stage-${config.grade}-${paper}-${question.no}`
      });
    });

    while (nextWrongList.length > 80) {
      nextWrongList.shift();
    }

    safeSet('wrongAnswers', nextWrongList);
  }

  function buildAbResult(config, paper, questions, wrongQuestions, timestamp) {
    const totalPoints = getTotalPoints(questions);
    const lostPoints = getTotalPoints(wrongQuestions);
    const score = Math.max(0, totalPoints - lostPoints);
    const wrongCodes = Array.from(new Set(wrongQuestions.map(function(item) {
      return item.code;
    })));
    return {
      grade: config.grade,
      paper: paper,
      gradeLabel: config.label,
      paperLabel: PAPER_META[paper].label,
      total: questions.length,
      wrongCount: wrongQuestions.length,
      score: score,
      totalPoints: totalPoints,
      wrongCodes: wrongCodes,
      retest: `${config.fileName}#${config.bTestId}`,
      createdAt: timestamp
    };
  }

  function saveAssessmentResult(config, paper, questions, wrongQuestions, timestamp) {
    const result = buildAbResult(config, paper, questions, wrongQuestions, timestamp);
    safeSet('lastABScoreResult', result);
    saveScoreHistory(result);

    if (paper === 'a') {
      safeSet('lastDiagnosisResult', {
        totalScore: result.score,
        totalPoints: result.totalPoints,
        wrongCount: result.wrongCount,
        wrongCodes: result.wrongCodes,
        grade: config.grade,
        gradeLabel: config.label,
        paper: 'a',
        paperLabel: PAPER_META.a.label,
        questionIds: questions.map(function(question) {
          return getQuestionId(config.grade, 'a', question.no);
        }),
        date: timestamp
      });
    }

    return result;
  }

  function getMainIssue(wrongQuestions) {
    const counts = {};
    wrongQuestions.forEach(function(question) {
      counts[question.code] = (counts[question.code] || 0) + 1;
    });
    return Object.keys(counts).sort(function(a, b) {
      return counts[b] - counts[a] || a.localeCompare(b);
    })[0] || '';
  }

  function renderQuestionList(config, paper, container) {
    const questions = config[paper];
    const meta = PAPER_META[paper];
    container.innerHTML = [
      `<div class="grade-stage-panel-head">`,
      `<div>`,
      `<p class="grade-stage-kicker">${paper === 'a' ? '系统自动判码' : '系统自动复测'}</p>`,
      `<h3>${escapeHtml(config.label)}${meta.label}</h3>`,
      `<p>只需要勾选未达标题，系统会自动生成错因码、训练路径，并写回训练单。</p>`,
      `</div>`,
      `<div class="grade-stage-points-total">本卷总分 ${getTotalPoints(questions)} 分</div>`,
      `</div>`,
      `<div class="grade-stage-checklist">`,
      questions.map(function(question) {
        const pack = PACKS[question.code];
        return [
          `<label class="grade-stage-item">`,
          `<input type="checkbox" data-stage-question value="${question.no}">`,
          `<span class="grade-stage-item-copy">`,
          `<strong>第${question.no}题：${escapeHtml(question.title)}</strong>`,
          `<span class="grade-stage-item-meta">`,
          `<span class="grade-stage-code">${question.code}</span>`,
          `<span class="grade-stage-points">${question.points}分</span>`,
          `<span>${escapeHtml(question.reason)}</span>`,
          `</span>`,
          `<small>建议主练：${escapeHtml(pack ? `${pack.code} ${pack.title}` : question.code)}</small>`,
          `</span>`,
          `</label>`
        ].join('');
      }).join(''),
      `</div>`
    ].join('');
  }

  function buildActionLinks(config, paper, wrongCodes) {
    const links = [];
    if (wrongCodes.length) {
      wrongCodes.forEach(function(code) {
        const pack = PACKS[code];
        if (!pack) return;
        links.push(`<a href="${pack.href}" class="grade-stage-action-link">${pack.code} ${pack.title}</a>`);
      });
      if (paper === 'a') {
        links.push(`<a href="${config.fileName}#${config.bTestId}" class="grade-stage-action-link">${PAPER_META.a.nextLabel}</a>`);
        links.push(`<a href="practice.html#print-training" class="grade-stage-action-link">打开打印训练单</a>`);
      } else {
        links.push(`<a href="${config.fileName}#${config.bTestId}" class="grade-stage-action-link">训练后再做B卷</a>`);
      }
    } else if (paper === 'a') {
      links.push(`<a href="${config.fileName}#${config.bTestId}" class="grade-stage-action-link">${PAPER_META.a.nextLabel}</a>`);
      links.push(`<a href="practice.html#print-training" class="grade-stage-action-link">打开打印训练单</a>`);
    } else {
      links.push(`<a href="practice.html#flow-training" class="grade-stage-action-link">${PAPER_META.b.nextLabel}</a>`);
      links.push(`<a href="practice.html#print-training" class="grade-stage-action-link">查看训练闭环</a>`);
    }
    return links.join('');
  }

  function renderResult(config, paper, questions, wrongQuestions, result, container) {
    const wrongCodes = result.wrongCodes || [];
    const mainCode = getMainIssue(wrongQuestions);
    const mainPack = PACKS[mainCode];
    const statusText = wrongQuestions.length
      ? `系统已判定 ${wrongQuestions.length} 个未达标题，并写回错题本、错因码和训练链路。`
      : (paper === 'a'
        ? '本次 A 卷没有勾选错题，可以直接进入 B 卷做同类变式复测。'
        : '本次 B 卷复测通过，可以进入 practice 页继续做 C 卷迁移。');
    const routeRows = wrongQuestions.length
      ? wrongQuestions.map(function(question) {
          const pack = PACKS[question.code];
          return [
            `<tr>`,
            `<td>第${question.no}题</td>`,
            `<td>${escapeHtml(question.reason)}</td>`,
            `<td>${question.code}</td>`,
            `<td>${escapeHtml(pack ? pack.title : '')}</td>`,
            `</tr>`
          ].join('');
        }).join('')
      : `<tr><td colspan="4">${paper === 'a' ? 'A卷当前没有未达标题，下一步做 B 卷复测。' : 'B卷当前通过，下一步进入 C 卷评分器。'}</td></tr>`;

    container.innerHTML = [
      `<div class="grade-stage-result-card">`,
      `<div class="grade-stage-result-top">`,
      `<div>`,
      `<p class="grade-stage-result-kicker">${escapeHtml(config.label)}${PAPER_META[paper].label}</p>`,
      `<h3>${result.score}/${result.totalPoints} 分，错 ${result.wrongCount}/${result.total} 题</h3>`,
      `<p>${escapeHtml(statusText)}</p>`,
      `</div>`,
      `<div class="grade-stage-result-main">`,
      `<span>主攻错因</span>`,
      `<strong>${mainPack ? `${mainPack.code} ${mainPack.title}` : '当前无主攻错因'}</strong>`,
      `<small>${escapeHtml(mainPack ? mainPack.problem : '继续进入下一张卷做迁移验证。')}</small>`,
      `</div>`,
      `</div>`,
      `<div class="grade-stage-actions">${buildActionLinks(config, paper, wrongCodes)}</div>`,
      `<div class="grade-stage-result-table">`,
      `<table>`,
      `<thead><tr><th>题号</th><th>系统判断</th><th>错因码</th><th>马上去练</th></tr></thead>`,
      `<tbody>${routeRows}</tbody>`,
      `</table>`,
      `</div>`,
      `</div>`
    ].join('');
  }

  function clearHighlights(section) {
    section.querySelectorAll('.grade-stage-hit').forEach(function(row) {
      row.classList.remove('grade-stage-hit');
    });
    section.querySelectorAll('.grade-stage-selected').forEach(function(row) {
      row.classList.remove('grade-stage-selected');
    });
  }

  function findCardByTitle(section, keyword) {
    return Array.from(section.querySelectorAll('.table-card')).find(function(card) {
      const title = card.querySelector('h2');
      return title && title.textContent.indexOf(keyword) >= 0;
    }) || null;
  }

  function highlightRows(section, paper, wrongQuestions, wrongCodes) {
    clearHighlights(section);

    const activeNos = new Set(wrongQuestions.map(function(question) {
      return String(question.no);
    }));

    const scoreCard = findCardByTitle(section, paper === 'a' ? 'A卷：题目、答案和评分' : 'B卷：同类变式迁移');
    if (scoreCard) {
      scoreCard.querySelectorAll('tbody tr').forEach(function(row, index) {
        if (activeNos.has(String(index + 1))) {
          row.classList.add('grade-stage-selected');
        }
      });
    }

    const codeCard = findCardByTitle(section, 'A卷判码表');
    if (paper === 'a' && codeCard) {
      codeCard.querySelectorAll('tbody tr').forEach(function(row) {
        const firstCell = row.querySelector('td');
        if (firstCell && activeNos.has(firstCell.textContent.trim())) {
          row.classList.add('grade-stage-selected');
        }
      });
    }

    const routeCard = findCardByTitle(section, '测后分流路径');
    if (routeCard) {
      routeCard.querySelectorAll('tbody tr').forEach(function(row) {
        const codeLink = row.querySelector('[data-error-code]');
        if (codeLink && wrongCodes.indexOf(codeLink.getAttribute('data-error-code')) >= 0) {
          row.classList.add('grade-stage-hit');
        }
      });
    }
  }

  function createPanel(config, section) {
    const panel = document.createElement('div');
    panel.className = 'table-card grade-stage-panel';
    panel.innerHTML = [
      `<div class="grade-stage-toolbar">`,
      `<div class="grade-stage-switches">`,
      `<button type="button" class="grade-stage-switch active" data-stage-paper="a">A卷自动判码</button>`,
      `<button type="button" class="grade-stage-switch" data-stage-paper="b">B卷自动复测</button>`,
      `</div>`,
      `<div class="grade-stage-toolbar-actions">`,
      `<button type="button" class="grade-stage-ghost-btn" data-stage-reset>清空勾选</button>`,
      `<button type="button" class="grade-stage-primary-btn" data-stage-submit>${PAPER_META.a.button}</button>`,
      `</div>`,
      `</div>`,
      `<div class="grade-stage-panel-body" data-stage-form></div>`,
      `<div class="grade-stage-result" data-stage-result>先勾选本次未达标题，再生成系统结果。</div>`
    ].join('');

    const anchor = section.querySelector('.section-title');
    if (anchor && anchor.nextSibling) {
      section.insertBefore(panel, anchor.nextSibling);
    } else {
      section.insertBefore(panel, section.firstChild);
    }

    return panel;
  }

  function initGradeStageAssessment() {
    const grade = getCurrentGrade();
    const config = GRADE_CONFIGS[grade];
    if (!config) return;

    const section = document.getElementById(config.stageId) || document.querySelector('.stage-assessment');
    if (!section) return;

    const panel = createPanel(config, section);
    const form = panel.querySelector('[data-stage-form]');
    const resultBox = panel.querySelector('[data-stage-result]');
    const submitBtn = panel.querySelector('[data-stage-submit]');
    const resetBtn = panel.querySelector('[data-stage-reset]');
    const switchButtons = Array.from(panel.querySelectorAll('[data-stage-paper]'));
    let activePaper = window.location.hash === `#${config.bTestId}` ? 'b' : 'a';

    function renderPanel() {
      switchButtons.forEach(function(button) {
        const isActive = button.getAttribute('data-stage-paper') === activePaper;
        button.classList.toggle('active', isActive);
      });
      submitBtn.textContent = PAPER_META[activePaper].button;
      renderQuestionList(config, activePaper, form);
      resultBox.innerHTML = '先勾选本次未达标题，再生成系统结果。';
      clearHighlights(section);
    }

    function getSelectedQuestions() {
      const selectedNos = Array.from(form.querySelectorAll('input[data-stage-question]:checked')).map(function(input) {
        return Number(input.value);
      });
      return config[activePaper].filter(function(question) {
        return selectedNos.indexOf(question.no) >= 0;
      });
    }

    function handleSubmit() {
      const questions = config[activePaper];
      const wrongQuestions = getSelectedQuestions();
      const wrongCodes = Array.from(new Set(wrongQuestions.map(function(question) {
        return question.code;
      })));
      const allCodes = getUniqueCodes(questions);
      const timestamp = new Date().toISOString();

      saveWrongItems(config, activePaper, wrongQuestions, timestamp);
      updateFlowStatusForPaper(activePaper, allCodes, wrongCodes);
      const result = saveAssessmentResult(config, activePaper, questions, wrongQuestions, timestamp);

      renderResult(config, activePaper, questions, wrongQuestions, result, resultBox);
      highlightRows(section, activePaper, wrongQuestions, wrongCodes);
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    switchButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        activePaper = button.getAttribute('data-stage-paper');
        renderPanel();
      });
    });

    submitBtn.addEventListener('click', handleSubmit);
    resetBtn.addEventListener('click', function() {
      form.querySelectorAll('input[data-stage-question]').forEach(function(input) {
        input.checked = false;
      });
      resultBox.innerHTML = '已清空当前勾选，重新选择后再生成系统结果。';
      clearHighlights(section);
    });

    renderPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGradeStageAssessment);
  } else {
    initGradeStageAssessment();
  }
})();
