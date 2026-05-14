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
      '请以“小学语文特级教师、资深作文阅卷老师、拔尖培优导师”的身份，针对下面作文题进行辅导。',
      '',
      `年级：${data.grade}`,
      `题材判断：${data.genre}`,
      `辅导目标：${data.mode}`,
      `作文题目：${data.title}`,
      data.material ? `孩子已有素材或想法：${data.material}` : '孩子已有素材或想法：暂无',
      '',
      '请按以下结构输出，语言要具体、清楚、像一线特级教师在给学生讲题，不要空泛鼓励：',
      '1. 题型判断：判断属于哪类作文，为什么。',
      '2. 审题抓手：圈出题眼、限制词和不能跑偏的地方。',
      '3. 立意梯度：给出普通立意、较好立意、拔尖立意。',
      '4. 可以从哪些方面写：列出孩子可展开的写作角度。',
      '5. 高分选材：给3个适合该题的具体素材方向，并说明哪个最稳。',
      '6. 三行提纲：开头写什么，中间重点段写什么，结尾落到哪里。',
      '7. 重点段怎么写：告诉孩子这个题最该详写哪一幕，应该加入哪些动作、语言、心理或环境描写。',
      '8. 开头和结尾示范：各给2个，不要写整篇作文。',
      '9. 常见失分点：列出3个最容易扣分的问题。',
      '10. 练习任务：给一个10分钟可完成的小练习。',
      '',
      '要求：',
      '- 不要直接代写完整作文，重点是分析与辅导。',
      '- 如果题目是半命题，先给3个补题建议，并比较优劣。',
      '- 如果题目是读后感，强调“述”和“感”的比例。',
      '- 如果题目是看图写话，按低年级表达要求讲完整句和顺序。',
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
              content: '你是一位小学语文特级教师，擅长把作文题拆成孩子能直接操作的审题、立意、选材、结构和升格步骤。'
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
      setStatus('请先输入作文题目。', true);
      document.getElementById('essay-title').focus();
      return;
    }

    if (saveKeyInput.checked) {
      localStorage.setItem(STORAGE_KEY, data.apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    runButton.disabled = true;
    setStatus('正在调用 DeepSeek API 生成特级教师分析...');
    setOutput('正在分析题目，请稍等。', true);

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
    setOutput('输入作文题目后，点击“生成特级教师分析”。', true);
    setStatus('');
  });

  forgetButton.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    keyInput.value = '';
    saveKeyInput.checked = false;
    setStatus('已清除本机保存的 DeepSeek API Key。');
  });
})();
