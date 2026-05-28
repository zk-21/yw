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
      '请以“资深小学语文教研员、作文与阅读辅导老师”的身份，针对下面问题进行辅导。',
      '',
      `学习阶段（表达深浅参考）：${data.grade}`,
      `辅导任务：${data.taskType}`,
      `作文/内容类型（可自动判断）：${data.genre}`,
      `辅导目标：${data.mode}`,
      `题目/问题/任务：${data.title}`,
      data.material ? `补充说明/原文/孩子答案：${data.material}` : '补充说明/原文/孩子答案：暂无',
      '',
      '请先在内部自动判断更适合按哪一类来辅导：作文、阅读理解、古诗文、语文基础、片段修改、口语交际、读后感或学习规划。',
      '这是作文专题页里的 AI 辅导，请不要扩展到数学、英语、科学等其他学科。',
      '学习阶段和内容类型只作为表达深浅的参考；如果用户选择“不限/自动判断”，请根据问题本身决定讲解深度和辅导重点。',
      '',
      '请直接输出辅导结果，语言要具体、清楚、像一线特级教师在给学生讲题，不要空泛鼓励。',
      '不要展示分析过程、推理过程、排除过程、内部判断步骤，也不要写“我是这样判断的”。只保留学生能直接照着做的建议、方法、示范和提醒。',
      '',
      '一、直接辅导建议',
      '1. 用1-2句话告诉学生当前最该抓住的核心任务。',
      '2. 给出最稳妥、最容易操作的解决方向。',
      '3. 如果信息不足，列出需要补充的关键信息，但不要中断辅导。',
      '',
      '二、关键方法',
      '给出3-5条可以马上照着做的方法。作文讲审题、选材、重点段和结尾；阅读讲答题模板和原文依据；古诗文讲景物、情感和句式；语文知识讲规则、例子和易错点；修改讲升格方向；学习规划讲训练步骤。',
      '',
      '三、示范',
      '给适量示范，重点展示方法，不要替学生完成全部作业。作文可给句段示范；阅读可给答题句式；古诗文可给赏析句式；语文知识可给例句和替换练习。',
      '',
      '四、易错提醒',
      '列出常见失分点或误区3个，并给出对应改法。',
      '',
      '五、10分钟练习',
      '安排1个短练习，让学生能立刻巩固当前方法。',
      '',
      '要求：',
      '- 不要直接代写完整作文或直接替学生完成所有作业；先讲思路、关键步骤和检查方法，必要时再给示范答案。',
      '- 如果题目是半命题，先给3个补题建议，并比较优劣。',
      '- 如果题目是读后感，强调“述”和“感”的比例。',
      '- 如果题目是看图写话，按低年级表达要求讲完整句和顺序。',
      '- 如果是阅读理解，必须提示“结合原文依据”。',
      '- 如果是语文知识或古诗文，讲清概念、例子、步骤和易错点。',
      '- 不要出现“分析过程”“推理过程”“判断依据”“排除理由”等展示过程的小标题。',
      '- 输出用清晰小标题，适合直接给家长和孩子阅读。',
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
              content: '你是一位小学语文特级教师和拔尖培优导师，擅长把作文、阅读理解、古诗文、表达修改和学习规划拆成学生能直接操作的步骤。'
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
    setStatus('正在调用 DeepSeek API 生成辅导建议...');
    setOutput('正在生成特级教师辅导建议，请稍等。', true);

    try {
      const result = await requestDeepSeek(data);
      const limitTip = result.finishReason === 'length'
        ? '\n\n提示：本次内容达到单次输出上限，建议缩小题目范围或补充“只讲某一部分”后再生成。'
        : '';
      setOutput(`${result.content}${limitTip}`, false);
      setStatus(result.finishReason === 'length' ? '辅导完成，但内容达到单次输出上限。' : '辅导完成。');
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
