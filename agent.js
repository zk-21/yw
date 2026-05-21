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
      subject: data.subject
    });
    saveRecords(records);
    renderRecords();
  }

  function buildPrompt(data) {
    return [
      '请以“特级教师、资深教研员、拔尖培优导师”的身份，针对下面学习问题进行辅导。',
      '',
      `学习阶段：${data.stage}`,
      `学科/内容：${data.subject}`,
      `辅导任务：${data.task}`,
      `题目/问题/任务：${data.question}`,
      '',
      '请直接输出学生和家长能照着做的辅导结果，不展示内部推理过程。',
      '',
      '输出结构：',
      '一、诊断定位：用1-2句话判断当前属于基础达标、能力提升还是拔尖发展。',
      '二、拔尖目标：给出本次辅导要达到的可检查标准。',
      '三、关键方法：给3-5条可以马上照着做的方法。',
      '四、示范升格：给低分/普通做法与拔尖做法对比，重点展示方法，不替学生完成全部作业。',
      '五、易错提醒：列2个常见误区，并给改法。',
      '六、10分钟训练与复盘：安排1个短练习，并给“错因、正确方法、下次提醒”的复盘要求。',
      '',
      '控制在1200字以内，语言清楚、具体、可执行。'
    ].join('\n');
  }

  function getSystemPrompt() {
    return '你是一位全学科特级教师和学习辅导 Agent。输出只给辅导结果，不展示内部推理。';
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

  async function requestAgent(data) {
    const provider = getProvider(data.provider);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 90000);
    const body = provider.format === 'responses'
      ? {
          model: data.model,
          temperature: 0.35,
          max_output_tokens: 3200,
          input: [
            { role: 'system', content: [{ type: 'input_text', text: getSystemPrompt() }] },
            { role: 'user', content: [{ type: 'input_text', text: buildPrompt(data) }] }
          ]
        }
      : {
          model: data.model,
          stream: false,
          temperature: 0.35,
          max_tokens: 3200,
          messages: [
            { role: 'system', content: getSystemPrompt() },
            { role: 'user', content: buildPrompt(data) }
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
      task: getFormValue('task')
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
      const result = await requestAgent(data);
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
  renderRecords();
  bindAgentBottomNav();

  if (providerSelect) providerSelect.addEventListener('change', refreshProviderFields);
  exampleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const stage = form.elements.stage;
      const subject = form.elements.subject;
      const task = form.elements.task;
      if (stage) stage.value = button.dataset.stage || stage.value;
      if (subject) subject.value = button.dataset.subject || subject.value;
      if (task) task.value = button.dataset.task || task.value;
      questionInput.value = button.dataset.question || '';
      questionInput.focus();
      setStatus('已填入示例，可按孩子的真实题目再改一改。');
    });
  });
  runButton.addEventListener('click', runAgent);
  clearButton && clearButton.addEventListener('click', () => {
    setOutput('输入问题后，点击“生成辅导”。', true);
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
