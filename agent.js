(function () {
  const API_URL = 'https://api.deepseek.com/chat/completions';
  const KEY_STORAGE = 'diandianAgentDeepSeekKey';
  const RECORD_STORAGE = 'diandianAgentRecords';
  const MAX_RECORDS = 20;

  const form = document.getElementById('agent-form');
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
  const photoInput = document.getElementById('agent-photo');
  const photoPreview = document.getElementById('agent-photo-preview');
  const photoImage = document.getElementById('agent-photo-image');
  const photoName = document.getElementById('agent-photo-name');

  if (!form || !keyInput || !questionInput || !runButton || !output || !status) {
    return;
  }

  const savedKey = localStorage.getItem(KEY_STORAGE);
  if (savedKey) {
    keyInput.value = savedKey;
    saveKeyInput.checked = true;
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
      empty.textContent = '还没有辅导记录。生成一次辅导后，会自动保存在当前手机浏览器。';
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
      meta.textContent = `${record.subject || '自动判断'} · ${formatTime(record.createdAt)}`;

      button.appendChild(title);
      button.appendChild(meta);
      button.addEventListener('click', () => {
        questionInput.value = record.question || '';
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
      const outerWidth = Number(window.outerWidth || 0);
      const innerWidth = Number(window.innerWidth || 0);
      const visualWidth = Number(window.visualViewport && window.visualViewport.width || 0);
      const baseWidth = visualWidth >= 320 ? visualWidth : (innerWidth >= 320 ? innerWidth : outerWidth);
      const width = Math.min(Math.max((baseWidth || 390) - 24, 288), 430);

      nav.style.setProperty('left', '50%', 'important');
      nav.style.setProperty('right', 'auto', 'important');
      nav.style.setProperty('width', `${width}px`, 'important');
      nav.style.setProperty('max-width', `${width}px`, 'important');
      nav.style.setProperty('transform', 'translateX(-50%)', 'important');
    }

    const sectionHashes = ['#agent', '#records'];
    const sectionLinks = Array.from(nav.querySelectorAll('a')).filter((link) => sectionHashes.includes(link.getAttribute('href')));
    const sections = sectionHashes
      .map((hash) => ({ hash, element: document.getElementById(hash.slice(1)) }))
      .filter((item) => item.element);
    let lockedHash = '';
    let lockUntil = 0;

    function getCurrentHash() {
      if (lockedHash && Date.now() < lockUntil) {
        return lockedHash;
      }

      const viewportHeight = window.innerHeight || 700;
      const topOffset = 150;

      if (window.scrollY + viewportHeight >= document.documentElement.scrollHeight - 90) {
        return '#records';
      }

      const visibleSections = sections
        .map((item) => {
          const rect = item.element.getBoundingClientRect();
          return {
            hash: item.hash,
            distance: Math.abs(rect.top - topOffset),
            visible: rect.bottom > topOffset && rect.top < viewportHeight - 120
          };
        })
        .filter((item) => item.visible)
        .sort((a, b) => a.distance - b.distance);

      return visibleSections[0] ? visibleSections[0].hash : '#agent';
    }

    sectionLinks.forEach((link) => {
      link.addEventListener('click', () => {
        lockedHash = link.getAttribute('href') || '#agent';
        lockUntil = Date.now() + 1000;
        updateAgentBottomNav(lockedHash);
      });
    });

    sizeBottomNav();
    window.addEventListener('resize', sizeBottomNav);
    window.addEventListener('orientationchange', sizeBottomNav);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', sizeBottomNav);
    }

    updateAgentBottomNav(sectionHashes.includes(location.hash) ? location.hash : '#agent');
    window.addEventListener('hashchange', () => {
      if (sectionHashes.includes(location.hash)) {
        lockedHash = location.hash;
        lockUntil = Date.now() + 1000;
        updateAgentBottomNav(location.hash);
      } else {
        updateAgentBottomNav('#agent');
      }
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        updateAgentBottomNav(getCurrentHash());
        ticking = false;
      });
    }, { passive: true });
  }

  function addRecord(data, answer) {
    const records = getRecords();
    records.unshift({
      answer,
      createdAt: new Date().toISOString(),
      question: data.question.length > 48 ? `${data.question.slice(0, 48)}...` : data.question,
      subject: data.subject
    });
    saveRecords(records);
    renderRecords();
  }

  function buildPrompt(data) {
    return [
      '请以“特级教师、资深教研员、拔尖培优导师”的身份，针对下面学习问题进行辅导。',
      '',
      `学习阶段（仅作参考，不作限制）：${data.stage}`,
      `学科/内容（仅作参考，可自动判断）：${data.subject}`,
      `辅导任务：${data.task}`,
      `题目/问题/任务：${data.question}`,
      '',
      '请先在内部自动判断学科和任务类型，但不要展示分析过程、推理过程、判断依据或排除理由。',
      '请直接输出学生和家长能照着做的辅导结果，不要空泛鼓励。',
      '',
      '输出结构：',
      '一、诊断定位：用1-2句话判断当前属于基础达标、能力提升还是拔尖发展，并说清最该补的环节。',
      '二、拔尖目标：给出本次辅导要达到的可检查标准，不要只说“提高”。',
      '三、关键方法：给3-5条可以马上照着做的方法。',
      '四、示范升格：给低分/普通做法与拔尖做法对比，重点展示方法，不替学生完成全部作业。',
      '五、易错提醒：列3个常见误区，并给改法。',
      '六、10分钟训练与复盘：安排1个短练习，并给“错因、正确方法、下次提醒”的复盘要求。',
      '',
      '具体要求：',
      '- 作文/表达类：给中心、选材、结构、句段升格建议，并指出如何点题或写出变化。',
      '- 阅读类：提示结合原文依据，给答题句式，并说明答案少了哪一层。',
      '- 数学/理科类：给关键步骤、数量关系、公式或原理、检查方法。',
      '- 英语类：给规则、例句和替换练习。',
      '- 学习规划类：给可执行的短周期训练安排。',
      '- 控制在1200字以内，宁可精炼完整，也不要写到一半中断。'
    ].join('\n');
  }

  async function requestDeepSeek(data) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 90000);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.apiKey}`
        },
        body: JSON.stringify({
          model: data.model,
          stream: false,
          temperature: 0.35,
          max_tokens: 3200,
          messages: [
            {
              role: 'system',
              content: '你是一位全学科特级教师和学习辅导 Agent。输出只给辅导结果，不展示内部推理。'
            },
            {
              role: 'user',
              content: buildPrompt(data)
            }
          ]
        }),
        signal: controller.signal
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        const message = result && result.error && result.error.message
          ? result.error.message
          : `DeepSeek API 请求失败（HTTP ${response.status}）`;
        throw new Error(message);
      }

      const choice = result && result.choices && result.choices[0];
      const content = choice && choice.message && choice.message.content;

      if (!content) {
        throw new Error('DeepSeek API 没有返回有效内容。');
      }

      return {
        content: content.trim(),
        finishReason: choice.finish_reason || ''
      };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  runButton.addEventListener('click', async () => {
    const data = {
      apiKey: keyInput.value.trim(),
      model: getFormValue('model'),
      question: getFormValue('question'),
      stage: getFormValue('stage'),
      subject: getFormValue('subject'),
      task: getFormValue('task')
    };

    if (!data.apiKey) {
      setStatus('请先填写 DeepSeek API Key。', true);
      keyInput.focus();
      return;
    }

    if (!data.question) {
      setStatus('请先输入题目、问题或任务。', true);
      questionInput.focus();
      return;
    }

    if (saveKeyInput.checked) {
      localStorage.setItem(KEY_STORAGE, data.apiKey);
    } else {
      localStorage.removeItem(KEY_STORAGE);
    }

    runButton.disabled = true;
    setStatus('正在生成辅导建议...');
    setOutput('AI 老师正在整理可直接使用的辅导建议，请稍等。', true);

    try {
      const result = await requestDeepSeek(data);
      const limitTip = result.finishReason === 'length'
        ? '\n\n提示：本次内容达到单次输出上限。建议缩小问题范围，或补充“只讲某一部分”后再生成。'
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
        ? '如果你部署在 GitHub Pages 后看到这个提示，可能是浏览器跨域限制，需要再加 Vercel 或 Cloudflare 代理接口。'
        : '请检查 API Key、模型名称或网络权限后再试。';
      setOutput(`生成失败。${corsTip}`, true);
      setStatus(message, true);
    } finally {
      runButton.disabled = false;
    }
  });

  clearButton.addEventListener('click', () => {
    setOutput('输入问题后，点击“生成辅导”。', true);
    setStatus('');
  });

  forgetKeyButton.addEventListener('click', () => {
    localStorage.removeItem(KEY_STORAGE);
    keyInput.value = '';
    saveKeyInput.checked = false;
    setStatus('已清除本机浏览器保存的 DeepSeek API Key。');
  });

  if (clearRecordsButton) {
    clearRecordsButton.addEventListener('click', () => {
      localStorage.removeItem(RECORD_STORAGE);
      renderRecords();
      setStatus('已清空本机浏览器中的最近辅导记录。');
    });
  }

  function startVoiceInput(target, button) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('当前浏览器不支持网页语音输入。可以使用手机键盘自带语音输入。', true);
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
      if (transcript) {
        const prefix = target.value.trim() ? `${target.value.trim()}\n` : '';
        target.value = `${prefix}${transcript}`;
        setStatus('语音输入完成。');
      }
    };

    recognition.onerror = () => {
      setStatus('语音输入失败，请检查浏览器麦克风权限。', true);
    };

    recognition.onend = () => {
      button.disabled = false;
    };

    recognition.start();
  }

  if (voiceQuestionButton) {
    voiceQuestionButton.addEventListener('click', () => startVoiceInput(questionInput, voiceQuestionButton));
  }

  if (photoInput && photoPreview && photoImage && photoName) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) {
        photoPreview.classList.remove('is-visible');
        photoImage.removeAttribute('src');
        photoName.textContent = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        photoImage.src = String(reader.result || '');
        photoName.textContent = `${file.name}（静态版仅预览，请把图片文字输入到问题框）`;
        photoPreview.classList.add('is-visible');
      };
      reader.readAsDataURL(file);
    });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      return;
    }

    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      // PWA 缓存失败不影响页面核心功能。
    });
  }

  renderRecords();
  bindAgentBottomNav();
  registerServiceWorker();
})();
