(function () {
  const PROVIDERS = {
    deepseek: {
      label: 'DeepSeek',
      keyLabel: 'DeepSeek API Key',
      keyHelp: 'DeepSeek 使用 https://api.deepseek.com/chat/completions。',
      apiUrl: 'https://api.deepseek.com/chat/completions',
      keyStorage: 'diandianAgentDeepSeekKey',
      format: 'chat',
      models: [
        { value: 'deepseek-v4-flash', label: 'deepseek-v4-flash' },
        { value: 'deepseek-v4-pro', label: 'deepseek-v4-pro' }
      ]
    }
  };
  const RECORD_STORAGE = 'diandianAgentRecords';
  const MAX_RECORDS = 20;

  const form = document.getElementById('agent-form');
  const providerSelect = document.getElementById('agent-provider');
  const modelSelect = document.getElementById('agent-model');
  const keyLabel = document.getElementById('agent-key-label');
  const keyHelp = document.getElementById('agent-key-help');
  const keyInput = document.getElementById('agent-key');
  const saveKeyInput = document.getElementById('agent-save-key');
  const questionInput = document.getElementById('agent-question');
  const runButton = document.getElementById('agent-run');
  const clearButton = document.getElementById('agent-clear');
  const forgetKeyButton = document.getElementById('agent-forget-key');
  const status = document.getElementById('agent-status');
  const output = document.getElementById('agent-output');
  const recordsList = document.getElementById('agent-records');
  const clearRecordsButton = document.getElementById('agent-clear-records');
  const voiceQuestionButton = document.getElementById('agent-voice-question');
  const exampleButtons = document.querySelectorAll('.agent-example-btn');
  const levelSelect = document.getElementById('agent-level');
  const trackTitle = document.getElementById('agent-track-title');
  const trackCopy = document.getElementById('agent-track-copy');
  const trackTags = document.getElementById('agent-track-tags');
  const photoInput = document.getElementById('agent-photo');
  const photoPreview = document.getElementById('agent-photo-preview');
  const photoImage = document.getElementById('agent-photo-image');
  const photoName = document.getElementById('agent-photo-name');

  if (!form || !keyInput || !questionInput || !runButton || !output || !status) return;

  function getProvider(providerId) {
    return PROVIDERS[providerId] || PROVIDERS.deepseek;
  }

  function getProviderId() {
    return providerSelect ? providerSelect.value : 'deepseek';
  }

  function refreshProviderFields() {
    const provider = getProvider(getProviderId());
    if (keyLabel) keyLabel.textContent = provider.keyLabel;
    if (keyHelp) keyHelp.textContent = provider.keyHelp;

    if (modelSelect) {
      modelSelect.innerHTML = '';
      provider.models.forEach((model, index) => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.label;
        option.selected = index === 0;
        modelSelect.appendChild(option);
      });
    }

    const savedKey = localStorage.getItem(provider.keyStorage);
    keyInput.value = savedKey || '';
    if (saveKeyInput) saveKeyInput.checked = Boolean(savedKey);
  }

  function setStatus(message, isError) {
    status.textContent = message || '';
    status.classList.toggle('error', Boolean(isError));
  }

  function setOutput(text, isEmpty) {
    output.textContent = text;
    output.classList.toggle('is-empty', Boolean(isEmpty));
  }

  function getFormValue(name) {
    const field = form.elements[name];
    return field ? String(field.value || '').trim() : '';
  }

  const TRACK_PROFILES = {
    '尖子生拔高': {
      title: '尖子生拔高轨',
      copy: '目标不是多刷难题，而是把答案从"对"推到"准、深、漂亮"。重点加入深层追问、满分表达、变式迁移和限时稳定。',
      tags: ['深层主旨', '满分答案拆解', '一题多解', 'C卷迁移'],
      prompt: [
        '当前按"尖子生拔高轨"设计辅导。',
        '目标：从会做题提升到会迁移、会比较、会表达高分答案。',
        '阅读重点：深层主旨、人物复杂性、句段作用、材料整合、开放表达。',
        '作文重点：立意升级、独特选材、重点段层次、语言克制高级、首尾照应。',
        '讲解方式：先给高阶标准，再用低分答案和满分答案对比，最后追加1个变式迁移追问。',
        '避免：不要把拔高等同于堆难词或加大题量。'
      ].join('\n')
    },
    '中等生提分': {
      title: '中等生提分轨',
      copy: '目标是稳定得分。先把题型判断、答题步骤、原文依据和同类复练做稳，再逐步进入提优题。',
      tags: ['审题三步', '答题模板', '同类复练', '错因复盘'],
      prompt: [
        '当前按"中等生提分轨"设计辅导。',
        '目标：把不稳定的会做，变成考试中稳定得分。',
        '阅读重点：圈关键词、判断题型、找原文依据、按层组织答案。',
        '作文重点：不跑题、结构完整、重点段写具体、结尾扣题。',
        '讲解方式：先指出最主要错因，再给固定步骤和可套用模板，最后安排同类复练。',
        '避免：不要频繁换新题；不要只讲答案，要让学生复述步骤。'
      ].join('\n')
    },
    '基础薄弱补齐': {
      title: '基础补齐轨',
      copy: '先处理字词、句意、审题和基本表达。内容要更短、更明确，每次只补一个关键缺口。',
      tags: ['基础缺口', '一步一练', '短句表达', '即时纠错'],
      prompt: [
        '当前按"基础薄弱补齐轨"设计辅导。',
        '目标：先补最影响理解和表达的基础缺口。',
        '讲解方式：少讲术语，多给例子；每一步都要有学生能马上完成的小练习。',
        '避免：不要直接进入拔高题，不要一次塞太多方法。'
      ].join('\n')
    },
    '家长陪练': {
      title: '家长陪练轨',
      copy: '把专业方法翻译成家长能问、孩子能答的话术，重点减少争执、增加复述和复练。',
      tags: ['家长提问', '孩子复述', '错因记录', '复练安排'],
      prompt: [
        '当前按"家长陪练轨"设计辅导。',
        '目标：输出家长能照着问的短句、孩子能照着做的步骤。',
        '讲解方式：每个方法都配一句家长话术和一个孩子回应标准。',
        '避免：不要输出太多教学术语。'
      ].join('\n')
    },
    '自动判断': {
      title: '双轨辅导提示',
      copy: '自动判断会先看题目、年级和任务，再决定走"拔高迁移"还是"稳定提分"。如果已经知道孩子层级，建议直接选择尖子生或中等生。',
      tags: ['诊断定位', '教师追问', '当堂练习', '课后反馈'],
      prompt: [
        '请先根据题目、学习阶段和任务，在输出中判断更适合"尖子生拔高轨""中等生提分轨""基础补齐轨"还是"家长陪练轨"。',
        '如果题目体现高分瓶颈、迁移、作文升格或小升初冲刺，优先按尖子生拔高轨。',
        '如果题目体现审题不稳、答题模板不会、作文写不具体或错题反复，优先按中等生提分轨。'
      ].join('\n')
    }
  };

  function getTrackProfile(level) {
    return TRACK_PROFILES[level] || TRACK_PROFILES['自动判断'];
  }

  function refreshTrackPanel() {
    const profile = getTrackProfile(levelSelect ? levelSelect.value : '自动判断');
    if (trackTitle) trackTitle.textContent = profile.title;
    if (trackCopy) trackCopy.textContent = profile.copy;
    if (trackTags) {
      trackTags.innerHTML = '';
      profile.tags.forEach((tag) => {
        const item = document.createElement('span');
        item.textContent = tag;
        trackTags.appendChild(item);
      });
    }
  }

  function setSelectValue(select, value) {
    if (!select || !value) return false;
    const normalized = String(value).trim();
    const matched = Array.from(select.options).find(option => option.value === normalized || option.textContent === normalized);
    if (matched) {
      select.value = matched.value;
      return true;
    }

    const fallbackMaps = {
      stage: [
        [/^小学$|小学主站|三至六年级|3-6年级/, '小学主站'],
        [/小升初|六升七|衔接/, '小升初衔接'],
        [/初中过渡|初一|七年级/, '初中过渡']
      ],
      subject: [
        [/作文|写作|写人|记事|写景|状物|想象|应用文|表达/, '作文/写作'],
        [/阅读/, '阅读理解'],
        [/语文/, '语文']
      ],
      task: [
        [/作文|写作|升格|旁批|批改|复练|表达/, '作文/表达升格'],
        [/阅读|答题/, '阅读答题'],
        [/错因|诊断|分析/, '错因诊断'],
        [/计划|路径|安排/, '学习计划'],
        [/知识点|讲清/, '讲清知识点']
      ],
      level: [
        [/尖子|拔高|培优/, '尖子生拔高'],
        [/中等|提分|稳定/, '中等生提分'],
        [/基础|薄弱|补齐/, '基础薄弱补齐'],
        [/家长|陪练|话术/, '家长陪练'],
        [/双轨|自动/, '自动判断']
      ]
    };
    const selectName = select.name || select.id.replace(/^agent-/, '');
    const fallback = (fallbackMaps[selectName] || []).find(([pattern]) => pattern.test(normalized));
    if (fallback && Array.from(select.options).some(option => option.value === fallback[1])) {
      select.value = fallback[1];
      return true;
    }
    return true;
  }

  function applyPrefillFromQuery() {
    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) return;

    const aliasMap = {
      grade: 'stage',
      genre: 'subject',
      mode: 'level',
      q: 'question',
      prompt: 'question'
    };
    const getParam = (name) => params.get(name) || params.get(Object.keys(aliasMap).find(alias => aliasMap[alias] === name) || '');
    const fieldValues = {
      stage: getParam('stage'),
      subject: getParam('subject'),
      task: getParam('task'),
      level: getParam('level')
    };

    Object.entries(fieldValues).forEach(([name, value]) => {
      if (!value) return;
      const field = form.elements[name];
      if (!field) return;
      if (field.tagName === 'SELECT') {
        setSelectValue(field, value);
      } else {
        field.value = value;
      }
    });

    const question = params.get('question') || params.get('q') || params.get('prompt');
    if (question && questionInput) {
      questionInput.value = question;
    }

    refreshTrackPanel();
    if (Object.values(fieldValues).some(Boolean) || question) {
      setStatus('已按页面入口填好任务，可直接补充材料后生成辅导。');
    }
  }

  function getRecords() {
    try {
      const records = JSON.parse(localStorage.getItem(RECORD_STORAGE) || '[]');
      return Array.isArray(records) ? records : [];
    } catch (error) {
      return [];
    }
  }

  function saveRecords(records) {
    localStorage.setItem(RECORD_STORAGE, JSON.stringify(records.slice(0, MAX_RECORDS)));
  }

  function formatTime(value) {
    try {
      return new Intl.DateTimeFormat('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(value));
    } catch (error) {
      return '';
    }
  }

  function renderRecords() {
    if (!recordsList) return;
    const records = getRecords();
    recordsList.innerHTML = '';

    if (!records.length) {
      const empty = document.createElement('p');
      empty.className = 'record-empty';
      empty.textContent = '还没有辅导记录。生成一次辅导后，会自动保存在当前浏览器。';
      recordsList.appendChild(empty);
      return;
    }

    records.forEach((record) => {
      const button = document.createElement('button');
      button.className = 'record-item';
      button.type = 'button';

      const title = document.createElement('strong');
      title.textContent = record.question || '未命名问题';

      const meta = document.createElement('span');
      meta.textContent = `${record.provider || 'AI'} · ${record.model || ''} · ${formatTime(record.createdAt)}`;

      button.append(title, meta);
      button.addEventListener('click', () => {
        questionInput.value = record.fullQuestion || record.question || '';
        setOutput(record.answer || '这条记录没有保存到结果内容。', false);
        setStatus('已打开历史辅导记录。');
        updateAgentBottomNav('#agent');
        document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      recordsList.appendChild(button);
    });
  }

  function updateAgentBottomNav(hash) {
    const nav = document.querySelector('.agent-bottom-nav');
    if (!nav) return;

    const targetHash = hash || '#agent';
    nav.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === targetHash);
    });
  }

  function bindAgentBottomNav() {
    const nav = document.querySelector('.agent-bottom-nav');
    if (!nav) return;

    function sizeBottomNav() {
      const visualWidth = Number(window.visualViewport && window.visualViewport.width || 0);
      const innerWidth = Number(window.innerWidth || 0);
      const baseWidth = visualWidth >= 320 ? visualWidth : innerWidth;
      const width = Math.min(Math.max((baseWidth || 390) - 24, 288), 430);
      nav.style.setProperty('left', '50%', 'important');
      nav.style.setProperty('right', 'auto', 'important');
      nav.style.setProperty('width', `${width}px`, 'important');
      nav.style.setProperty('max-width', `${width}px`, 'important');
      nav.style.setProperty('transform', 'translateX(-50%)', 'important');
    }

    const sectionHashes = ['#agent', '#records'];
    const sectionLinks = Array.from(nav.querySelectorAll('a')).filter((link) => sectionHashes.includes(link.getAttribute('href')));
    sectionLinks.forEach((link) => {
      link.addEventListener('click', () => updateAgentBottomNav(link.getAttribute('href') || '#agent'));
    });

    sizeBottomNav();
    window.addEventListener('resize', sizeBottomNav);
    window.addEventListener('orientationchange', sizeBottomNav);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', sizeBottomNav);
    updateAgentBottomNav(sectionHashes.includes(location.hash) ? location.hash : '#agent');
  }

  function addRecord(data, answer) {
    const provider = getProvider(data.provider);
    const records = getRecords();
    records.unshift({
      answer,
      createdAt: new Date().toISOString(),
      fullQuestion: data.question,
      model: data.model,
      provider: provider.label,
      question: data.question.length > 48 ? `${data.question.slice(0, 48)}...` : data.question,
      level: data.level,
      subject: data.subject
    });
    saveRecords(records);
    renderRecords();
  }

  var _dataContextCache = null; // 资料库上下文缓存（一次会话内复用）

  function buildPrompt(data, dataContext) {
    const profile = getTrackProfile(data.level);
    var parts = [
      '请以"特级教师、资深教研员、拔尖培优导师"的身份，针对下面学习问题进行辅导。',
      '',
      `学习阶段：${data.stage}`,
      `学科/内容：${data.subject}`,
      `辅导任务：${data.task}`,
      `学生层级：${data.level}`,
      `题目/问题/任务：${data.question}`,
      '',
      '分层辅导要求：',
      profile.prompt
    ];

    // 注入资料库上下文（常见错误、教学口诀、评分标准等）
    if (dataContext) {
      parts.push('');
      parts.push(dataContext);
    }

    parts.push('');
    parts.push('请直接输出学生和家长能照着做的辅导结果，不展示内部推理过程。');
    parts.push('');
    parts.push('输出结构：');
    parts.push('一、学生画像与诊断定位：用1-2句话说明当前最像哪一轨，指出最关键卡点。');
    parts.push('二、本次一对一目标：给出本次辅导要达到的可检查标准。尖子生写"拔高/迁移标准"；中等生写"稳定得分标准"。');
    parts.push('三、特级教师讲解：给3-5条可以马上照着做的方法。尖子生要有深度追问；中等生要有固定步骤。');
    parts.push('四、示范对比：给低分/普通做法与高分/稳定做法对比，重点展示方法，不替学生完成全部作业。');
    parts.push('五、当堂追问：给3个老师会继续追问的问题，并说明学生答到什么程度算过关。');
    parts.push('六、10分钟复练：安排1个同类短练习，写清完成标准。');
    parts.push('七、课后反馈单：分别给家长看"今天解决了什么、主要错因、下次练什么"。');
    parts.push('');
    parts.push('控制在1200字以内，语言清楚、具体、可执行。');

    return parts.join('\n');
  }

  // 从资料库提取上下文，注入到 AI 辅导提示中
  async function enrichDataContext(stage, subject, task) {
    if (!window.DataLib || !window.DataLib.load) return '';
    if (_dataContextCache) return _dataContextCache;

    var gradeNum = null;
    if (/一|1/.test(stage)) gradeNum = 1;
    else if (/二|2/.test(stage)) gradeNum = 2;
    else if (/三|3/.test(stage)) gradeNum = 3;
    else if (/四|4/.test(stage)) gradeNum = 4;
    else if (/五|5/.test(stage)) gradeNum = 5;
    else if (/六|6/.test(stage)) gradeNum = 6;

    var contextParts = [];

    try {
      // 加载常见错误库
      var mistakes = await DataLib.load('common-mistakes');
      if (mistakes && mistakes.错误分类) {
        var relevant = mistakes.错误分类.filter(function(e) {
          if (!gradeNum) return true;
          var range = e['年级范围'];
          if (!range || range === '1-6') return true;
          var parts = range.split('-');
          return gradeNum >= parseInt(parts[0], 10) && gradeNum <= parseInt(parts[1], 10);
        });
        if (relevant.length > 0) {
          contextParts.push('【' + (gradeNum ? gradeNum + '年级' : '') + '常见错误与纠正策略 — 辅导时可针对性引用】');
          relevant.forEach(function(err) {
            contextParts.push('• ' + err.类别 + '：' + err.说明);
            if (err.纠正策略) contextParts.push('  策略：' + err.纠正策略);
          });
        }
      }

      // 加载语法教学口诀
      var grammar = await DataLib.load('grammar');
      if (grammar) {
        if (grammar['词性'] && grammar['词性']['教学口诀']) {
          var tips = [];
          Object.keys(grammar['词性']['教学口诀']).forEach(function(k) { tips.push(k + '：' + grammar['词性']['教学口诀'][k]); });
          if (tips.length > 0) contextParts.push('【教学口诀参考】' + tips.join('；'));
        }
        if (grammar['修辞手法'] && grammar['修辞手法']['三层答题法']) {
          var m = grammar['修辞手法']['三层答题法'];
          contextParts.push('【修辞答题三层法 — 辅导阅读理解时引用】第一层：' + m['第一层'] + '；第二层：' + m['第二层'] + '；第三层：' + m['第三层']);
        }
        if (grammar['病句修改'] && grammar['病句修改']['修改铁律']) {
          contextParts.push('【病句修改铁律】' + grammar['病句修改']['修改铁律']);
        }
      }

      // 加载作文评分标准
      if (/作文|写作|升格/.test(task) || /作文|写作/.test(subject)) {
        var essays = await DataLib.load('model-essays');
        if (essays && essays['20分制评分标准']) {
          contextParts.push('\n【20分制作文评分标准 — 作文辅导时参考】');
          essays['20分制评分标准'].forEach(function(c) {
            contextParts.push(c.维度 + '(' + c.分值 + '分)：' + c.标准);
          });
        }
      }
    } catch(e) {
      console.warn('资料库上下文加载失败:', e);
    }

    var result = contextParts.length > 0
      ? '--- 以下为内置资料库参考资料，请在辅导中灵活引用 ---\n' + contextParts.join('\n')
      : '';
    _dataContextCache = result;
    return result;
  }

  function getSystemPrompt() {
    return '你是一位全学科特级教师和学习辅导 Agent，擅长按尖子生拔高轨和中等生提分轨做一对一辅导。输出只给辅导结果，不展示内部推理。';
  }

  function extractResponsesText(result) {
    if (!result) return '';
    if (typeof result.output_text === 'string') return result.output_text;
    if (!Array.isArray(result.output)) return '';

    return result.output
      .flatMap((item) => Array.isArray(item.content) ? item.content : [])
      .map((part) => part.text || part.output_text || '')
      .filter(Boolean)
      .join('\n');
  }

  async function requestAgent(data, dataContext) {
    const provider = getProvider(data.provider);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 90000);
    const userPrompt = buildPrompt(data, dataContext || '');
    const body = provider.format === 'responses'
      ? {
          model: data.model,
          temperature: 0.35,
          max_output_tokens: 3200,
          input: [
            { role: 'system', content: [{ type: 'input_text', text: getSystemPrompt() }] },
            { role: 'user', content: [{ type: 'input_text', text: userPrompt }] }
          ]
        }
      : {
          model: data.model,
          stream: false,
          temperature: 0.35,
          max_tokens: 3200,
          messages: [
            { role: 'system', content: getSystemPrompt() },
            { role: 'user', content: userPrompt }
          ]
        };

    try {
      const response = await fetch(provider.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.apiKey}`
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        const message = result && result.error && result.error.message
          ? result.error.message
          : `${provider.label} API 请求失败（HTTP ${response.status}）`;
        throw new Error(message);
      }

      const choice = result && result.choices && result.choices[0];
      const content = provider.format === 'responses'
        ? extractResponsesText(result)
        : choice && choice.message && choice.message.content;

      if (!content) throw new Error(`${provider.label} API 没有返回有效内容。`);

      return {
        content: content.trim(),
        finishReason: provider.format === 'responses'
          ? (result.status === 'incomplete' ? 'length' : '')
          : choice.finish_reason || ''
      };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function startVoiceInput(target, button) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('当前浏览器不支持网页语音输入，可使用手机键盘自带语音输入。', true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    button.disabled = true;
    setStatus('正在听，请说出题目或问题...');

    recognition.onresult = (event) => {
      const transcript = event.results && event.results[0] && event.results[0][0]
        ? event.results[0][0].transcript
        : '';
      target.value = target.value ? `${target.value}\n${transcript}` : transcript;
      setStatus('语音已填入输入框。');
    };
    recognition.onerror = () => setStatus('语音输入失败，可以改用键盘输入。', true);
    recognition.onend = () => { button.disabled = false; };
    recognition.start();
  }

  async function runAgent() {
    const data = {
      apiKey: keyInput.value.trim(),
      provider: getProviderId(),
      model: getFormValue('model'),
      question: getFormValue('question'),
      stage: getFormValue('stage'),
      subject: getFormValue('subject'),
      task: getFormValue('task'),
      level: getFormValue('level') || '自动判断'
    };
    const provider = getProvider(data.provider);

    if (!data.apiKey) {
      setStatus(`请先填写 ${provider.keyLabel}。`, true);
      keyInput.focus();
      return;
    }

    if (!data.question) {
      setStatus('请先输入题目、问题或任务。', true);
      questionInput.focus();
      return;
    }

    if (saveKeyInput && saveKeyInput.checked) {
      localStorage.setItem(provider.keyStorage, data.apiKey);
    } else {
      localStorage.removeItem(provider.keyStorage);
    }

    runButton.disabled = true;
    setStatus(`正在使用 ${provider.label} / ${data.model} 生成辅导建议...`);
    setOutput('AI 老师正在整理可直接使用的辅导建议，请稍等。', true);

    try {
      // 从资料库加载上下文（常见错误、口诀、评分标准）
      var dataContext = await enrichDataContext(data.stage, data.subject, data.task);
      var result = await requestAgent(data, dataContext);
      const limitTip = result.finishReason === 'length'
        ? '\n\n提示：本次内容达到单次输出上限。建议缩小问题范围后再生成。'
        : '';
      const answer = `${result.content}${limitTip}`;
      setOutput(answer, false);
      setStatus(result.finishReason === 'length' ? '辅导完成，但内容达到单次输出上限。' : '辅导完成。');
      addRecord(data, answer);
      document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      const message = error && error.name === 'AbortError'
        ? '请求超时，请稍后重试。'
        : (error && error.message ? error.message : '生成失败。');
      const corsTip = message === 'Failed to fetch'
        ? '如果部署后仍出现这个提示，通常是浏览器跨域限制，需要用 Vercel 或 Cloudflare 做代理接口。'
        : '请检查 API Key、模型名称、供应商地址或网络权限后再试。';
      setOutput(`生成失败。${corsTip}`, true);
      setStatus(message, true);
    } finally {
      runButton.disabled = false;
    }
  }

  refreshProviderFields();
  refreshTrackPanel();
  applyPrefillFromQuery();
  renderRecords();
  bindAgentBottomNav();

  if (providerSelect) providerSelect.addEventListener('change', refreshProviderFields);
  if (levelSelect) levelSelect.addEventListener('change', refreshTrackPanel);
  exampleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const stage = form.elements.stage;
      const subject = form.elements.subject;
      const task = form.elements.task;
      const level = form.elements.level;
      if (stage) stage.value = button.dataset.stage || stage.value;
      if (subject) subject.value = button.dataset.subject || subject.value;
      if (task) task.value = button.dataset.task || task.value;
      if (level) level.value = button.dataset.level || level.value;
      refreshTrackPanel();
      questionInput.value = button.dataset.question || '';
      questionInput.focus();
      setStatus('已填入示例，可按孩子的真实题目再改一改。');
    });
  });
  runButton.addEventListener('click', runAgent);
  clearButton && clearButton.addEventListener('click', () => {
    setOutput('输入问题后，点击"生成辅导"。', true);
    setStatus('');
  });
  forgetKeyButton && forgetKeyButton.addEventListener('click', () => {
    const provider = getProvider(getProviderId());
    localStorage.removeItem(provider.keyStorage);
    keyInput.value = '';
    if (saveKeyInput) saveKeyInput.checked = false;
    setStatus(`已清除本机浏览器保存的 ${provider.keyLabel}。`);
  });
  clearRecordsButton && clearRecordsButton.addEventListener('click', () => {
    localStorage.removeItem(RECORD_STORAGE);
    renderRecords();
    setStatus('已清空本机浏览器中的最近辅导记录。');
  });
  voiceQuestionButton && voiceQuestionButton.addEventListener('click', () => startVoiceInput(questionInput, voiceQuestionButton));
  photoInput && photoInput.addEventListener('change', () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) {
      photoPreview && photoPreview.classList.remove('is-visible');
      return;
    }
    if (photoImage) photoImage.src = URL.createObjectURL(file);
    if (photoName) photoName.textContent = file.name;
    if (photoPreview) photoPreview.classList.add('is-visible');
  });
})();
