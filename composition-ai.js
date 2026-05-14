(function () {
  const STORAGE_KEY = 'compositionDeepSeekApiKey';
  const API_URL = 'https://api.deepseek.com/chat/completions';

  const form = document.getElementById('composition-ai-form');
  const runButton = document.getElementById('run-ai-tutor');
  const clearButton = document.getElementById('clear-ai-result');
  const forgetButton = document.getElementById('forget-deepseek-key');
  const output = document.getElementById('ai-output');
  const status = document.getElementById('ai-status');
  const keyInput = document.getElementById('deepseek-key');
  const saveKeyInput = document.getElementById('save-deepseek-key');
  const titleInput = document.getElementById('essay-title');
  const materialInput = document.getElementById('essay-material');
  const photoInput = document.getElementById('essay-photo');
  const photoPreview = document.getElementById('ai-photo-preview');
  const photoImage = document.getElementById('ai-photo-image');
  const photoName = document.getElementById('ai-photo-name');
  const voiceTitleButton = document.getElementById('voice-title');
  const voiceMaterialButton = document.getElementById('voice-material');

  if (!form || !runButton || !output || !status || !keyInput) {
    return;
  }

  const savedKey = localStorage.getItem(STORAGE_KEY);
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

  function buildPrompt(data) {
    return [
      '请以“特级教师、资深教研员、拔尖培优导师”的身份，针对下面问题进行辅导。',
      '',
      `学习阶段（仅作参考，不作限制）：${data.grade}`,
      `辅导任务：${data.taskType}`,
      `学科/内容类型（仅作参考，可自动判断）：${data.genre}`,
      `辅导目标：${data.mode}`,
      `题目/问题/任务：${data.title}`,
      data.material ? `补充说明/已有想法/原文片段：${data.material}` : '补充说明/已有想法/原文片段：暂无',
      '',
      '请先自动判断学科和任务类型：可能是作文、阅读理解、语文知识、数学解题、英语学习、科学探究、跨学科任务、片段修改、学习规划或其他学习问题。不要把所有问题都强行当成作文题，也不要限制在语文学科。',
      '学习阶段和学科选择只作为表达深浅的参考，不要限制答案范围；如果用户选择“不限/自动判断”，请根据问题本身决定讲解深度和学科方向。',
      '',
      '请按以下结构输出，语言要具体、清楚、像一线特级教师在给学生讲题，不要空泛鼓励。',
      '请展示“适合学生看的分析过程”：说明判断依据、排除理由、选择理由和解决路径，但不要输出冗长的内部思考或模型推理链。',
      '',
      '一、特级教师分析过程',
      '1. 第一步：判断学科和任务类型。说明你从哪些词、符号、材料或要求判断出来。',
      '2. 第二步：抓关键词。圈出题眼、问题要求、限制条件、已知信息或答题关键。',
      '3. 第三步：确定核心目标。如果是作文，定中心；如果是阅读，定答题角度；如果是数学/理科，定知识点和解法；如果是英语，定语法、词汇或表达目标；如果是修改，定修改方向。',
      '4. 第四步：选择方法或依据。如果是作文，选素材；如果是阅读，找文本依据；如果是数学/科学，列已知条件和公式/原理；如果是英语，找句子结构和规则。',
      '5. 第五步：安排作答。说明怎样组织答案、提纲、步骤、段落、计算过程或练习路径。',
      '',
      '二、可以从哪些方面展开',
      '根据学科和任务类型列出可展开角度。作文讲写作角度；阅读讲答题角度；数学讲条件、数量关系和解法；英语讲规则、例句和迁移；科学讲概念、现象和证据；修改讲升格方向；学习规划讲训练步骤。',
      '',
      '三、推荐辅导方案',
      '1. 最稳思路：给出最适合当前任务的解决方向。',
      '2. 操作步骤：给出3-5步可以照着做的方法。',
      '3. 示例：给适量示范，重点展示方法，不要替学生完成全部作业。',
      '4. 提升点：指出怎样从普通答案提升到更好答案。',
      '',
      '四、示范与避坑',
      '1. 如果是作文：给开头/结尾或重点段示范。',
      '2. 如果是阅读：给答题模板和文本依据组织方式。',
      '3. 如果是数学/理科：给关键步骤、易错点和检验方法。',
      '4. 如果是英语：给规则解释、例句和替换练习。',
      '5. 常见失分点或误区3个。',
      '6. 10分钟练习任务1个。',
      '',
      '要求：',
      '- 不要直接代写完整作文或直接替学生完成所有作业；如果是解题，先讲思路、关键步骤和检查方法，必要时再给示范答案。',
      '- 如果题目是半命题，先给3个补题建议，并比较优劣。',
      '- 如果题目是读后感，强调“述”和“感”的比例。',
      '- 如果题目是看图写话，按低年级表达要求讲完整句和顺序。',
      '- 如果是阅读理解，必须提示“结合原文依据”。',
      '- 如果是语文知识、数学、英语、科学或其他学科，讲清概念、例子、步骤和易错点。',
      '- 输出要有“为什么这样判断”的过程，让孩子能学会迁移到下一道题、下一类题。',
      '- 输出用清晰小标题，适合直接给家长和孩子阅读。'
    ].join('\n');
  }

  async function requestDeepSeek(data) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 60000);

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
          max_tokens: 1800,
          messages: [
            {
              role: 'system',
              content: '你是一位全学科特级教师和拔尖培优导师，擅长把作文、阅读理解、数学解题、英语学习、科学探究、表达修改和学习规划拆成学生能直接操作的步骤。'
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

      const content = result && result.choices && result.choices[0] &&
        result.choices[0].message && result.choices[0].message.content;

      if (!content) {
        throw new Error('DeepSeek API 没有返回有效内容。');
      }

      return content.trim();
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  runButton.addEventListener('click', async () => {
    const data = {
      apiKey: keyInput.value.trim(),
      taskType: getFormValue('taskType'),
      grade: getFormValue('grade'),
      genre: getFormValue('genre'),
      model: getFormValue('model'),
      mode: getFormValue('mode'),
      title: getFormValue('title'),
      material: getFormValue('material')
    };

    if (!data.apiKey) {
      setStatus('请先填写 DeepSeek API Key。', true);
      keyInput.focus();
      return;
    }

    if (!data.title) {
      setStatus('请先输入题目、问题或任务。', true);
      titleInput.focus();
      return;
    }

    if (saveKeyInput.checked) {
      localStorage.setItem(STORAGE_KEY, data.apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    runButton.disabled = true;
    setStatus('正在调用 DeepSeek API 生成分析过程与辅导...');
    setOutput('正在按特级教师步骤分析问题，请稍等。', true);

    try {
      const content = await requestDeepSeek(data);
      setOutput(content, false);
      setStatus('分析完成。');
    } catch (error) {
      const message = error && error.name === 'AbortError'
        ? '请求超时，请稍后重试。'
        : (error && error.message ? error.message : '生成失败，请检查 API Key 或网络。');
      setOutput('生成失败。请检查 API Key、模型名称或浏览器网络权限后再试。', true);
      setStatus(message, true);
    } finally {
      runButton.disabled = false;
    }
  });

  clearButton.addEventListener('click', () => {
    setOutput('输入题目、问题或材料后，点击“生成特级教师辅导”。', true);
    setStatus('');
  });

  forgetButton.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    keyInput.value = '';
    saveKeyInput.checked = false;
    setStatus('已清除本机保存的 DeepSeek API Key。');
  });

  function startVoiceInput(target, button) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('当前浏览器不支持语音输入。可以使用手机系统键盘自带语音输入，或手动输入文字。', true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    button.disabled = true;
    setStatus('正在听，请说出内容...');

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

  if (voiceTitleButton && titleInput) {
    voiceTitleButton.addEventListener('click', () => startVoiceInput(titleInput, voiceTitleButton));
  }

  if (voiceMaterialButton && materialInput) {
    voiceMaterialButton.addEventListener('click', () => startVoiceInput(materialInput, voiceMaterialButton));
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
        photoName.textContent = `${file.name}（请把图片中的文字输入到题目或补充说明中）`;
        photoPreview.classList.add('is-visible');
      };
      reader.readAsDataURL(file);
    });
  }
})();
