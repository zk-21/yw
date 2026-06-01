// ══════ 安全 localStorage 读取工具 ══════
function safeParse(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('[Data] localStorage 数据损坏，已重置:', key, e.message);
    try { localStorage.removeItem(key); } catch (_) {}
    return fallback;
  }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

// 练习数据


// 当前状态
let currentTransform = 0;
let currentRhetoric = 0;
let currentPoem = 0;
let currentReading = 0;
let currentVocab = 0;
let currentLevel = 'easy';
let correctCount = 0;
let currentThinking = 0;
let rhetoricData = null;
let poemData = null;
let transformData = null;
let readingData = null;
let vocabData = null;
let thinkingData = null;
let dynamicDiagnosisBank = null;
let rhetoricDataPromise = null;
let poemDataPromise = null;
let transformDataPromise = null;
let readingDataPromise = null;
let vocabDataPromise = null;
let thinkingDataPromise = null;
let dynamicDiagnosisBankPromise = null;
let practiceDataVersion = null;
let hasInitializedInteractivePractice = false;

function getPracticeDataVersion() {
  if (practiceDataVersion !== null) {
    return practiceDataVersion;
  }

  const scripts = document.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) {
    const src = scripts[i].getAttribute('src') || '';
    if (src.includes('practice.js') || src.includes('data-loader-global.js') || src.includes('data-loader-core.js')) {
      const match = src.match(/[?&]v=([^&]+)/);
      if (match) {
        practiceDataVersion = match[1];
        return practiceDataVersion;
      }
    }
  }

  practiceDataVersion = 'dev';
  return practiceDataVersion;
}

function loadPracticeDataset(name) {
  const dataLib = window.DataLib || window.DataLibCore;
  if (dataLib && typeof dataLib.load === 'function') {
    return dataLib.load(name);
  }

  const url = `data/${name}.json?v=${encodeURIComponent(getPracticeDataVersion())}`;
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`Failed to load: ${url} (${response.status})`);
    }
    return response.json();
  });
}

function getExercisesCollection(data) {
  if (!data || typeof data !== 'object') {
    return null;
  }
  if (Array.isArray(data.items)) {
    return data.items;
  }

  const firstArray = Object.keys(data)
    .map(key => data[key])
    .find(Array.isArray);

  return firstArray || null;
}

function cacheExercisesDataset(data) {
  const items = getExercisesCollection(data);
  if (!items) {
    return null;
  }
  window.exercisesData = data;
  window.exercisesDataItems = items;
  return data;
}

function loadExercisesDataset() {
  if (window.exercisesDataItems && Array.isArray(window.exercisesDataItems)) {
    return Promise.resolve(window.exercisesData);
  }
  if (window.exercisesData && getExercisesCollection(window.exercisesData)) {
    window.exercisesDataItems = getExercisesCollection(window.exercisesData);
    return Promise.resolve(window.exercisesData);
  }
  if (window.__exercisesDataPromise) {
    return window.__exercisesDataPromise;
  }

  const dataLib = window.DataLib || window.DataLibCore;
  const request = dataLib && typeof dataLib.load === 'function'
    ? dataLib.load('exercises')
    : fetch(`data/exercises.json?v=${encodeURIComponent(getPracticeDataVersion())}`).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load exercises.json (${response.status})`);
        }
        return response.json();
      });

  window.__exercisesDataPromise = request
    .then(data => cacheExercisesDataset(data))
    .catch(err => {
      window.__exercisesDataPromise = null;
      throw err;
    });

  return window.__exercisesDataPromise;
}

window.loadExercisesDataset = loadExercisesDataset;

function ensureTransformData() {
  if (Array.isArray(transformData)) {
    return Promise.resolve(transformData);
  }
  if (transformDataPromise) {
    return transformDataPromise;
  }

  transformDataPromise = loadPracticeDataset('practice-transform')
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid transform practice data');
      }
      transformData = data;
      return data;
    })
    .catch(err => {
      console.warn('Failed to load transform practice data:', err);
      return null;
    })
    .finally(() => {
      transformDataPromise = null;
    });

  return transformDataPromise;
}

function ensureReadingData() {
  if (Array.isArray(readingData)) {
    return Promise.resolve(readingData);
  }
  if (readingDataPromise) {
    return readingDataPromise;
  }

  readingDataPromise = loadPracticeDataset('practice-reading')
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid reading practice data');
      }
      readingData = data;
      return data;
    })
    .catch(err => {
      console.warn('Failed to load reading practice data:', err);
      return null;
    })
    .finally(() => {
      readingDataPromise = null;
    });

  return readingDataPromise;
}

function ensureRhetoricData() {
  if (Array.isArray(rhetoricData)) {
    return Promise.resolve(rhetoricData);
  }
  if (rhetoricDataPromise) {
    return rhetoricDataPromise;
  }

  rhetoricDataPromise = loadPracticeDataset('practice-rhetoric')
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid rhetoric practice data');
      }
      rhetoricData = data;
      return data;
    })
    .catch(err => {
      console.warn('Failed to load rhetoric practice data:', err);
      return null;
    })
    .finally(() => {
      rhetoricDataPromise = null;
    });

  return rhetoricDataPromise;
}

function ensurePoemData() {
  if (Array.isArray(poemData)) {
    return Promise.resolve(poemData);
  }
  if (poemDataPromise) {
    return poemDataPromise;
  }

  poemDataPromise = loadPracticeDataset('practice-poem')
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid poem practice data');
      }
      poemData = data;
      return data;
    })
    .catch(err => {
      console.warn('Failed to load poem practice data:', err);
      return null;
    })
    .finally(() => {
      poemDataPromise = null;
    });

  return poemDataPromise;
}

function ensureVocabData() {
  if (Array.isArray(vocabData)) {
    return Promise.resolve(vocabData);
  }
  if (vocabDataPromise) {
    return vocabDataPromise;
  }

  vocabDataPromise = loadPracticeDataset('practice-vocab')
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid vocab practice data');
      }
      vocabData = data;
      return data;
    })
    .catch(err => {
      console.warn('Failed to load vocab practice data:', err);
      return null;
    })
    .finally(() => {
      vocabDataPromise = null;
    });

  return vocabDataPromise;
}

function ensureThinkingData() {
  if (Array.isArray(thinkingData)) {
    return Promise.resolve(thinkingData);
  }
  if (thinkingDataPromise) {
    return thinkingDataPromise;
  }

  thinkingDataPromise = loadPracticeDataset('practice-thinking')
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid thinking practice data');
      }
      thinkingData = data;
      return data;
    })
    .catch(err => {
      console.warn('Failed to load thinking practice data:', err);
      return null;
    })
    .finally(() => {
      thinkingDataPromise = null;
    });

  return thinkingDataPromise;
}

function ensureDynamicDiagnosisBank() {
  if (Array.isArray(dynamicDiagnosisBank)) {
    return Promise.resolve(dynamicDiagnosisBank);
  }
  if (dynamicDiagnosisBankPromise) {
    return dynamicDiagnosisBankPromise;
  }

  dynamicDiagnosisBankPromise = loadPracticeDataset('practice-dynamic-diagnosis')
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid dynamic diagnosis bank');
      }
      dynamicDiagnosisBank = data;
      return data;
    })
    .catch(err => {
      console.warn('Failed to load dynamic diagnosis bank:', err);
      return null;
    })
    .finally(() => {
      dynamicDiagnosisBankPromise = null;
    });

  return dynamicDiagnosisBankPromise;
}

function renderPracticeOptionsMessage(container, message) {
  if (!container) {
    return;
  }

  container.innerHTML = '';
  if (!message) {
    return;
  }

  const notice = document.createElement('p');
  notice.style.margin = '0';
  notice.style.padding = '14px 16px';
  notice.style.background = '#f8fafc';
  notice.style.border = '1px dashed #cbd5e1';
  notice.style.borderRadius = '12px';
  notice.style.color = '#64748b';
  notice.textContent = message;
  container.appendChild(notice);
}

function renderTransformState(questionText, sentenceText, optionsMessage) {
  const question = document.getElementById('transformQuestion');
  const sentence = document.getElementById('transformSentence');
  const options = document.getElementById('transformOptions');

  if (question) {
    question.textContent = questionText || '';
  }
  if (sentence) {
    sentence.textContent = sentenceText || '';
  }
  renderPracticeOptionsMessage(options, optionsMessage);
}

function renderReadingState(textValue, questionValue, optionsMessage) {
  const text = document.getElementById('readingText');
  const question = document.getElementById('readingQuestion');
  const options = document.getElementById('readingOptions');

  if (text) {
    text.textContent = textValue || '';
  }
  if (question) {
    question.textContent = questionValue || '';
  }
  renderPracticeOptionsMessage(options, optionsMessage);
}

function renderRhetoricState(sentenceText, optionsMessage) {
  const sentence = document.getElementById('rhetoricSentence');
  const options = document.getElementById('rhetoricOptions');

  if (sentence) {
    sentence.textContent = sentenceText || '';
  }
  renderPracticeOptionsMessage(options, optionsMessage);
}

function renderPoemState(titleText, bodyHtml) {
  const title = document.getElementById('poemTitle');
  const text = document.getElementById('poemText');

  if (title) {
    title.textContent = titleText || '';
  }
  if (text) {
    text.innerHTML = bodyHtml || '';
  }
}

function renderVocabState(sentenceText, optionsMessage) {
  const sentence = document.getElementById('vocabSentence');
  const options = document.getElementById('vocabOptions');

  if (sentence) {
    sentence.textContent = sentenceText || '';
  }
  renderPracticeOptionsMessage(options, optionsMessage);
}

function renderThinkingState(badgeText, contentHtml) {
  const badge = document.getElementById('thinkingBadge');
  const content = document.getElementById('thinkingContent');
  const explanation = document.getElementById('thinkingExplanation');
  const nextBtn = document.getElementById('thinkingNextBtn');

  if (badge) {
    badge.textContent = badgeText || '';
    badge.className = 'thinking-badge upgrade';
  }
  if (content) {
    content.innerHTML = contentHtml || '';
  }
  if (explanation) {
    explanation.style.display = 'none';
  }
  if (nextBtn) {
    nextBtn.style.display = 'none';
  }
}

function getReadingItemsForCurrentLevel() {
  if (!Array.isArray(readingData)) {
    return [];
  }
  return readingData.filter(item => item.level === currentLevel);
}

function getVocabItemsForCurrentLevel() {
  if (!Array.isArray(vocabData)) {
    return [];
  }
  return vocabData.filter(item => item.level === currentLevel);
}

function getActivePracticeMode() {
  const activeButton = document.querySelector('.mode-btn[data-mode].active');
  return activeButton ? activeButton.dataset.mode : 'transform';
}

function syncPracticeLevelButtons() {
  document.querySelectorAll('.mode-btn[data-level]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === currentLevel);
  });
}

function initPracticeMode(mode) {
  switch (mode) {
    case 'transform':
      initTransform();
      break;
    case 'rhetoric':
      initRhetoric();
      break;
    case 'poem':
      initPoem();
      break;
    case 'reading':
      initReading();
      break;
    case 'vocabulary':
      initVocab();
      break;
    case 'thinking':
      initThinking();
      break;
    default:
      initTransform();
      break;
  }
}

function initInteractivePractice() {
  if (hasInitializedInteractivePractice) {
    return;
  }

  hasInitializedInteractivePractice = true;
  initPracticeMode(getActivePracticeMode());
}

function observeInteractivePractice() {
  const section = document.querySelector('.interactive-practice');
  if (!section) {
    initInteractivePractice();
    return;
  }

  if (!('IntersectionObserver' in window)) {
    initInteractivePractice();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer.disconnect();
      initInteractivePractice();
    }
  }, {
    rootMargin: '300px 0px'
  });

  observer.observe(section);
}

// 从localStorage加载进度
function loadProgress() {
  var data = safeParse('chinesePractice', null);
  if (data) {
    currentLevel = data.level || 'easy';
    correctCount = data.correctCount || 0;
  }
}

// 保存进度到localStorage
function saveProgress() {
  safeSet('chinesePractice', {
    level: currentLevel,
    correctCount: correctCount,
    lastDate: new Date().toISOString().split('T')[0]
  });
}

// 错题本功能
function saveWrongAnswer(type, question, userAnswer, correctAnswer, tip, questionId) {
  var wrongList = safeParse('wrongAnswers', []);
  const now = new Date().toISOString();
  const wrongItem = {
    type: type,
    question: question,
    userAnswer: userAnswer,
    correctAnswer: correctAnswer,
    tip: tip,
    questionId: questionId,    // 关联题库ID，用于获取解析分级
    timestamp: now,
    mastery: 'new',           // new | learning | reviewing | mastered
    reviewCount: 0,
    lastReviewed: null,
    nextReview: addDays(now, 3)  // 3 天后首次复习
  };
  
  wrongList.push(wrongItem);
  if (wrongList.length > 50) {
    wrongList.shift();
  }
  
  safeSet('wrongAnswers', wrongList);
  renderAutoRoutingPanel();
}

// ── 帮助函数 ──
function addDays(isoDate, days) {
  var d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
function daysBetween(d1, d2) {
  return Math.floor((new Date(d2) - new Date(d1)) / 86400000);
}

// ── 间隔复习算法（间隔重复） ──
function calculateNextReview(reviewCount) {
  // 1→2→4→7→14→30 天间隔
  var intervals = [1, 2, 4, 7, 14, 30];
  var days = intervals[Math.min(reviewCount, intervals.length - 1)];
  return addDays(new Date().toISOString(), days);
}

// ── 标记错题已复习 ──
function markWrongItemReviewed(index, mastered) {
  var wrongList = getWrongAnswers();
  if (index >= 0 && index < wrongList.length) {
    var item = wrongList[index];
    item.reviewCount = (item.reviewCount || 0) + 1;
    item.lastReviewed = new Date().toISOString();
    item.nextReview = calculateNextReview(item.reviewCount);
    if (mastered) {
      item.mastery = 'mastered';
    } else {
      item.mastery = item.reviewCount >= 3 ? 'reviewing' : 'learning';
    }
    safeSet('wrongAnswers', wrongList);
    renderWrongList();
    renderAutoRoutingPanel();
    return item;
  }
  return null;
}

// ── 掌握状态标签 ──
function getMasteryLabel(mastery) {
  var labels = { new: '🆕 新收录', learning: '📖 学习中', reviewing: '🔄 复习中', mastered: '✅ 已掌握' };
  var colors = { new: '#f59e0b', learning: '#3b82f6', reviewing: '#8b5cf6', mastered: '#10b981' };
  return { label: labels[mastery] || '🆕 新收录', color: colors[mastery] || '#f59e0b' };
}

// ── 导出打印错题本 ──
function exportWrongBook(skipAnalysisLoad) {
  var wrongList = getWrongAnswers();
  if (wrongList.length === 0) { alert('暂无错题可导出'); return; }
  if (!skipAnalysisLoad && !window.exercisesData) {
    loadExercisesDataForWrongBook().finally(function() {
      exportWrongBook(true);
    });
    return;
  }
  
  var html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">';
  html += '<title>错题复习单 - 语文成长地图</title>';
  html += '<style>body{font-family: -apple-system, "Microsoft YaHei", sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;}';
  html += 'h1{text-align:center; color: #4f46e5; border-bottom: 3px solid #667eea; padding-bottom: 10px;}';
  html += '.meta{text-align:center; color: #999; font-size: 13px; margin-bottom: 24px;}';
  html += '.wrong-item{background: #f8f9fb; border-radius: 12px; padding: 16px; margin-bottom: 16px; border-left: 4px solid #667eea;}';
  html += '.wrong-q{font-weight: 600; margin-bottom: 8px;}';
  html += '.wrong-a{font-size: 14px; margin: 4px 0;} .wrong-a span{display:inline-block; min-width: 60px; color: #888; font-size: 12px;}';
  html += '.wrong-correct{color: #10b981;} .wrong-user{color: #ef4444;}';
  html += '.wrong-tip{background: #fff7ed; padding: 8px 12px; border-radius: 6px; margin-top: 8px; font-size: 13px; color: #92400e;}';
  html += '.mastery-badge{display:inline-block; padding: 2px 10px; border-radius: 10px; font-size: 11px; margin-left: 8px;}';
  html += '@media print{body{padding: 0;}.wrong-item{break-inside: avoid;}}</style></head><body>';
  
  html += '<h1>📝 错题复习单</h1>';
  html += '<p class="meta">生成时间：' + new Date().toLocaleDateString('zh-CN') + ' ｜ 共 ' + wrongList.length + ' 题</p>';
  
  wrongList.forEach(function(item, i) {
    var m = getMasteryLabel(item.mastery || 'new');
    var nextRev = item.nextReview ? '下次复习：' + new Date(item.nextReview).toLocaleDateString('zh-CN') : '';
    var analysisSource = getAnalysisSourceForWrongItem(item);
    var analysis = analysisSource && analysisSource.解析分级;
    html += '<div class="wrong-item">';
    html += '<div class="wrong-q">' + (i + 1) + '. ' + escapeHTML(item.question || '') + '</div>';
    html += '<div class="wrong-a wrong-user"><span>你的答案：</span>' + escapeHTML(item.userAnswer || '') + '</div>';
    html += '<div class="wrong-a wrong-correct"><span>正确答案：</span>' + escapeHTML(item.correctAnswer || '') + '</div>';
    if (item.tip) html += '<div class="wrong-tip">💡 ' + escapeHTML(item.tip) + '</div>';
    if (analysis) {
      html += '<div class="wrong-tip"><strong>易错点：</strong>' + escapeHTML((analysis.易错点 || []).join('；')) + '</div>';
      if (analysis.低分示例) html += '<div class="wrong-a wrong-user"><span>低分答案：</span>' + escapeHTML(analysis.低分示例) + '</div>';
      if (analysis.错因点评) html += '<div class="wrong-tip"><strong>错因点评：</strong>' + escapeHTML(analysis.错因点评) + '</div>';
      if (analysis.满分表达) html += '<div class="wrong-a wrong-correct"><span>满分表达：</span>' + escapeHTML(analysis.满分表达) + '</div>';
      if (analysis.家长讲解话术) html += '<div class="wrong-tip"><strong>家长讲解：</strong>' + escapeHTML(analysis.家长讲解话术) + '</div>';
      if (analysis.复练任务) html += '<div class="wrong-tip"><strong>复练任务：</strong>' + escapeHTML(analysis.复练任务) + '</div>';
    }
    var similarExercises = getSimilarExercisesForWrongItem(item, analysisSource);
    if (similarExercises.length) {
      html += '<div class="wrong-tip"><strong>同类复练：</strong><ol style="margin:6px 0 0 18px;padding:0;">';
      similarExercises.forEach(function(question) {
        html += '<li>' + escapeHTML(question.年级) + '年级 · ' + escapeHTML(question.类型) + ' · ' + escapeHTML(question.错因码 || '') + '：' + escapeHTML(question.题目 || '') + '</li>';
      });
      html += '</ol></div>';
    }
    html += '<div style="margin-top: 6px; font-size: 12px; color: #888;">';
    html += '<span class="mastery-badge" style="background:' + m.color + '20; color:' + m.color + ';">' + m.label + '</span>';
    html += nextRev ? ' <span style="margin-left:8px;">' + nextRev + '</span>' : '';
    html += '</div></div>';
  });
  
  html += '</body></html>';
  
  var w = window.open('', '_blank', 'width=900,height=700');
  w.document.write(html);
  w.document.close();
  setTimeout(function() { w.print(); }, 500);
}

function getWrongAnswers() {
  return safeParse('wrongAnswers', []);
}

function clearWrongAnswers() {
  if (confirm('确定要清空所有错题吗？')) {
    localStorage.removeItem('wrongAnswers');
    renderWrongList();
    renderAutoRoutingPanel();
  }
}

let exercisesDataPromise = null;
let wrongBookAnalysisRefreshPending = false;

// 加载结构化题库，供错题本匹配解析分级。
function loadExercisesDataForWrongBook() {
  if (window.exercisesDataItems && Array.isArray(window.exercisesDataItems)) {
    return Promise.resolve(window.exercisesData);
  }
  if (window.exercisesData && Array.isArray(window.exercisesData.题库)) {
    window.exercisesDataItems = window.exercisesData.题库;
    return Promise.resolve(window.exercisesData);
  }
  if (exercisesDataPromise) return exercisesDataPromise;

  exercisesDataPromise = loadExercisesDataset().catch(() => null);
  return exercisesDataPromise;
}

function requestWrongBookAnalysisRefresh() {
  if (window.exercisesData || wrongBookAnalysisRefreshPending) return;
  wrongBookAnalysisRefreshPending = true;
  loadExercisesDataForWrongBook().then(data => {
    if (data) renderWrongList();
  }).finally(() => {
    wrongBookAnalysisRefreshPending = false;
  });
}

function getExerciseBank() {
  return window.exercisesDataItems && Array.isArray(window.exercisesDataItems)
    ? window.exercisesDataItems
    : window.exercisesData && Array.isArray(window.exercisesData.题库)
    ? window.exercisesData.题库
    : [];
}

function normalizeQuestionText(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/第\d+题[:：]?/g, '')
    .replace(/[“”"‘’'《》（）()，,。.!！?？、:：;；\s]/g, '')
    .toLowerCase();
}

function findExerciseByQuestionId(questionId) {
  if (!questionId) return null;
  return getExerciseBank().find(q => q.id === questionId) || null;
}

function findExerciseByQuestionText(questionText) {
  const normalized = normalizeQuestionText(questionText);
  if (!normalized) return null;
  return getExerciseBank().find(q => {
    const target = normalizeQuestionText(q.题目);
    if (!target) return false;
    const shorter = target.length <= normalized.length ? target : normalized;
    const longer = target.length > normalized.length ? target : normalized;
    return shorter.length >= 12
      ? longer.includes(shorter)
      : target === normalized;
  }) || null;
}

function getAnalysisSourceForWrongItem(item) {
  return findExerciseByQuestionId(item.questionId) || findExerciseByQuestionText(item.question);
}

function getWrongItemErrorCode(item, source) {
  const categoryAlias = {
    b1: 'B1',
    r1: 'R1',
    r2: 'R2',
    r3: 'R3',
    r4: 'R4',
    w1: 'W1',
    w2: 'W2',
    w3: 'W3',
    c1: 'C1',
    shenti: 'W3',
    xinxi: 'R2',
    gaikuo: 'R1',
    biaoda: 'C1',
    moban: 'R3'
  };
  const category = normalizeErrorCategoryId(item?.errorCategory || '');
  return String(source?.错因码 || item?.errorCode || categoryAlias[category] || '').toUpperCase();
}

function getSimilarExercisesForWrongItem(item, source) {
  const bank = getExerciseBank();
  if (!bank.length) return [];

  const currentId = source?.id || item?.questionId || '';
  const errorCode = getWrongItemErrorCode(item, source);
  const sourceSkills = new Set(source?.能力点 || []);
  const sourceGrade = source?.年级 || Number(item?.diagnosisGrade) || null;
  const sourceType = source?.类型 || '';

  return bank
    .filter(question => question && question.id !== currentId)
    .map(question => {
      let score = 0;
      if (errorCode && question.错因码 === errorCode) score += 12;
      if (sourceGrade && Number(question.年级) === Number(sourceGrade)) score += 2;
      if (sourceType && question.类型 === sourceType) score += 2;
      (question.能力点 || []).forEach(skill => {
        if (sourceSkills.has(skill)) score += 3;
      });
      if (question.可打印) score += 1;
      return score > 0 ? { question, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || String(a.question.id).localeCompare(String(b.question.id)))
    .slice(0, 3)
    .map(item => item.question);
}

function renderSimilarExerciseRecommendations(item, source) {
  const recommendations = getSimilarExercisesForWrongItem(item, source);
  if (!recommendations.length) return '';

  const errorCode = getWrongItemErrorCode(item, source);
  return `
    <div class="same-error-recommendations">
      <div class="same-error-title">同类复练路径${errorCode ? ` · ${escapeHTML(errorCode)}` : ''}</div>
      <div class="same-error-list">
        ${recommendations.map((question, index) => {
          const analysis = question.解析分级 || {};
          const task = analysis.复练任务 || question.解析 || '完成后对照满分表达复盘。';
          return `
            <div class="same-error-card">
              <div class="same-error-meta">${index + 1}. ${escapeHTML(question.年级)}年级 · ${escapeHTML(question.类型)} · ${escapeHTML(question.错因码 || '')}</div>
              <div class="same-error-question">${escapeHTML(question.题目)}</div>
              <div class="same-error-task">复练：${escapeHTML(task)}</div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

// 获取题目解析分级（从题库中）
function getAnalysisByQuestionId(questionId) {
  const question = findExerciseByQuestionId(questionId);
  return question?.解析分级 || null;
}

// 获取题目解析分级（按题目内容匹配）
function getAnalysisByQuestionText(questionText) {
  const question = findExerciseByQuestionText(questionText);
  return question?.解析分级 || null;
}

function renderAnalysisField(title, content, className) {
  if (Array.isArray(content)) {
    if (!content.length) return '';
    return `
      <div class="analysis-card ${className || ''}">
        <div class="analysis-header">${title}</div>
        <ul class="analysis-list">${content.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
      </div>`;
  }
  if (!content) return '';
  return `
    <div class="analysis-card ${className || ''}">
      <div class="analysis-header">${title}</div>
      <div class="analysis-content">${escapeHTML(content)}</div>
    </div>`;
}

function getAnswerGapTags(analysis, source) {
  const text = [
    analysis?.解题思路,
    analysis?.低分示例,
    analysis?.满分表达,
    source?.类型,
    source?.错因码,
    ...(source?.能力点 || [])
  ].join(' ');
  const tags = [];

  function add(label, desc) {
    if (!tags.some(tag => tag.label === label)) tags.push({ label, desc });
  }

  if (/依据|原文|证据|find_evidence|R2/.test(text)) {
    add('缺了依据', '需要回到原文或材料，写出能证明结论的关键词句。');
  }
  if (/分析|说明|表现|体现|作用|赏析|appreciate|R3|C1/.test(text)) {
    add('缺了分析', '不能只给结论，要说明依据为什么能推出这个答案。');
  }
  if (/空泛|具体|生动|细节|太短|W1|W2|表达/.test(text)) {
    add('语言太空', '要补动作、特点、效果或具体场景，少用“很好”“很美”这类空话。');
  }
  if (/题眼|中心|点题|回扣|审题|W3|organize|idea/.test(text)) {
    add('没有回扣题目', '答案或作文要回到题眼、中心和题目要求，避免写偏。');
  }
  if (/概括|主干|summarize|R1/.test(text)) {
    add('概括不完整', '概括要保留对象、事情、结果或特点，不能只摘一个细节。');
  }
  if (/数据|图表|材料|非连续|R4/.test(text)) {
    add('缺少材料数据', '非连续文本要引用数字、比例或材料关键词再下结论。');
  }

  if (!tags.length) {
    add('少了得分层', '对照满分表达，找出结论、依据、分析、回扣中缺了哪一层。');
  }

  return tags.slice(0, 4);
}

function renderLowToFullComparison(analysis, source) {
  if (!analysis || !analysis.低分示例 || !analysis.满分表达) return '';
  const tags = getAnswerGapTags(analysis, source);
  return `
    <div class="answer-compare">
      <div class="answer-compare-title">低分答案 + 错因点评 + 满分答案</div>
      <div class="answer-compare-grid">
        <div class="answer-compare-panel low">
          <strong>低分答案</strong>
          <p>${escapeHTML(analysis.低分示例)}</p>
        </div>
        <div class="answer-compare-panel critique">
          <strong>错因点评</strong>
          <p>${escapeHTML(analysis.错因点评 || '这份答案方向碰到了边，但关键依据或完整表达没有写出来。')}</p>
        </div>
        <div class="answer-compare-panel high">
          <strong>满分答案</strong>
          <p>${escapeHTML(analysis.满分表达)}</p>
        </div>
      </div>
      <div class="answer-gap-tags">
        ${tags.map(tag => `
          <span title="${escapeHTML(tag.desc)}">
            <b>${escapeHTML(tag.label)}</b>
            <em>${escapeHTML(tag.desc)}</em>
          </span>
        `).join('')}
      </div>
    </div>`;
}

function renderWrongBookAnalysis(analysis, source) {
  if (!analysis) return '';
  return `
    <div class="analysis-cards">
      <div class="analysis-title">答案解析质量分级${source ? ` · ${escapeHTML(source.id || '')}` : ''}</div>
      ${renderLowToFullComparison(analysis, source)}
      ${renderAnalysisField('📌 标准答案', analysis.标准答案 || source?.答案, 'standard-card')}
      ${renderAnalysisField('🧭 解题思路', analysis.解题思路 || source?.解析, '')}
      ${renderAnalysisField('⚠️ 易错点', analysis.易错点 || [], 'mistake-card')}
      ${renderAnalysisField('🩺 错因点评', analysis.错因点评, 'low-score-card')}
      ${renderAnalysisField('👪 家长讲解话术', analysis.家长讲解话术, 'parent-card')}
      ${renderAnalysisField('📝 复练任务', analysis.复练任务, 'task-card')}
    </div>`;
}

// ==================== 错因分类系统 ====================

// 错因分类
const ERROR_CATEGORIES = {
  B1: { id: 'b1', label: '字词拼音', icon: 'B1', desc: '拼音、识字、形近字或语境运用不稳' },
  R1: { id: 'r1', label: '概括主干', icon: 'R1', desc: '概括照抄、漏人物事件结果' },
  R2: { id: 'r2', label: '原文依据', icon: 'R2', desc: '人物、原因、情感题缺少材料依据' },
  R3: { id: 'r3', label: '赏析语言', icon: 'R3', desc: '赏析或说明文语言只背术语，不联系原文' },
  R4: { id: 'r4', label: '材料数据', icon: 'R4', desc: '非连续文本没有引用材料、数字或关键词' },
  W1: { id: 'w1', label: '写话观察', icon: 'W1', desc: '写话或观察片段太短、太空' },
  W2: { id: 'w2', label: '重点段', icon: 'W2', desc: '作文重点段薄，缺少变化和认识' },
  W3: { id: 'w3', label: '审题扣题', icon: 'W3', desc: '作文题眼、中心、材料和点题不稳' },
  C1: { id: 'c1', label: '综合题型', icon: 'C1', desc: '综合题型判断慢，分层答题不清楚' },
  SHEN_TI: { id: 'shenti', label: '审题错', icon: '🔍', desc: '没看清问什么' },
  XIN_XI: { id: 'xinxi', label: '信息错', icon: '📖', desc: '没回原文找依据' },
  GAI_KUO: { id: 'gaikuo', label: '概括错', icon: '📝', desc: '太笼统或漏要点' },
  BIAO_DA: { id: 'biaoda', label: '表达错', icon: '✏️', desc: '答案不完整、不分点' },
  MO_BAN: { id: 'moban', label: '模板错', icon: '📋', desc: '套话多，没结合文本' }
};

// 错因码到训练包的映射数据（从 error-mapping.json 加载）
let errorMappingData = null;

// 加载错因映射数据
function loadErrorMapping() {
  return fetch('data/error-mapping.json')
    .then(response => response.json())
    .then(data => {
      errorMappingData = data;
      return data;
    })
    .catch(err => {
      console.warn('Failed to load error mapping:', err);
      return null;
    });
}

// 根据错因码获取训练建议
function getTrainingRecommendation(errorCode) {
  if (!errorMappingData || !errorMappingData.errorCodes) {
    return null;
  }
  // 尝试多种格式匹配
  const code = String(errorCode || '').toUpperCase().trim();
  return errorMappingData.errorCodes[code] || 
         errorMappingData.errorCodes[code.replace('-', '_')] || 
         errorMappingData.errorCodes[code.toLowerCase()] || null;
}

// 根据能力点获取推荐练习
function getExercisesBySkill(skillName) {
  if (!errorMappingData || !errorMappingData.skillRecommendations) {
    return [];
  }
  return errorMappingData.skillRecommendations[skillName] || [];
}

// 根据错因码获取推荐练习列表
function getRecommendedExercises(errorCode) {
  const recommendation = getTrainingRecommendation(errorCode);
  return recommendation ? recommendation.recommendedExercises || [] : [];
}

function normalizeErrorCategoryId(categoryId) {
  const id = String(categoryId || '').trim().toLowerCase();
  const aliasMap = {
    xinxii: 'xinxi',
    b1: 'b1',
    r1: 'r1',
    r2: 'r2',
    r3: 'r3',
    r4: 'r4',
    w1: 'w1',
    w2: 'w2',
    w3: 'w3',
    c1: 'c1'
  };
  return aliasMap[id] || id;
}

function getErrorCategory(categoryId) {
  const normalizedId = normalizeErrorCategoryId(categoryId);
  return Object.values(ERROR_CATEGORIES).find(cat => cat.id === normalizedId);
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

// 保存错因
function saveErrorCategory(wrongIndex, categoryId) {
  const wrongList = getWrongAnswers();
  if (wrongIndex >= 0 && wrongIndex < wrongList.length) {
    wrongList[wrongIndex].errorCategory = normalizeErrorCategoryId(categoryId);
    safeSet('wrongAnswers', wrongList);
    renderWrongList();
  }
}

// 保存复盘填写内容
function saveReviewField(wrongIndex, field, value) {
  const wrongList = getWrongAnswers();
  if (wrongIndex >= 0 && wrongIndex < wrongList.length) {
    wrongList[wrongIndex].review = {
      ...(wrongList[wrongIndex].review || {}),
      [field]: value
    };
    safeSet('wrongAnswers', wrongList);
  }
}

// 保存重做答案
function saveRetryAnswer(wrongIndex, value) {
  const wrongList = getWrongAnswers();
  if (wrongIndex >= 0 && wrongIndex < wrongList.length) {
    wrongList[wrongIndex].retryAnswer = value;
    safeSet('wrongAnswers', wrongList);
  }
}

// 获取错因统计
function getErrorCategoryStats() {
  const wrongList = getWrongAnswers();
  const stats = {};
  Object.values(ERROR_CATEGORIES).forEach(cat => {
    stats[cat.id] = 0;
  });
  stats['other'] = 0;
  
  wrongList.forEach(item => {
    const cat = normalizeErrorCategoryId(item.errorCategory);
    if (cat && stats[cat] !== undefined) {
      stats[cat]++;
    } else {
      stats['other']++;
    }
  });
  
  return stats;
}

// ==================== 复盘模板 ====================

// 生成复盘建议
function generateReviewAdvice(wrongItem) {
  const cat = normalizeErrorCategoryId(wrongItem.errorCategory);
  let advice = '';
  
  switch(cat) {
    case 'shenti':
      advice = '下次做题先圈题目关键词，问什么再答什么，不答非所问。';
      break;
    case 'b1':
      advice = '回到 B1 训练包，先看字音、偏旁和语境，再组词说句。';
      break;
    case 'r1':
      advice = '回到 R1 训练包，按“谁 + 做什么 + 结果”删细节、留主干。';
      break;
    case 'r2':
      advice = '回到 R2 训练包，先圈原文证据，再写特点、原因或情感。';
      break;
    case 'r3':
      advice = '回到 R3 训练包，答案必须包含词义或方法、对象特点和表达效果。';
      break;
    case 'r4':
      advice = '回到 R4 训练包，答案里必须出现材料数字、编号或关键词。';
      break;
    case 'w1':
      advice = '回到 W1 训练包，把句子补出时间、地点、动作、变化和心情。';
      break;
    case 'w2':
      advice = '回到 W2 训练包，放大关键一幕，写出动作、心理和认识提升。';
      break;
    case 'w3':
      advice = '回到 W3 训练包，先圈题眼，再定中心、重点段和点题结尾。';
      break;
    case 'c1':
      advice = '回到 C1 训练包，先判断题型，再按分值分层组织答案。';
      break;
    case 'xinxi':
      advice = '答案必须回原文找依据，不能凭感觉写。找到原文句子，把关键词抄下来。';
      break;
    case 'gaikuo':
      advice = '概括要包含"谁+做什么+结果/感受"，不能只说一两个词。写完检查是否全面。';
      break;
    case 'biaoda':
      advice = '用"①②③"分点作答，每点先写结论再写依据。写完读一遍看看通不通顺。';
      break;
    case 'moban':
      advice = '模板是框架，必须填入原文具体内容。每句模板后面都要跟上文中对应的例子。';
      break;
    default:
      advice = '先分析错因，找出是哪个环节出了问题，再针对性地练。';
  }
  
  return advice;
}

// 获取复盘数据 (为导出/展示用)
function getReviewData() {
  const wrongList = getWrongAnswers();
  return wrongList.map((item, index) => ({
    index: index,
    question: item.question,
    userAnswer: item.userAnswer,
    correctAnswer: item.correctAnswer,
    tip: item.tip,
    category: normalizeErrorCategoryId(item.errorCategory) || '未分类',
    review: item.review || {},
    reviewAdvice: generateReviewAdvice(item),
    timestamp: item.timestamp
  }));
}

// 当前筛选类型
let currentFilter = 'all';

function renderWrongList() {
  requestWrongBookAnalysisRefresh();
  const wrongList = getWrongAnswers();
  const container = document.getElementById('wrongList');
  const analysisDiv = document.getElementById('wrongAnalysis');
  const filterDiv = document.getElementById('wrongFilter');
  
  if (wrongList.length === 0) {
    container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">暂无错题，继续加油！</p>';
    analysisDiv.style.display = 'none';
    filterDiv.style.display = 'none';
    renderErrorStats();
    renderAutoRoutingPanel();
    return;
  }
  
  // 显示分析和筛选
  analysisDiv.style.display = 'block';
  filterDiv.style.display = 'block';
  
  // 按类型统计错题
  const typeStats = {};
  wrongList.forEach(item => {
    const type = item.type || '其他';
    typeStats[type] = (typeStats[type] || 0) + 1;
  });
  
  // 生成统计数据
  const statsDiv = document.getElementById('wrongStats');
  let statsHTML = '';
  for (const [type, count] of Object.entries(typeStats)) {
    statsHTML += `
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
        <div style="font-size: 24px; font-weight: bold; color: #667eea;">${count}</div>
        <div style="font-size: 14px; color: #666;">${type}</div>
      </div>
    `;
  }
  statsDiv.innerHTML = statsHTML;
  
  // 生成复习建议
  const suggestionsDiv = document.getElementById('wrongSuggestions');
  let suggestionsHTML = '<strong>💡 复习建议：</strong><ul style="margin: 10px 0 0 20px;">';
  for (const [type, count] of Object.entries(typeStats)) {
    if (count >= 3) {
      suggestionsHTML += `<li>你在${type}方面错题较多，建议重点复习这部分内容。</li>`;
    }
  }
  suggestionsHTML += '<li>定期回顾错题，巩固薄弱知识点。</li>';
  suggestionsHTML += '</ul>';
  suggestionsDiv.innerHTML = suggestionsHTML;
  
  // 生成筛选按钮
  const filterButtonsDiv = document.getElementById('filterButtons');
  let filterButtonsHTML = '';
  for (const type of Object.keys(typeStats)) {
    filterButtonsHTML += '<button class="filter-btn" data-type="' + type + '" style="padding:8px 16px;margin-right:8px;border:1px solid #667eea;background:white;color:#667eea;border-radius:20px;cursor:pointer;">' + type + '</button>';
  }
  filterButtonsDiv.innerHTML = filterButtonsHTML;
  
  // 根据筛选显示错题
  let filteredList = wrongList;
  if (currentFilter !== 'all') {
    filteredList = wrongList.filter(item => item.type === currentFilter);
  }
  
  container.innerHTML = filteredList.map((item, index) => {
    const realIndex = wrongList.indexOf(item);
    const cat = normalizeErrorCategoryId(item.errorCategory || '');
    const category = getErrorCategory(cat);
    const advice = generateReviewAdvice(item);
    const review = item.review || {};
    
    // 获取解析分级数据
    const analysisSource = getAnalysisSourceForWrongItem(item);
    const analysis = analysisSource?.解析分级 || null;
    
    // 错因分类选择器
    const categoryOptions = Object.values(ERROR_CATEGORIES).map(c => 
      `<button class="error-cat-btn ${cat === c.id ? 'active' : ''}" 
               onclick="saveErrorCategory(${realIndex}, '${c.id}')"
               title="${c.desc}">${c.icon} ${c.label}</button>`
    ).join('');

    const answerHTML = item.retryMode ? '' : `
      <div class="wrong-answer">我的答案：${escapeHTML(item.userAnswer)}</div>
      <div class="correct-answer">正确答案：${escapeHTML(item.correctAnswer)}</div>
      ${item.tip ? `<div class="wrong-tip">提示：${escapeHTML(item.tip)}</div>` : ''}`;
    
    // 解析分级卡片
    const analysisHTML = renderWrongBookAnalysis(analysis, analysisSource);
    const similarHTML = renderSimilarExerciseRecommendations(item, analysisSource);

    const retryHTML = item.retryMode ? `
      <div class="retry-panel">
        <div class="retry-title">重新作答</div>
        <textarea class="review-input retry-textarea" rows="3" placeholder="先不看答案，重新写一遍你的答案。" oninput="saveRetryAnswer(${realIndex}, this.value)">${escapeHTML(item.retryAnswer || '')}</textarea>
        <div class="retry-actions">
          <button class="retry-btn" onclick="revealRetryAnswer(${realIndex})">查看答案</button>
          <button class="retry-btn secondary" onclick="cancelRetry(${realIndex})">取消重做</button>
        </div>
        ${item.retryRevealed ? `
        <div class="answer-reveal">
          <div><strong>原来的答案：</strong>${escapeHTML(item.userAnswer)}</div>
          <div><strong>正确答案：</strong>${escapeHTML(item.correctAnswer)}</div>
          ${item.tip ? `<div><strong>提示：</strong>${escapeHTML(item.tip)}</div>` : ''}
        </div>` : ''}
      </div>` : '';
    
    // 掌握状态
    var mastery = getMasteryLabel(item.mastery || 'new');
    var reviewInfo = '';
    if (item.nextReview) {
      var nextDate = new Date(item.nextReview);
      var nowDate = new Date();
      var daysLeft = daysBetween(nowDate.toISOString(), nextDate.toISOString());
      if (daysLeft <= 0) {
        reviewInfo = '<span style="color:#ef4444; font-size:11px;">🔔 该复习了！已超期 ' + Math.abs(daysLeft) + ' 天</span>';
      } else if (daysLeft <= 1) {
        reviewInfo = '<span style="color:#f59e0b; font-size:11px;">⏰ ' + daysLeft + ' 天后复习</span>';
      } else {
        reviewInfo = '<span style="color:#888; font-size:11px;">📅 ' + daysLeft + ' 天后复习</span>';
      }
      if (item.reviewCount > 0) {
        reviewInfo += ' <span style="color:#888;">· 复习 ' + item.reviewCount + ' 次</span>';
      }
    }

    return `
    <div class="wrong-item">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="mastery-badge" style="display:inline-block;padding:2px 10px;border-radius:10px;font-size:11px;background:${mastery.color}20;color:${mastery.color};font-weight:600;">${mastery.label}</span>
        <span style="font-size:11px;color:#888;">${new Date(item.timestamp).toLocaleDateString('zh-CN')} · ${reviewInfo}</span>
      </div>
      <div class="wrong-question">${index + 1}. ${escapeHTML(item.question)}</div>
      ${answerHTML}
      ${retryHTML}
      ${analysisHTML}
      ${similarHTML}
      <div class="error-category-select">
        <div style="font-size:12px;color:#888;margin-bottom:6px;">分析错因（点击选择）：</div>
        <div class="error-cat-btns">${categoryOptions}</div>
      </div>
      ${cat ? `
      <div class="review-box">
        <strong>📝 复盘建议：</strong>
        <p>我错在：<strong>${category?.label || '其他'}</strong>。</p>
        <div class="review-field">
          <label>原文依据是：</label>
          <textarea class="review-input" rows="2" placeholder="写出最能证明答案的原文词句。" oninput="saveReviewField(${realIndex}, 'evidence', this.value)">${escapeHTML(review.evidence || '')}</textarea>
        </div>
        <div class="review-field">
          <label>正确答法应包含：</label>
          <textarea class="review-input" rows="2" placeholder="例如：结论 + 依据 + 分析。" oninput="saveReviewField(${realIndex}, 'answerPoints', this.value)">${escapeHTML(review.answerPoints || '')}</textarea>
        </div>
        <p>下次遇到同类题，我先做：${advice}</p>
      </div>` : ''}
      ${cat ? `
      <div class="training-recommendation" data-error-code="${cat}">
        <strong>🎯 针对性训练建议：</strong>
        <div class="training-content" id="training-${realIndex}">
          <div style="color:#666;font-size:13px;padding:8px 0;">加载中...</div>
        </div>
      </div>` : ''}
      <div style="margin-top: 10px; display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
        ${item.retryMode ? '' : `<button class="retry-btn" onclick="retryWrong(${realIndex})">再练一次</button>`}
        <button class="retry-btn" onclick="markWrongItemReviewed(${realIndex}, false)" style="background:#8b5cf6;">已复习</button>
        <button class="retry-btn" onclick="markWrongItemReviewed(${realIndex}, true)" style="background:#10b981;">已掌握</button>
        <button class="retry-btn" onclick="removeWrong(${realIndex})" style="background:#f44336; margin-left:auto;">移除</button>
      </div>
    </div>`;
  }).join('');
  renderErrorStats();
  renderAutoRoutingPanel();
  
  // 加载错因映射并渲染训练建议
  loadErrorMapping().then(() => {
    renderTrainingRecommendations();
  });
}

// 渲染训练建议
function renderTrainingRecommendations() {
  const wrongList = getWrongAnswers();
  wrongList.forEach((item, index) => {
    if (!item.errorCategory) return;
    
    const recommendation = getTrainingRecommendation(item.errorCategory);
    const container = document.getElementById(`training-${index}`);
    if (!container || !recommendation) return;
    
    let html = '<div style="margin-top:8px;">';
    
    // 学习路径
    if (recommendation.learningPath && recommendation.learningPath.length > 0) {
      html += `
        <div style="margin-bottom:12px;">
          <div style="font-size:12px;font-weight:600;color:#667eea;margin-bottom:4px;">📚 学习路径</div>
          <ol style="margin:0;padding-left:20px;font-size:13px;color:#555;">
            ${recommendation.learningPath.map(p => `<li>${escapeHTML(p)}</li>`).join('')}
          </ol>
        </div>`;
    }
    
    // 教学建议
    if (recommendation.teachingTips && recommendation.teachingTips.length > 0) {
      html += `
        <div style="margin-bottom:12px;">
          <div style="font-size:12px;font-weight:600;color:#f59e0b;margin-bottom:4px;">💡 家长指导</div>
          <ul style="margin:0;padding-left:20px;font-size:13px;color:#555;">
            ${recommendation.teachingTips.map(t => `<li>${escapeHTML(t)}</li>`).join('')}
          </ul>
        </div>`;
    }
    
    // 推荐练习
    if (recommendation.recommendedExercises && recommendation.recommendedExercises.length > 0) {
      html += `
        <div>
          <div style="font-size:12px;font-weight:600;color:#10b981;margin-bottom:4px;">🎯 推荐练习</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">
            ${recommendation.recommendedExercises.map(id => 
              `<span style="padding:3px 10px;background:#ecfdf5;color:#059669;border-radius:12px;font-size:11px;">${escapeHTML(id)}</span>`
            ).join('')}
          </div>
        </div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
  });
}

// 渲染错因统计
function renderErrorStats() {
  const stats = getErrorCategoryStats();
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  
  const container = document.getElementById('errorStatsVisual');
  if (!container) return;
  
  if (total === 0) {
    container.innerHTML = '<p style="color:#888;text-align:center;">暂无错因数据，标记错题后会自动生成分析。</p>';
    return;
  }
  
  let html = '<div class="error-stats-grid">';
  
  // 生成每个错因的统计卡片
  Object.values(ERROR_CATEGORIES).forEach(cat => {
    const count = stats[cat.id] || 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    html += `
      <div class="error-stat-card">
        <div class="error-stat-icon">${cat.icon}</div>
        <div class="error-stat-count">${count}</div>
        <div class="error-stat-label">${cat.label}</div>
        <div class="error-stat-bar"><div class="error-stat-fill" style="width:${pct}%"></div></div>
        <div class="error-stat-pct">${pct}%</div>
        <div class="error-stat-desc">${cat.desc}</div>
      </div>`;
  });
  
  html += '</div>';
  
  // 生成排序后的改善建议
  const sorted = Object.values(ERROR_CATEGORIES)
    .map(cat => ({ ...cat, count: stats[cat.id] || 0 }))
    .sort((a, b) => b.count - a.count);
  
  if (sorted[0].count > 0) {
    html += `<div class="error-top-advice">
      <strong>🎯 当前最需要改善：</strong> ${sorted[0].icon} ${sorted[0].label}（${sorted[0].count}次）<br>
      <span style="color:#666;font-size:13px;">${sorted[0].desc}。${sorted[0].id === 'shenti' ? '每次做题先用笔圈出关键词。' : 
        sorted[0].id === 'xinxi' ? '答案必须回原文找依据，找到后划线标记。' :
        sorted[0].id === 'gaikuo' ? '写完后检查：谁+做什么+结果都写了吗？' :
        sorted[0].id === 'biaoda' ? '用①②③分点，每点先写结论。' :
        '模板后必须跟原文例句。'}</span>
    </div>`;
  }
  
  container.innerHTML = html;
}

function formatReviewDate(timestamp, offsetDays) {
  const base = timestamp ? new Date(timestamp) : new Date();
  if (Number.isNaN(base.getTime())) return '待生成';
  base.setDate(base.getDate() + offsetDays);
  return `${base.getMonth() + 1}月${base.getDate()}日`;
}

function getAutoRoutingLabel(wrongList) {
  const total = wrongList.length;
  const stats = getErrorCategoryStats();
  const sorted = Object.values(ERROR_CATEGORIES)
    .map(cat => ({ ...cat, count: stats[cat.id] || 0 }))
    .sort((a, b) => b.count - a.count);
  const top = sorted.find(item => item.count > 0);

  if (!total) {
    return {
      level: '等待A卷诊断',
      issue: '暂无错题数据',
      action: '先完成15分钟诊断，系统会自动生成错因码和下一课路径。'
    };
  }

  if (total >= 6) {
    return {
      level: '基础达标',
      issue: top ? `${top.icon} ${top.label}` : '基础薄弱点',
      action: '先不要混刷题，集中完成最高频错因训练包，再做B卷复测。'
    };
  }

  if (total >= 3) {
    return {
      level: '提优提升',
      issue: top ? `${top.icon} ${top.label}` : '答案完整度',
      action: '重点补“依据 + 分析 + 完整表达”，同类变式通过后进入C卷。'
    };
  }

  return {
    level: '拔尖迁移',
    issue: top ? `${top.icon} ${top.label}` : '迁移稳定性',
    action: '错题较少，建议直接做C1/C2混合迁移，看能否换材料稳定使用方法。'
  };
}

function renderAutoRoutingPanel() {
  const routePanel = document.getElementById('autoRoutingSummary');
  const reviewPanel = document.getElementById('reviewScheduleSummary');
  if (!routePanel && !reviewPanel) return;

  const wrongList = getWrongAnswers();
  const route = getAutoRoutingLabel(wrongList);

  if (routePanel) {
    routePanel.innerHTML = `
      <p><strong>当前路径：</strong>${route.level}</p>
      <p><strong>主攻问题：</strong>${route.issue}</p>
      <p><strong>下一步：</strong>${route.action}</p>
    `;
  }

  if (reviewPanel) {
    if (!wrongList.length) {
      reviewPanel.innerHTML = `
        <p><strong>复习提醒：</strong>暂无错题。</p>
        <p>完成诊断或互动练习后，错题会自动进入这里，并生成3天/7天复习节奏。</p>
      `;
      return;
    }

    const latest = wrongList[wrongList.length - 1];
    const unfinished = wrongList.filter(item => !item.mastered).length;
    reviewPanel.innerHTML = `
      <p><strong>未完全掌握：</strong>${unfinished}题</p>
      <p><strong>3天后复练：</strong>${formatReviewDate(latest.timestamp, 3)}</p>
      <p><strong>7天后复测：</strong>${formatReviewDate(latest.timestamp, 7)}</p>
      <p><strong>考前策略：</strong>优先练未完全掌握题，再做同类变式迁移。</p>
    `;
  }
}

// 筛选错题
function filterWrong(type, clickedEl) {
  currentFilter = type;
  
  // 更新按钮状态
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.classList.remove('active');
    btn.style.background = 'white';
    btn.style.color = '#667eea';
  });
  
  if (clickedEl) {
    clickedEl.classList.add('active');
    clickedEl.style.background = '#667eea';
    clickedEl.style.color = 'white';
  }
  
  renderWrongList();
}

// 事件委托：错题筛选按钮
document.getElementById('filterButtons').addEventListener('click', function(e) {
  var btn = e.target.closest('.filter-btn');
  if (!btn || !btn.dataset.type) return;
  filterWrong(btn.dataset.type, btn);
});

// 移除错题
function removeWrong(index) {
  const wrongList = getWrongAnswers();
  wrongList.splice(index, 1);
  localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
  renderWrongList();
  renderAutoRoutingPanel();
}

function retryWrong(index) {
  const wrongList = getWrongAnswers();
  if (index >= 0 && index < wrongList.length) {
    wrongList[index].retryMode = true;
    wrongList[index].retryRevealed = false;
    wrongList[index].retryAnswer = '';
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongList));
    renderWrongList();
  }
}

function revealRetryAnswer(index) {
  const wrongList = getWrongAnswers();
  if (index >= 0 && index < wrongList.length) {
    wrongList[index].retryRevealed = true;
    safeSet('wrongAnswers', wrongList);
    renderWrongList();
  }
}

function cancelRetry(index) {
  const wrongList = getWrongAnswers();
  if (index >= 0 && index < wrongList.length) {
    wrongList[index].retryMode = false;
    wrongList[index].retryRevealed = false;
    wrongList[index].retryAnswer = '';
    safeSet('wrongAnswers', wrongList);
    renderWrongList();
  }
}

// 模式切换
function initModeSwitch() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.mode) {
        document.querySelectorAll('.sentence-transform, .rhetoric-card, .poem-card, .thinking-card').forEach(el => {
          el.style.display = 'none';
        });
        document.getElementById(btn.dataset.mode + 'Practice').style.display = 'block';
        document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        hasInitializedInteractivePractice = true;
        initPracticeMode(btn.dataset.mode);
      } else if (btn.dataset.level) {
        currentLevel = btn.dataset.level;
        document.querySelectorAll('[data-level]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        saveProgress();
        if (hasInitializedInteractivePractice) {
          const activeMode = getActivePracticeMode();
          if (activeMode === 'reading' || activeMode === 'vocabulary') {
            initPracticeMode(activeMode);
          }
        }
      }
    });
  });
}

// 句式转换练习
async function initTransform() {
  const question = document.getElementById('transformQuestion');
  const sentence = document.getElementById('transformSentence');
  const options = document.getElementById('transformOptions');
  
  if (!question || !sentence || !options) {
    return;
  }

  if (!Array.isArray(transformData)) {
    renderTransformState('句式转换加载中...', '正在准备题目，请稍候。', '题目加载中，请稍候。');
  }

  const dataset = await ensureTransformData();
  if (!Array.isArray(dataset) || dataset.length === 0) {
    renderTransformState('句式转换暂时不可用', '题目加载失败，请稍后重试。', '暂时无法加载题目。');
    return;
  }

  currentTransform = currentTransform % dataset.length;
  const data = dataset[currentTransform];
  question.textContent = `把下面的句子改写成"${data.type}"`;
  sentence.textContent = data.sentence;
  
  options.innerHTML = '';
  data.options.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'transform-btn';
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('click', () => checkTransform(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkTransform(i);
      }
    });
    options.appendChild(btn);
  });
}

function checkTransform(index) {
  if (!Array.isArray(transformData) || transformData.length === 0) {
    return;
  }

  const data = transformData[currentTransform % transformData.length];
  const options = document.querySelectorAll('#transformOptions .transform-btn');
  
  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    opt.setAttribute('tabindex', '-1');
    if (i === data.answer) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.classList.add('wrong');
    }
  });
  
  if (index === data.answer) {
    correctCount++;
    saveProgress();
    showFeedback(true, '');
  } else {
    saveWrongAnswer('句式转换', data.sentence, data.options[index], data.options[data.answer], '');
    showFeedback(false, '');
  }
  
  setTimeout(nextTransform, 2000);
}

function nextTransform() {
  if (!Array.isArray(transformData) || transformData.length === 0) {
    initTransform();
    return;
  }

  currentTransform = (currentTransform + 1) % transformData.length;
  initTransform();
}

// 修辞判断练习
async function initRhetoric() {
  const sentence = document.getElementById('rhetoricSentence');
  const options = document.getElementById('rhetoricOptions');

  if (!sentence || !options) {
    return;
  }

  if (!Array.isArray(rhetoricData)) {
    renderRhetoricState('修辞判断加载中...', '题目加载中，请稍候。');
  }

  const dataset = await ensureRhetoricData();
  if (!Array.isArray(dataset) || dataset.length === 0) {
    renderRhetoricState('修辞判断暂时不可用', '暂时无法加载题目。');
    return;
  }

  currentRhetoric = currentRhetoric % dataset.length;
  const data = dataset[currentRhetoric];
  sentence.textContent = data.sentence;
  
  options.innerHTML = '';
  data.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'rhetoric-btn';
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('click', () => checkRhetoric(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkRhetoric(i);
      }
    });
    options.appendChild(btn);
  });
}

function checkRhetoric(index) {
  if (!Array.isArray(rhetoricData) || rhetoricData.length === 0) {
    return;
  }

  const data = rhetoricData[currentRhetoric % rhetoricData.length];
  const options = document.querySelectorAll('#rhetoricOptions .rhetoric-btn');
  
  options.forEach((opt, i) => {
    opt.disabled = true;
    opt.setAttribute('tabindex', '-1');
    if (i === data.options.indexOf(data.answer)) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.style.background = '#f44336';
      opt.style.color = 'white';
      opt.style.borderColor = '#f44336';
    }
  });
  
  if (index === data.options.indexOf(data.answer)) {
    correctCount++;
    saveProgress();
    showFeedback(true, data.tip || '');
  } else {
    showFeedback(false, data.tip || '');
  }
  
  setTimeout(nextRhetoric, 2500);
}

function nextRhetoric() {
  if (!Array.isArray(rhetoricData) || rhetoricData.length === 0) {
    initRhetoric();
    return;
  }

  currentRhetoric = (currentRhetoric + 1) % rhetoricData.length;
  initRhetoric();
}

// 古诗填空练习
async function initPoem() {
  const title = document.getElementById('poemTitle');
  const text = document.getElementById('poemText');

  if (!title || !text) {
    return;
  }

  if (!Array.isArray(poemData)) {
    renderPoemState('古诗填空加载中...', '<p style="margin:0;color:#64748b;">正在准备题目，请稍候。</p>');
  }

  const dataset = await ensurePoemData();
  if (!Array.isArray(dataset) || dataset.length === 0) {
    renderPoemState('古诗填空暂时不可用', '<p style="margin:0;color:#64748b;">暂时无法加载题目。</p>');
    return;
  }

  currentPoem = currentPoem % dataset.length;
  const data = dataset[currentPoem];
  title.textContent = data.title;
  text.innerHTML = data.text;
}

function checkPoem() {
  if (!Array.isArray(poemData) || poemData.length === 0) {
    return;
  }

  const inputs = document.querySelectorAll('#poemText input');
  const data = poemData[currentPoem % poemData.length];
  let allCorrect = true;
  
  inputs.forEach((input, i) => {
    if (input.value.trim() === data.answers[i]) {
      input.style.borderColor = '#4caf50';
      input.style.background = '#e8f5e9';
    } else {
      input.style.borderColor = '#f44336';
      input.style.background = '#ffebee';
      allCorrect = false;
    }
  });
  
  if (allCorrect) {
    correctCount++;
    saveProgress();
  }
  setTimeout(nextPoem, 2000);
}

function nextPoem() {
  if (!Array.isArray(poemData) || poemData.length === 0) {
    initPoem();
    return;
  }

  currentPoem = (currentPoem + 1) % poemData.length;
  initPoem();
}

// 阅读练习
async function initReading() {
  const text = document.getElementById('readingText');
  const question = document.getElementById('readingQuestion');
  const options = document.getElementById('readingOptions');
  
  if (!text || !question || !options) {
    return;
  }

  if (!Array.isArray(readingData)) {
    renderReadingState('阅读理解加载中...', '正在准备题目，请稍候。', '题目加载中，请稍候。');
  }

  const dataset = await ensureReadingData();
  if (!Array.isArray(dataset) || dataset.length === 0) {
    renderReadingState('阅读理解暂时不可用', '题目加载失败，请稍后重试。', '暂时无法加载题目。');
    return;
  }

  const filteredData = getReadingItemsForCurrentLevel();
  if (filteredData.length === 0) {
    renderReadingState('当前难度暂无题目', '请切换难度后再试。', '暂时没有可练习的内容。');
    return;
  }
  const data = filteredData[currentReading % filteredData.length];
  
  text.textContent = data.text;
  question.textContent = data.question;
  
  options.innerHTML = '';
  data.options.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'transform-btn';
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('click', () => checkReading(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkReading(i);
      }
    });
    options.appendChild(btn);
  });
}

function checkReading(index) {
  const filteredData = getReadingItemsForCurrentLevel();
  if (filteredData.length === 0) {
    return;
  }
  const data = filteredData[currentReading % filteredData.length];
  const options = document.querySelectorAll('#readingOptions .transform-btn');
  
  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    opt.setAttribute('tabindex', '-1');
    if (i === data.answer) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.classList.add('wrong');
    }
  });
  
  if (index === data.answer) {
    correctCount++;
    saveProgress();
    showFeedback(true, '');
  } else {
    saveWrongAnswer('阅读理解', data.question, data.options[index], data.options[data.answer], '');
    showFeedback(false, '', data.options[data.answer]);
  }
  
  setTimeout(nextReading, 2500);
}

function nextReading() {
  currentReading++;
  initReading();
}

// 词语选择练习
async function initVocab() {
  const sentence = document.getElementById('vocabSentence');
  const options = document.getElementById('vocabOptions');

  if (!sentence || !options) {
    return;
  }

  if (!Array.isArray(vocabData)) {
    renderVocabState('词语选择加载中...', '题目加载中，请稍候。');
  }

  const dataset = await ensureVocabData();
  if (!Array.isArray(dataset) || dataset.length === 0) {
    renderVocabState('词语选择暂时不可用', '暂时无法加载题目。');
    return;
  }

  const filteredData = getVocabItemsForCurrentLevel();
  if (filteredData.length === 0) {
    renderVocabState('当前难度暂无题目', '请切换难度后再试。');
    return;
  }
  const data = filteredData[currentVocab % filteredData.length];
  
  sentence.textContent = data.sentence;
  
  options.innerHTML = '';
  data.options.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'transform-btn';
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('click', () => checkVocab(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkVocab(i);
      }
    });
    options.appendChild(btn);
  });
}

function checkVocab(index) {
  const filteredData = getVocabItemsForCurrentLevel();
  if (filteredData.length === 0) {
    return;
  }
  const data = filteredData[currentVocab % filteredData.length];
  const options = document.querySelectorAll('#vocabOptions .transform-btn');
  
  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    opt.setAttribute('tabindex', '-1');
    if (i === data.answer) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.classList.add('wrong');
    }
  });
  
  if (index === data.answer) {
    correctCount++;
    saveProgress();
    showFeedback(true, '');
  } else {
    showFeedback(false, '');
  }
  
  setTimeout(nextVocab, 2000);
}

function nextVocab() {
  if (!Array.isArray(vocabData) || vocabData.length === 0) {
    initVocab();
    return;
  }

  currentVocab++;
  initVocab();
}

// 思维进阶练习
async function initThinking() {
  const badge = document.getElementById('thinkingBadge');
  const content = document.getElementById('thinkingContent');
  const explanation = document.getElementById('thinkingExplanation');
  const nextBtn = document.getElementById('thinkingNextBtn');

  if (!badge || !content || !explanation || !nextBtn) {
    return;
  }

  explanation.style.display = 'none';
  nextBtn.style.display = 'none';

  if (!Array.isArray(thinkingData)) {
    renderThinkingState('思维进阶加载中...', '<p style="margin:0;color:#64748b;">正在准备题目，请稍候。</p>');
  }

  const dataset = await ensureThinkingData();
  if (!Array.isArray(dataset) || dataset.length === 0) {
    renderThinkingState('思维进阶暂时不可用', '<p style="margin:0;color:#64748b;">暂时无法加载题目。</p>');
    return;
  }

  currentThinking = currentThinking % dataset.length;
  const data = dataset[currentThinking];

  badge.textContent = data.badge;
  badge.className = 'thinking-badge ' + data.type;

  let html = '';

  if (data.type === 'upgrade') {
    html += '<div class="thinking-question" style="font-size:16px;margin-top:0;">' + data.title + '</div>';
    html += '<div class="compare-row">';
    html += '  <div class="compare-box low">';
    html += '    <div class="compare-label low">✏️ 原句</div>';
    html += '    <div class="compare-content">' + data.original + '</div>';
    html += '  </div>';
    html += '  <div class="compare-box high">';
    html += '    <div class="compare-label high">✨ 润色后</div>';
    html += '    <div class="compare-content">' + data.improved + '</div>';
    html += '  </div>';
    html += '</div>';
  } else if (data.type === 'compare') {
    html += '<div class="thinking-question" style="font-size:16px;margin-top:0;">' + data.title + '</div>';
    html += '<div class="compare-row">';
    html += '  <div class="compare-box low">';
    html += '    <div class="compare-label low">📉 低分答案</div>';
    html += '    <div class="compare-content">' + data.compareLow + '</div>';
    html += '  </div>';
    html += '  <div class="compare-box high">';
    html += '    <div class="compare-label high">📈 满分答案</div>';
    html += '    <div class="compare-content">' + data.compareHigh + '</div>';
    html += '  </div>';
    html += '</div>';
  } else if (data.type === 'analyze') {
    html += '<div class="thinking-question" style="font-size:16px;margin-top:0;">' + data.title + '</div>';
    html += '<div class="rhetoric-sentence" style="border-left-color:#7b1fa2;background:#f3e5f5;">' + data.sentence + '</div>';
  }

  html += '<div class="thinking-question">' + data.question + '</div>';
  html += '<div class="thinking-options" id="thinkingOptions"></div>';

  content.innerHTML = html;

  const optionsContainer = document.getElementById('thinkingOptions');
  data.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'thinking-opt';
    div.textContent = String.fromCharCode(65 + i) + '. ' + opt.text;
    div.dataset.index = i;
    div.setAttribute('tabindex', '0');
    div.addEventListener('click', () => checkThinking(i));
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        checkThinking(i);
      }
    });
    optionsContainer.appendChild(div);
  });
}

function checkThinking(index) {
  if (!Array.isArray(thinkingData) || thinkingData.length === 0) {
    return;
  }

  const data = thinkingData[currentThinking % thinkingData.length];
  const options = document.querySelectorAll('#thinkingOptions .thinking-opt');

  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    opt.setAttribute('tabindex', '-1');
    if (data.options[i].correct) {
      opt.classList.add('correct');
    } else if (i === index) {
      opt.classList.add('wrong');
    }
  });

  const explanation = document.getElementById('thinkingExplanation');
  explanation.innerHTML = '<strong>💡 解析：</strong>' + data.explanation;
  explanation.style.display = 'block';

  document.getElementById('thinkingNextBtn').style.display = 'block';

  if (data.options[index].correct) {
    correctCount++;
    saveProgress();
    showFeedback(true, '');
  } else {
    saveWrongAnswer('思维进阶', data.question || data.title, data.options[index].text, data.options.find(o => o.correct).text, '');
    showFeedback(false, '');
  }
}

function nextThinking() {
  if (!Array.isArray(thinkingData) || thinkingData.length === 0) {
    initThinking();
    return;
  }

  currentThinking++;
  initThinking();
}

// 打卡功能
function initCheckin() {
  const btn = document.getElementById('checkinBtn');
  const today = document.querySelector('.checkin-day.today');
  
  // 检查今日是否已打卡
  const lastCheckin = localStorage.getItem('lastCheckin');
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (lastCheckin === todayStr) {
    btn.disabled = true;
    btn.textContent = '已打卡';
    if (today) today.classList.add('checked');
    return;
  }
  
  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = '已打卡';
    
    if (today) today.classList.add('checked');
    safeSet('lastCheckin', todayStr);
    
    // 更新连续打卡天数
    let streak = parseInt(localStorage.getItem('checkinStreak') || '0');
    streak++;
    safeSet('checkinStreak', streak.toString());
    
    // 显示奖励
    document.getElementById('rewardText').textContent = streak >= 5 
      ? `太棒了！你已经连续打卡${streak}天了！`
      : `今天是你连续打卡的第${streak}天！继续加油！`;
    document.getElementById('rewardModal').classList.add('show');
  });
}

function closeReward() {
  document.getElementById('rewardModal').classList.remove('show');
}

// 答题反馈函数
function showFeedback(isCorrect, tip, correctAnswer = '') {
  const feedback = document.createElement('div');
  feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
  
  if (isCorrect) {
    feedback.innerHTML = '&#10004; 回答正确！';
    if (tip) {
      feedback.innerHTML += `<br><span style="font-size: 14px;">${tip}</span>`;
    }
  } else {
    feedback.innerHTML = '&#10006; 再接再厉！';
    if (correctAnswer) {
      feedback.innerHTML += `<br><span style="font-size: 14px;">正确答案：${correctAnswer}</span>`;
    }
    if (tip) {
      feedback.innerHTML += `<br><span style="font-size: 14px;">提示：${tip}</span>`;
    }
  }
  
  document.body.appendChild(feedback);
  
  setTimeout(() => feedback.remove(), 2500);
}

// 测后分流训练包状态和 A/B 卷评分器
const FLOW_PACKS = [
  { code: 'B1', id: 'b1', title: '字词拼音', problem: '拼音、识字、形近字、词语语境不稳', href: '#pack-b1' },
  { code: 'R1', id: 'r1', title: '概括主干', problem: '概括照抄、不完整，漏人物、事件或结果', href: '#pack-r1' },
  { code: 'R2', id: 'r2', title: '原文依据', problem: '人物、原因、情感题缺少材料依据', href: '#pack-r2' },
  { code: 'R3', id: 'r3', title: '赏析语言', problem: '赏析或说明文语言只背术语，不联系原文', href: '#pack-r3' },
  { code: 'R4', id: 'r4', title: '材料数据', problem: '非连续文本没有引用材料、数字或关键词', href: '#pack-r4' },
  { code: 'W1', id: 'w1', title: '写话观察', problem: '写话或观察片段太短、太空', href: '#pack-w1' },
  { code: 'W2', id: 'w2', title: '重点段升格', problem: '作文重点段薄，缺少变化和认识', href: '#pack-w2' },
  { code: 'W3', id: 'w3', title: '审题扣题', problem: '作文题眼、中心、材料和点题不稳', href: '#pack-w3' },
  { code: 'C1', id: 'c1', title: '综合题型', problem: '综合题型判断慢，分层答题不清楚', href: '#pack-c1' }
];

const FLOW_STATUS_LABELS = {
  todo: '未开始',
  done: '已完成训练',
  retry: '需再练',
  passed: '复测已通过'
};

const FLOW_STATUS_CLASS = {
  todo: 'status-todo',
  done: 'status-done',
  retry: 'status-retry',
  passed: 'status-passed'
};

const AB_TEST_MAP = {
  1: {
    label: '一年级',
    retest: 'grade1.html#grade1-b-test',
    a: [
      { no: 1, code: 'B1', points: 3, title: '拼读 p-én、q-iú、m-āo', reason: '拼读或声调不稳', standard: 'pén、qiú、māo，声调准确。' },
      { no: 2, code: 'B1', points: 3, title: '给“花、球、猫”各组 1 个词', reason: '会认字，不会组词说句', standard: '花朵、皮球、小猫等，词义正确。' },
      { no: 3, code: 'R1', points: 3, title: '写出第一句话谁在哪里做什么', reason: '回答缺人物、地点或事情', standard: '小猫在院子里玩球。' },
      { no: 4, code: 'R2', points: 2, title: '说出感叹号应读出的语气', reason: '读不出句子情感', standard: '开心、高兴的语气。' },
      { no: 5, code: 'W1', points: 5, title: '看图说话：小朋友浇花，说 3 句话', reason: '看图说话太短', standard: '至少有时间、地点、人物、动作和心情。' }
    ],
    b: [
      { no: 1, code: 'B1', points: 1, title: '拼读 t-ǔ、h-uā、x-iǎo', reason: '同类拼读迁移不稳', standard: 'tǔ、huā、xiǎo，声调读完整。' },
      { no: 2, code: 'B1', points: 1, title: '给“水、鸟、书”组词并说句子', reason: '词语和句子迁移不稳', standard: '词语正确，句子有完整意思。' },
      { no: 3, code: 'R1', points: 1, title: '回答小狗在草地上追蝴蝶中的谁在哪里做什么', reason: '主干信息不全', standard: '小狗在草地上追蝴蝶。' },
      { no: 4, code: 'W1', points: 1, title: '看图说话：小朋友捡起地上的纸', reason: '动作和心情不完整', standard: '至少 3 句，补动作和心情。' }
    ],
    c: [
      { no: 1, code: 'B1', points: 2, title: '读准“桥、云、灯”，各组一个词并说完整句', reason: '字音、组词和句子不能连续迁移', standard: '读音正确，组词贴合语境，句子有谁、做什么。' },
      { no: 2, code: 'R1', points: 3, title: '读短句“小兔在草地上捡到红球，它高兴地跳起来”，说清谁在哪里做什么', reason: '主干提取遇到新材料仍不完整', standard: '小兔在草地上捡到红球。' },
      { no: 3, code: 'R2', points: 2, title: '从句子中找出小兔心情的依据', reason: '情感判断没有回到词句', standard: '从“高兴地跳起来”可以看出小兔很开心。' },
      { no: 4, code: 'W1', points: 4, title: '看图说话：雨后小朋友扶起倒下的小花，说 3 句以上', reason: '换图后画面、动作、心情缺层', standard: '写清时间、人物、动作、结果和心情。' }
    ],
    c2: [
      { no: 1, code: 'B1', points: 2, title: '限时读准“船、窗、树”，并各说一个短句', reason: '限时下字音和组句不稳', standard: '读音正确，短句完整。' },
      { no: 2, code: 'R1', points: 3, title: '读“小鸟飞回树上唱歌”，说清谁做什么', reason: '换句后主干不稳', standard: '小鸟飞回树上唱歌。' },
      { no: 3, code: 'R2', points: 3, title: '从“笑眯眯”判断人物心情，并说明依据', reason: '心情词不会转成答案', standard: '人物很高兴，依据是“笑眯眯”。' },
      { no: 4, code: 'W1', points: 5, title: '看图说话：小朋友给迷路的弟弟指路', reason: '动作和结果写不完整', standard: '至少 3 句，有帮助过程和结果。' }
    ],
    c3: [
      { no: 1, code: 'B1', points: 2, title: '区分“再、在”，各写一句话', reason: '同音字语境迁移不稳', standard: '“再”表示又一次，“在”表示位置或正在。' },
      { no: 2, code: 'R1', points: 3, title: '用 15 字内概括“小鹿送伞”的句群', reason: '短句群概括啰嗦或漏结果', standard: '小鹿把伞送给没带伞的小伙伴。' },
      { no: 3, code: 'R2', points: 3, title: '小鹿为什么值得表扬，从句子中找依据', reason: '评价题没有动作依据', standard: '因为它帮助同伴，依据是把伞送给没带伞的小伙伴。' },
      { no: 4, code: 'W1', points: 6, title: '写 4 句“我帮助同学”的小片段', reason: '拔尖写话缺过程和心情', standard: '有起因、动作、对方反应和自己的心情。' }
    ]
  },
  2: {
    label: '二年级',
    retest: 'grade2.html#grade2-b-test',
    a: [
      { no: 1, code: 'B1', points: 3, title: '选字填空：清、晴、睛', reason: '形近字按感觉选', standard: '晴、清、睛。' },
      { no: 2, code: 'R1', points: 2, title: '贝贝和妈妈去哪里、做什么', reason: '只答地点或事情不完整', standard: '去公园看花。' },
      { no: 3, code: 'R2', points: 3, title: '老奶奶为什么夸贝贝', reason: '原因题没有回到短文', standard: '因为贝贝帮老奶奶捡起掉在地上的袋子。' },
      { no: 4, code: 'R1', points: 4, title: '用一句话概括短文主要内容', reason: '概括漏人物、事件或结果', standard: '贝贝和妈妈去公园看花，贝贝帮助老奶奶捡袋子，受到夸奖。' },
      { no: 5, code: 'W1', points: 6, title: '扩写“贝贝帮助老奶奶”成一段话', reason: '只有评价，没有动作过程', standard: '写出看见、跑去、捡起、递给、被夸和心情。' }
    ],
    b: [
      { no: 1, code: 'B1', points: 1, title: '选字填空：园、圆', reason: '形近字语境迁移不稳', standard: '园、圆。' },
      { no: 2, code: 'R2', points: 1, title: '小雨为什么把伞借给同学', reason: '原因没有材料依据', standard: '因为同学没有带伞，外面正在下雨。' },
      { no: 3, code: 'R1', points: 1, title: '概括“小雨借伞”短文', reason: '人物、事情、结果不完整', standard: '小雨看到同学没带伞，把伞借给他，同学很感激。' },
      { no: 4, code: 'W1', points: 1, title: '扩写“小雨借伞”成 4 句话', reason: '动作、语言、心情不足', standard: '有动作、语言、心情。' }
    ],
    c: [
      { no: 1, code: 'B1', points: 2, title: '选字填空：带、戴、代，并说明为什么这样选', reason: '只会选答案，不会解释语境', standard: '戴红领巾、带雨伞、代表，能说出词义差别。' },
      { no: 2, code: 'R1', points: 3, title: '读“小河边的提醒”短文，用一句话概括主要内容', reason: '新短文概括漏人物或结果', standard: '小明看到警示牌后提醒弟弟远离河边，两人安全回家。' },
      { no: 3, code: 'R2', points: 3, title: '小明为什么拉住弟弟，从文中找依据', reason: '原因题没有引用关键句', standard: '因为河边有警示牌，水很深；依据要来自文中。' },
      { no: 4, code: 'W1', points: 5, title: '把“小明提醒弟弟”扩写成 5 句话', reason: '动作、语言、结果不能同时写完整', standard: '有看见、拉住、提醒、弟弟反应、结果。' }
    ],
    c2: [
      { no: 1, code: 'B1', points: 2, title: '限时选择“坐、座、做”，并说理由', reason: '常用字语境判断慢', standard: '坐下、一座桥、做作业，理由清楚。' },
      { no: 2, code: 'R1', points: 3, title: '概括“小雨让座”短文', reason: '人物、事件、结果漏一项', standard: '小雨在公交车上给老爷爷让座，受到夸奖。' },
      { no: 3, code: 'R2', points: 3, title: '为什么说小雨懂事？找两处依据', reason: '人物品质缺依据', standard: '主动让座、扶老爷爷坐稳。' },
      { no: 4, code: 'W1', points: 5, title: '扩写“小雨让座”成一段话', reason: '限时扩写过程不足', standard: '写出看见、起身、说话、结果、心情。' }
    ],
    c3: [
      { no: 1, code: 'B1', points: 2, title: '用“清、晴、情”各写一句话', reason: '形近同音字拔尖迁移不稳', standard: '水清、天晴、心情，语境准确。' },
      { no: 2, code: 'R1', points: 4, title: '用 20 字内概括“捡钱包还失主”', reason: '概括不能压缩', standard: '贝贝捡到钱包后交给失主，受到表扬。' },
      { no: 3, code: 'R2', points: 4, title: '贝贝有哪些品质？从两处细节说明', reason: '只能写一个品质或无依据', standard: '诚实、乐于助人，并有两处细节。' },
      { no: 4, code: 'W1', points: 6, title: '写一段“我做对了一件事”', reason: '拔尖写话缺选择和结果', standard: '有犹豫、选择、行动、结果。' }
    ]
  },
  3: {
    label: '三年级',
    retest: 'grade3.html#grade3-b-test',
    a: [
      { no: 1, code: 'R1', points: 1, title: '找中心句', reason: '把地点词当中心句', standard: '放学后，操场上真热闹。' },
      { no: 2, code: 'R1', points: 3, title: '概括“操场热闹”这段', reason: '概括时照抄原句', standard: '放学后，操场上同学们跳绳、跑步、踢球，到处都是欢笑声。' },
      { no: 3, code: 'W1', points: 2, title: '绿豆第一天是什么样子', reason: '只写对象，不写样子', standard: '硬硬的、小小的。' },
      { no: 4, code: 'W1', points: 3, title: '第三天发生了什么变化', reason: '只写发芽，没有变化细节', standard: '绿豆裂开了一道缝，白白的小芽探出了头。' },
      { no: 5, code: 'W1', points: 6, title: '写一段观察片段', reason: '观察片段没有顺序和感受', standard: '有顺序、变化和感受。' }
    ],
    b: [
      { no: 1, code: 'R1', points: 1, title: '找中心句：图书角真安静', reason: '中心句判断迁移不稳', standard: '图书角真安静。' },
      { no: 2, code: 'R1', points: 1, title: '概括“图书角安静”这段', reason: '删细节留主干不稳', standard: '图书角里同学们安静地看书、做摘记。' },
      { no: 3, code: 'W1', points: 1, title: '写绿豆第五天的变化', reason: '观察变化细节不足', standard: '小芽长高了，顶端露出两片嫩嫩的小叶子。' },
      { no: 4, code: 'W1', points: 1, title: '围绕“花坛真美”写 4 句话', reason: '句子没有围绕中心', standard: '每句话都围绕一个中心。' }
    ],
    c: [
      { no: 1, code: 'R1', points: 3, title: '读“午后的植物角”，找中心句并概括这一段', reason: '中心句和段意混在一起', standard: '先找中心句，再用自己的话概括植物角热闹或有变化。' },
      { no: 2, code: 'R2', points: 3, title: '为什么说小军观察得认真，从两处细节说明', reason: '人物评价没有细节支撑', standard: '写出特点，并列出两处观察动作或记录细节。' },
      { no: 3, code: 'W1', points: 4, title: '按“第一天、第三天、第五天”写一段观察变化', reason: '观察片段顺序乱、变化少', standard: '有时间顺序、外形变化和自己的发现。' },
      { no: 4, code: 'C1', points: 2, title: '判断第2题属于“概括题、依据题、赏析题”哪一类', reason: '题型判断慢，影响答题层次', standard: '属于依据题，要按“特点 + 依据”作答。' }
    ],
    c2: [
      { no: 1, code: 'R1', points: 3, title: '限时找“热闹的操场”中心句并概括', reason: '限时下照抄原句', standard: '能找中心句，并用自己的话概括活动多、气氛热闹。' },
      { no: 2, code: 'R2', points: 3, title: '为什么说班长负责？从两处动作说明', reason: '责任品质没有细节支撑', standard: '组织排队、提醒安全等动作。' },
      { no: 3, code: 'W1', points: 5, title: '围绕“操场真热闹”写 5 句话', reason: '句子不围绕中心', standard: '每句都服务“热闹”。' },
      { no: 4, code: 'C1', points: 3, title: '判断“找中心句”和“概括段意”的区别', reason: '题型混淆', standard: '中心句是原文句子，段意是自己的概括。' }
    ],
    c3: [
      { no: 1, code: 'R1', points: 4, title: '用 25 字内概括“第一次养蚕”的片段', reason: '拔尖概括不能抓变化', standard: '写清观察对象、主要变化和自己的发现。' },
      { no: 2, code: 'R2', points: 4, title: '小作者为什么惊喜？从两处变化说明', reason: '情感题缺变化依据', standard: '蚕卵变化、蚕宝宝出现等细节。' },
      { no: 3, code: 'W1', points: 5, title: '写一段“我发现了一个小秘密”', reason: '观察作文缺发现意识', standard: '有观察过程、细节变化、发现或感受。' },
      { no: 4, code: 'C1', points: 3, title: '把第2题改成满分答案并说出补了哪一层', reason: '不会自改答案', standard: '补情感、依据和分析。' }
    ]
  },
  4: {
    label: '四年级',
    retest: 'grade4.html#grade4-b-test',
    a: [
      { no: 1, code: 'R1', points: 4, title: '概括短文主要内容', reason: '概括漏结果或太啰嗦', standard: '小林克服紧张，代表小组完整讲完故事，赢得掌声。' },
      { no: 2, code: 'R2', points: 3, title: '小林上台前是什么心情，从哪里看出', reason: '心情题没有原文依据', standard: '紧张。从“手心里全是汗”“声音有些发抖”可以看出。' },
      { no: 3, code: 'R2', points: 4, title: '小林是怎样的人', reason: '人物特点只有一个词', standard: '小林勇敢、敢于挑战自己，并能结合情节说明。' },
      { no: 4, code: 'R3', points: 4, title: '赏析“雨点像一串串小鼓点”', reason: '赏析只写“生动”', standard: '修辞、特点、效果都写到。' },
      { no: 5, code: 'W2', points: 5, title: '写一段“紧张”，不能出现“紧张”二字', reason: '重点场景没有细节', standard: '动作、神态、心理细节齐全。' }
    ],
    b: [
      { no: 1, code: 'R1', points: 1, title: '概括“晓雨第一次主持班会”的短文', reason: '概括迁移漏结果', standard: '晓雨克服害怕，顺利主持班会，得到同学认可。' },
      { no: 2, code: 'R2', points: 1, title: '晓雨为什么害怕，从哪里看出', reason: '观点后没有依据', standard: '观点后必须有原文依据。' },
      { no: 3, code: 'R3', points: 1, title: '赏析“掌声像春风一样涌过来”', reason: '方法、特点、效果不全', standard: '方法、特点、效果都写到。' },
      { no: 4, code: 'W2', points: 1, title: '写一段“不安”，不能出现“不安”二字', reason: '动作、神态、心理细节不足', standard: '有动作、神态、心理细节。' }
    ],
    c: [
      { no: 1, code: 'R1', points: 3, title: '读“第一次上台领读”，概括主要内容', reason: '综合阅读时概括漏起因或结果', standard: '写清谁、遇到什么困难、怎样做、结果怎样。' },
      { no: 2, code: 'R2', points: 3, title: '主人公是怎样的人，从两处细节说明', reason: '人物形象没有证据链', standard: '特点 + 两处细节 + 简要分析，不能只写“很好”。' },
      { no: 3, code: 'R3', points: 3, title: '赏析“声音像一条细线慢慢稳了下来”', reason: '赏析只贴术语，没有联系变化', standard: '写出修辞、声音由弱到稳的特点和表现出的成长。' },
      { no: 4, code: 'W2', points: 4, title: '写一段“我终于敢开口了”，不能出现“敢”字', reason: '重点段不能用细节表现心理变化', standard: '有动作、神态、心理、结果，能看出变化。' },
      { no: 5, code: 'C1', points: 2, title: '判断第3题应按几层作答', reason: '综合题分层意识不稳', standard: '至少三层：方法、内容特点、表达效果。' }
    ],
    c2: [
      { no: 1, code: 'R1', points: 3, title: '限时概括“雨中护书”的短文', reason: '限时综合漏结果', standard: '写清人物、护书过程和结果。' },
      { no: 2, code: 'R2', points: 4, title: '人物有哪些品质？用两处细节证明', reason: '多品质题层次乱', standard: '负责、细心等品质与细节对应。' },
      { no: 3, code: 'R3', points: 4, title: '赏析“雨点像小鼓一样敲在伞面上”', reason: '赏析只写比喻', standard: '写出修辞、声音特点和气氛。' },
      { no: 4, code: 'W2', points: 5, title: '写一段“我克服了害怕”', reason: '限时重点段薄', standard: '有害怕、动作、鼓励、变化。' },
      { no: 5, code: 'C1', points: 3, title: '判断第2题和第3题的答题步骤分别是什么', reason: '人物题和赏析题混淆', standard: '人物题：特点+依据；赏析题：方法+特点+效果。' }
    ],
    c3: [
      { no: 1, code: 'R1', points: 4, title: '用 30 字内概括“班级图书角风波”', reason: '压轴概括抓不住冲突和解决', standard: '写清问题、解决办法和结果。' },
      { no: 2, code: 'R2', points: 4, title: '主人公前后发生了什么变化？从两处细节说明', reason: '变化题只写结果', standard: '前后对比 + 两处细节。' },
      { no: 3, code: 'R3', points: 4, title: '赏析结尾“心里像窗户被推开了一样亮”', reason: '不能结合中心', standard: '写出比喻、心情变化和中心。' },
      { no: 4, code: 'W2', points: 6, title: '写一段“我主动承担了责任”', reason: '拔尖重点段缺成长认识', standard: '有错误、犹豫、承担、认识。' },
      { no: 5, code: 'C1', points: 4, title: '把第2题低分答案改成满分答案', reason: '不会定位缺层', standard: '补前后变化、依据和分析。' }
    ]
  },
  5: {
    label: '五年级',
    retest: 'grade5.html#grade5-b-test',
    a: [
      { no: 1, code: 'R3', points: 4, title: '“大约”能删去吗，为什么', reason: '说明文语言题只背“不准确”', standard: '词义、删后变化、准确性共三层。' },
      { no: 2, code: 'R1', points: 4, title: '材料 A 主要说明什么', reason: '概括漏说明对象或条件', standard: '竹笋在春雨后生长快，但受温度、水分和土壤影响。' },
      { no: 3, code: 'R2', points: 5, title: '材料 B 中爸爸是怎样的人', reason: '人物题没有两处依据', standard: '关爱孩子、默默付出，并列出两处依据。' },
      { no: 4, code: 'R2', points: 3, title: '“我低头看着热气，忽然说不出话来”表达了什么', reason: '情感题只写“感动”', standard: '写出被父亲关爱打动和感激。' },
      { no: 5, code: 'W2', points: 5, title: '给《那一次，我懂得了坚持》列中心和详写段', reason: '作文中心没有成长认识', standard: '中心、详写、成长认识都明确。' }
    ],
    b: [
      { no: 1, code: 'R3', points: 1, title: '“几乎全部”能删去“几乎”吗', reason: '语言准确性迁移不稳', standard: '词义、删后变化、准确性完整。' },
      { no: 2, code: 'R1', points: 1, title: '概括海鸟迁徙材料', reason: '说明对象和影响因素不全', standard: '说明对象和影响因素都不漏。' },
      { no: 3, code: 'R2', points: 1, title: '爷爷是怎样的人，从两处细节说明', reason: '特点和两处依据不对应', standard: '特点 + 两处依据 + 分析。' },
      { no: 4, code: 'W2', points: 1, title: '给《那一次，我学会了负责》列中心和详写段', reason: '中心缺少认识，详写不聚焦', standard: '中心有认识，详写最能表现变化的一幕。' }
    ],
    c: [
      { no: 1, code: 'R3', points: 4, title: '说明文中“约三分之一”能否删去“约”，说明理由', reason: '限制词分析不能迁移到数据表达', standard: '解释词义、删后变绝对、体现说明文准确严谨。' },
      { no: 2, code: 'R1', points: 4, title: '概括材料 A“城市树荫降温”的主要信息', reason: '材料概括漏对象、条件或结论', standard: '写清树荫能降低地表温度，效果受树种、密度等影响。' },
      { no: 3, code: 'R4', points: 4, title: '根据材料 B 的数据，给学校操场改造提一条建议', reason: '建议题没有引用数据', standard: '建议要带数据依据，如增加树荫区或遮阳设施。' },
      { no: 4, code: 'R2', points: 4, title: '短文中的父亲是怎样的人，从两处细节说明', reason: '人物形象缺“内容 + 情感 + 中心”', standard: '关爱孩子、默默付出；用两处行动细节支撑并分析情感。' },
      { no: 5, code: 'W2', points: 5, title: '给《那一次，我懂得了体谅》设计中心和重点段', reason: '作文中心和详写段脱节', standard: '中心有认识，重点段能表现误解到理解的变化。' }
    ],
    c2: [
      { no: 1, code: 'R3', points: 4, title: '限时分析“接近一半”能否删去“接近”', reason: '限制词答题不完整', standard: '词义、删后变化、准确性三层。' },
      { no: 2, code: 'R1', points: 4, title: '概括“候鸟迁徙受天气影响”的材料', reason: '说明对象和影响因素不全', standard: '写清候鸟迁徙受风向、温度等影响。' },
      { no: 3, code: 'R4', points: 5, title: '根据两组数据给学校阅读活动提建议', reason: '跨材料数据整合不稳', standard: '建议具体，引用并比较数据。' },
      { no: 4, code: 'R2', points: 4, title: '文中的母亲是怎样的人？从两处细节说明', reason: '人物题迁移缺分析', standard: '特点、两处依据、分析齐全。' },
      { no: 5, code: 'W2', points: 6, title: '给《那一次，我学会了体谅》列中心和重点段', reason: '限时提纲中心浅', standard: '中心有认识，重点段有前后变化。' }
    ],
    c3: [
      { no: 1, code: 'R3', points: 5, title: '压轴：比较“大约”和“至少”在说明文中的表达作用', reason: '不能比较不同限制词作用', standard: '分别说明估计范围和最低限度，体现严谨。' },
      { no: 2, code: 'R1', points: 5, title: '概括两则材料共同说明的问题', reason: '跨材料共同点抓不住', standard: '找共同对象和共同结论。' },
      { no: 3, code: 'R4', points: 5, title: '结合材料数据，写一段 80 字建议', reason: '建议缺论证层次', standard: '建议、数据、比较、理由齐全。' },
      { no: 4, code: 'R2', points: 5, title: '分析人物情感变化，并用两处细节证明', reason: '高阶人物题缺变化线', standard: '前后情感、两处细节、中心分析。' },
      { no: 5, code: 'W2', points: 6, title: '写《那一次，我懂得了沉默的爱》的重点段', reason: '拔尖作文不能用细节表现含蓄情感', standard: '有动作细节、心理转折和认识。' }
    ]
  },
  6: {
    label: '六年级',
    retest: 'grade6.html#grade6-b-test',
    a: [
      { no: 1, code: 'C1', points: 1, title: '判断“这段话在文中有什么作用”属于什么题型', reason: '题型判断不准', standard: '句段作用题。' },
      { no: 2, code: 'R3', points: 4, title: '“通常”能删去吗，为什么', reason: '语言准确性题漏删后变化', standard: '词义、删后变化、文体特点齐全。' },
      { no: 3, code: 'R4', points: 4, title: '根据材料 B 给学生提一条运动建议', reason: '建议题没有引用材料', standard: '建议有材料依据。' },
      { no: 4, code: 'R4', points: 4, title: '根据材料 B 说明运动有什么好处', reason: '数据题不会比较', standard: '数据、结论、建议齐全。' },
      { no: 5, code: 'W3', points: 5, title: '给《这一次，我长大了》列提纲', reason: '作文提纲没扣题眼', standard: '题眼、中心、详写都明确。' }
    ],
    b: [
      { no: 1, code: 'C1', points: 1, title: '判断“结尾一句在全文中的作用”属于什么题型', reason: '综合题型迁移不稳', standard: '句段作用题，重点从内容、结构、中心三层思考。' },
      { no: 2, code: 'R3', points: 1, title: '“一般情况下”能删去吗', reason: '限制词分析不完整', standard: '词义、删后变化和严谨性齐全。' },
      { no: 3, code: 'R4', points: 1, title: '根据阅读数据提出建议', reason: '建议没有数据依据', standard: '建议每天坚持阅读 30 分钟以上，并引用数据。' },
      { no: 4, code: 'W3', points: 1, title: '给《这一次，我做对了》列提纲', reason: '题眼、中心、详写没有扣合', standard: '题眼、中心、详写和点题都明确。' }
    ],
    c: [
      { no: 1, code: 'C1', points: 3, title: '判断“开头引用数据有什么作用”属于哪类题，并列答题层次', reason: '综合题型识别和分层迁移不稳', standard: '属于句段作用或材料作用题，从内容、结构、效果三层答。' },
      { no: 2, code: 'R3', points: 4, title: '“不超过 15 分钟”中的“不超过”能否删去', reason: '说明文语言题漏边界意识', standard: '解释限定范围，删后意思改变，体现表达准确严谨。' },
      { no: 3, code: 'R4', points: 4, title: '结合两则材料，为六年级学生制定一条阅读建议', reason: '跨材料整合没有数据和对象意识', standard: '建议明确对象，至少引用一处数据或材料关键词。' },
      { no: 4, code: 'R2', points: 4, title: '文中的“我”发生了怎样的变化，从两处细节说明', reason: '变化题只写结果，不写前后对比', standard: '写出前后变化，并用两处细节证明。' },
      { no: 5, code: 'W3', points: 5, title: '给《这一次，我没有逃避》列限时作文提纲', reason: '高年级作文题眼、中心、材料不能一体化', standard: '题眼是“没有逃避”，中心有成长认识，详写关键一幕并点题。' }
    ],
    c2: [
      { no: 1, code: 'C1', points: 4, title: '限时判断“中间段承上启下”的答题层次', reason: '句段作用题层次少', standard: '内容、结构、中心三层。' },
      { no: 2, code: 'R3', points: 4, title: '分析“多数情况下”在说明文中的作用', reason: '限制词不能联系语境', standard: '范围、删后变化、准确性。' },
      { no: 3, code: 'R4', points: 5, title: '整合两则阅读材料，给毕业复习提建议', reason: '跨材料整合缺比较', standard: '对象、建议、数据、比较齐全。' },
      { no: 4, code: 'R2', points: 5, title: '分析“我”从逃避到面对的变化线', reason: '变化题缺前后对照', standard: '前后状态、触发细节、结果。' },
      { no: 5, code: 'W3', points: 6, title: '给《这一次，我做对了》列限时提纲', reason: '限时作文题眼和中心脱节', standard: '选择、过程、认识、点题齐全。' }
    ],
    c3: [
      { no: 1, code: 'C1', points: 5, title: '压轴：比较“开头引用数据”和“结尾点题”的不同作用', reason: '综合作用题不能比较', standard: '分别从内容、结构、表达效果比较。' },
      { no: 2, code: 'R3', points: 5, title: '分析两个限制词共同体现的说明文特点', reason: '语言题不能综合归纳', standard: '限制范围、避免绝对、体现准确严谨。' },
      { no: 3, code: 'R4', points: 5, title: '用两则材料写 100 字建议短文', reason: '材料建议不能成段表达', standard: '建议明确，数据支撑，语言有条理。' },
      { no: 4, code: 'R2', points: 5, title: '结合细节分析人物成长，并点明文章中心', reason: '高阶人物题缺中心提升', standard: '变化、依据、分析、中心齐全。' },
      { no: 5, code: 'W3', points: 8, title: '给《这一次，我没有逃避》写题眼、中心、重点段、结尾', reason: '小升初压轴作文构思不完整', standard: '题眼、中心、详写、点题结尾闭环。' }
    ]
  }
};

function getFlowPack(codeOrId) {
  const id = normalizeErrorCategoryId(codeOrId);
  return FLOW_PACKS.find(pack => pack.id === id || pack.code.toLowerCase() === id);
}

function getFlowPackStatus() {
  try {
    const parsed = JSON.parse(localStorage.getItem('flowPackStatus') || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveFlowPackStatus(status) {
  safeSet('flowPackStatus', status);
}

function getFlowStatusText(packId) {
  const status = getFlowPackStatus()[packId] || 'todo';
  return FLOW_STATUS_LABELS[status] || FLOW_STATUS_LABELS.todo;
}

function markFlowPack(codeOrId, status = 'done', options = {}) {
  const pack = getFlowPack(codeOrId);
  if (!pack) return;

  const nextStatus = FLOW_STATUS_LABELS[status] ? status : 'todo';
  const flowStatus = getFlowPackStatus();
  if (nextStatus === 'todo') {
    delete flowStatus[pack.id];
  } else {
    flowStatus[pack.id] = nextStatus;
  }
  saveFlowPackStatus(flowStatus);
  renderFlowStatusPanel();
  injectFlowPackControls();
  renderLearningProfilePanel();
  renderNextLessonPanel();

  if (!options.silent) {
    showFeedback(true, `${pack.code} 已标记为“${FLOW_STATUS_LABELS[nextStatus]}”。`);
  }
}

function renderFlowStatusPanel() {
  const panel = document.getElementById('flowStatusPanel');
  if (!panel) return;

  const flowStatus = getFlowPackStatus();
  panel.innerHTML = `
    <div class="flow-status-grid">
      ${FLOW_PACKS.map(pack => {
        const status = flowStatus[pack.id] || 'todo';
        return `
          <article class="flow-status-card">
            <strong>${pack.code} ${pack.title}</strong>
            <span class="status-pill ${FLOW_STATUS_CLASS[status] || FLOW_STATUS_CLASS.todo}">${FLOW_STATUS_LABELS[status] || FLOW_STATUS_LABELS.todo}</span>
            <a class="flow-action-btn" href="${pack.href}">进入训练</a>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function injectFlowPackControls() {
  const actions = [
    { status: 'done', label: '完成训练' },
    { status: 'retry', label: '需要再练' },
    { status: 'passed', label: '复测已通过' },
    { status: 'todo', label: '重置' }
  ];
  const flowStatus = getFlowPackStatus();

  FLOW_PACKS.forEach(pack => {
    const article = document.getElementById(`pack-${pack.id}`);
    if (!article) return;

    const current = flowStatus[pack.id] || 'todo';
    const oldActions = article.querySelector('.flow-pack-actions');
    if (oldActions) oldActions.remove();

    const html = `
      <div class="flow-pack-actions" data-pack="${pack.id}">
        ${actions.map(action => `
          <button type="button" class="flow-action-btn ${current === action.status ? 'active' : ''}" onclick="markFlowPack('${pack.id}', '${action.status}')">
            ${action.label}
          </button>
        `).join('')}
      </div>
    `;
    article.insertAdjacentHTML('beforeend', html);
  });
}

function getPaperLabel(paper) {
  const labels = {
    a: 'A卷诊断',
    b: 'B卷复测',
    c: 'C1基础混合迁移',
    c2: 'C2限时综合',
    c3: 'C3拔尖压轴'
  };
  return labels[paper] || labels.a;
}

function isCPaper(paper) {
  return ['c', 'c2', 'c3'].includes(paper);
}

function getABTestSet(grade, paper) {
  const gradeData = AB_TEST_MAP[String(grade)];
  if (!gradeData) return [];
  return gradeData[paper] || gradeData.a || [];
}

function initABScorePanel() {
  const panel = document.getElementById('abScorePanel');
  if (!panel) return;

  const gradeOptions = Object.entries(AB_TEST_MAP).map(([grade, data]) => (
    `<option value="${grade}">${data.label}</option>`
  )).join('');

  panel.innerHTML = `
    <div class="flow-score-form">
      <div class="flow-score-controls">
        <label>
          <span style="display:block;font-weight:900;margin-bottom:4px;">年级</span>
          <select class="flow-select" id="abGradeSelect">${gradeOptions}</select>
        </label>
        <label>
          <span style="display:block;font-weight:900;margin-bottom:4px;">卷型</span>
          <select class="flow-select" id="abPaperSelect">
            <option value="a">A卷诊断</option>
            <option value="b">B卷复测</option>
            <option value="c">C1基础混合迁移</option>
            <option value="c2">C2限时综合</option>
            <option value="c3">C3拔尖压轴</option>
          </select>
        </label>
      </div>
      <div id="abQuestionChecks"></div>
      <button type="button" class="next-btn flow-score-btn" id="abScoreBtn" style="width:100%;">生成分流建议</button>
      <div id="abScoreResult"></div>
    </div>
  `;

  document.getElementById('abGradeSelect').addEventListener('change', renderABQuestionChecks);
  document.getElementById('abPaperSelect').addEventListener('change', renderABQuestionChecks);
  document.getElementById('abScoreBtn').addEventListener('click', calculateABScore);

  renderABQuestionChecks();
  renderStoredABScoreResult();
}

function renderABQuestionChecks() {
  const gradeSelect = document.getElementById('abGradeSelect');
  const paperSelect = document.getElementById('abPaperSelect');
  const checksBox = document.getElementById('abQuestionChecks');
  if (!gradeSelect || !paperSelect || !checksBox) return;

  const questions = getABTestSet(gradeSelect.value, paperSelect.value);
  checksBox.innerHTML = `
    <div class="ab-question-list">
      ${questions.map((item, index) => `
        <label class="ab-question-item">
          <input type="checkbox" name="abWrongQuestion" value="${index}">
          <span>
            <span class="ab-code">${item.code}</span>
            第${item.no}题：${escapeHTML(item.title)}
            <br><small>${escapeHTML(item.reason)}</small>
          </span>
        </label>
      `).join('')}
    </div>
  `;

  const resultBox = document.getElementById('abScoreResult');
  if (resultBox) resultBox.innerHTML = '';
}

function saveFlowWrongItems(grade, paper, wrongItems) {
  if (!wrongItems.length) return;

  const gradeData = AB_TEST_MAP[String(grade)];
  const paperLabel = getPaperLabel(paper);
  const wrongList = getWrongAnswers();
  const existingKeys = new Set(wrongList.map(item => item.flowKey).filter(Boolean));

  wrongItems.forEach(item => {
    const pack = getFlowPack(item.code);
    if (!pack) return;

    const flowKey = `ab-${grade}-${paper}-${item.no}`;
    if (existingKeys.has(flowKey)) return;

    wrongList.push({
      type: `${gradeData.label}${paperLabel}`,
      question: `第${item.no}题：${item.title}`,
      userAnswer: '本题扣分或未达通过标准',
      correctAnswer: item.standard || `对应错因码：${pack.code}`,
      tip: `错因：${item.reason || pack.problem}。建议进入 ${pack.code}${pack.title} 训练包。`,
      errorCategory: pack.id,
      flowKey,
      timestamp: new Date().toISOString()
    });
    existingKeys.add(flowKey);
  });

  while (wrongList.length > 50) {
    wrongList.shift();
  }

  safeSet('wrongAnswers', wrongList);
  renderWrongList();
  renderErrorStats();
}

function calculateABScore() {
  const gradeSelect = document.getElementById('abGradeSelect');
  const paperSelect = document.getElementById('abPaperSelect');
  if (!gradeSelect || !paperSelect) return;

  const grade = gradeSelect.value;
  const paper = paperSelect.value;
  const gradeData = AB_TEST_MAP[String(grade)];
  const questions = getABTestSet(grade, paper);
  const checkedIndexes = Array.from(document.querySelectorAll('input[name="abWrongQuestion"]:checked'))
    .map(input => Number(input.value));
  const wrongItems = checkedIndexes.map(index => questions[index]).filter(Boolean);
  const totalPoints = questions.reduce((sum, item) => sum + (item.points || 1), 0);
  const lostPoints = wrongItems.reduce((sum, item) => sum + (item.points || 1), 0);
  const score = Math.max(0, totalPoints - lostPoints);
  const wrongCodes = [...new Set(wrongItems.map(item => item.code))];

  if ((paper === 'b' || isCPaper(paper)) && wrongItems.length === 0) {
    [...new Set(questions.map(item => item.code))].forEach(code => markFlowPack(code, 'passed', { silent: true }));
  } else {
    wrongCodes.forEach(code => markFlowPack(code, 'retry', { silent: true }));
  }

  saveFlowWrongItems(grade, paper, wrongItems);

  const result = {
    grade,
    paper,
    gradeLabel: gradeData.label,
    paperLabel: getPaperLabel(paper),
    total: questions.length,
    wrongCount: wrongItems.length,
    score,
    totalPoints,
    wrongCodes,
    retest: gradeData.retest,
    createdAt: new Date().toISOString()
  };
  safeSet('lastABScoreResult', result);
  saveScoreHistory(result);
  renderABScoreResult(result);
  renderFlowStatusPanel();
  injectFlowPackControls();
  renderLearningProfilePanel();
  renderNextLessonPanel();

  if (wrongItems.length === 0) {
    const passText = isCPaper(paper)
      ? `${getPaperLabel(paper)}无错，迁移通过，可以进入下一层拔尖训练。`
      : (paper === 'b' ? 'B卷无错，相关训练包已标记为通过，可以挑战C卷。' : 'A卷无错，可以直接挑战B卷。');
    showFeedback(true, passText);
  } else {
    showFeedback(false, `已生成 ${wrongItems.length} 个分流训练码。`);
  }
}

function renderStoredABScoreResult() {
  try {
    const result = JSON.parse(localStorage.getItem('lastABScoreResult') || 'null');
    if (result) renderABScoreResult(result);
  } catch (error) {
    localStorage.removeItem('lastABScoreResult');
  }
}

function renderABScoreResult(result) {
  const resultBox = document.getElementById('abScoreResult');
  if (!resultBox) return;

  const hasWrong = result.wrongCodes && result.wrongCodes.length > 0;
  const codeLinks = hasWrong ? result.wrongCodes.map(code => {
    const pack = getFlowPack(code);
    return pack ? `<a href="${pack.href}">${pack.code} ${pack.title}</a>` : '';
  }).join('') : '';
  const retestLink = hasWrong
    ? (isCPaper(result.paper)
      ? `<button type="button" class="flow-action-btn" onclick="selectABPaper('${result.grade}', '${result.paper}')">训练后再做${result.paperLabel}</button>`
      : `<a href="${result.retest}">训练后再做B卷复测</a>`)
    : (result.paper === 'a'
      ? `<a href="${result.retest}">完成训练后去B卷复测</a>`
      : (result.paper === 'b'
        ? `<button type="button" class="flow-action-btn" onclick="selectABPaper('${result.grade}', 'c')">打开C1基础混合迁移</button>`
        : (result.paper === 'c'
          ? `<button type="button" class="flow-action-btn" onclick="selectABPaper('${result.grade}', 'c2')">进入C2限时综合</button>`
          : (result.paper === 'c2'
            ? `<button type="button" class="flow-action-btn" onclick="selectABPaper('${result.grade}', 'c3')">进入C3拔尖压轴</button>`
            : `<a href="#peak-promotion">进入拔尖晋级测评</a>`))));

  resultBox.innerHTML = `
    <div class="ab-result">
      <strong>${result.gradeLabel}${result.paperLabel}：${result.score}/${result.totalPoints} 分，错 ${result.wrongCount}/${result.total} 题</strong>
      <p style="margin:0;color:#536174;">
        ${hasWrong ? '先集中处理错因码对应的训练包，做完后再复测。' : (isCPaper(result.paper) ? '迁移通过，说明不是记住原题，而是能换材料使用方法。' : (result.paper === 'b' ? '本次复测通过，可以进入C卷混合迁移。' : '诊断卷表现稳定，可以直接挑战B卷迁移。'))}
      </p>
      <div class="route-links">
        ${hasWrong ? codeLinks : ''}
        ${retestLink}
      </div>
    </div>
  `;
}

function readLastABScoreResult() {
  try {
    const result = JSON.parse(localStorage.getItem('lastABScoreResult') || 'null');
    return result && typeof result === 'object' ? result : null;
  } catch (error) {
    localStorage.removeItem('lastABScoreResult');
    return null;
  }
}

function getScoreHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    localStorage.removeItem('scoreHistory');
    return [];
  }
}

function saveScoreHistory(result) {
  const history = getScoreHistory();
  const percent = result.totalPoints ? Math.round((result.score / result.totalPoints) * 100) : 0;
  history.push({
    grade: result.grade,
    gradeLabel: result.gradeLabel,
    paper: result.paper,
    paperLabel: result.paperLabel,
    percent,
    wrongCount: result.wrongCount,
    wrongCodes: result.wrongCodes || [],
    createdAt: result.createdAt
  });
  while (history.length > 12) {
    history.shift();
  }
  safeSet('scoreHistory', history);
}

function selectABPaper(grade, paper) {
  const gradeSelect = document.getElementById('abGradeSelect');
  const paperSelect = document.getElementById('abPaperSelect');
  if (!gradeSelect || !paperSelect) return;

  if (grade && AB_TEST_MAP[String(grade)]) {
    gradeSelect.value = String(grade);
  }
  paperSelect.value = paper;
  renderABQuestionChecks();
  document.getElementById('abScorePanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getFlowStatsFromWrongAnswers() {
  const stats = {};
  FLOW_PACKS.forEach(pack => {
    stats[pack.id] = 0;
  });

  getWrongAnswers().forEach(item => {
    const id = normalizeErrorCategoryId(item.errorCategory || '');
    if (Object.prototype.hasOwnProperty.call(stats, id)) {
      stats[id] += 1;
    }
  });

  const lastResult = readLastABScoreResult();
  if (lastResult?.wrongCodes?.length) {
    lastResult.wrongCodes.forEach(code => {
      const pack = getFlowPack(code);
      if (pack) stats[pack.id] += 2;
    });
  }

  return stats;
}

function getProfileMetric(label, codeIds, stats, flowStatus, fallbackScore = 100) {
  const issueCount = codeIds.reduce((sum, id) => sum + (stats[id] || 0), 0);
  const retryCount = codeIds.filter(id => flowStatus[id] === 'retry').length;
  const passedCount = codeIds.filter(id => flowStatus[id] === 'passed').length;
  const score = Math.max(35, Math.min(100, fallbackScore - issueCount * 14 - retryCount * 18 + passedCount * 8));
  const status = score >= 88 ? '拔尖' : (score >= 68 ? '提升' : '补课');
  return { label, score, status, trend: '待观察' };
}

function getTrendLabel(recentScores) {
  if (!recentScores || recentScores.length < 2) return '待观察';
  const first = recentScores[0].percent || 0;
  const last = recentScores[recentScores.length - 1].percent || 0;
  const diff = last - first;
  if (diff >= 8) return `上升 ${diff}分`;
  if (diff <= -8) return `下降 ${Math.abs(diff)}分`;
  return '基本稳定';
}

function buildLearningProfile() {
  const stats = getFlowStatsFromWrongAnswers();
  const flowStatus = getFlowPackStatus();
  const lastResult = readLastABScoreResult();
  const scoreHistory = getScoreHistory();
  const recentScores = scoreHistory.slice(-3);
  const sortedPacks = FLOW_PACKS
    .map(pack => ({ ...pack, count: stats[pack.id] || 0, status: flowStatus[pack.id] || 'todo' }))
    .sort((a, b) => (b.status === 'retry') - (a.status === 'retry') || b.count - a.count);
  const hasAnyData = Boolean(lastResult) || Object.values(stats).some(count => count > 0) || Object.keys(flowStatus).length > 0;
  const mainIssue = hasAnyData ? (sortedPacks.find(pack => pack.status === 'retry' || pack.count > 0) || sortedPacks[0]) : null;
  const retryCount = Object.values(flowStatus).filter(status => status === 'retry').length;
  const passedCount = Object.values(flowStatus).filter(status => status === 'passed').length;
  const lastPercent = lastResult?.totalPoints ? Math.round((lastResult.score / lastResult.totalPoints) * 100) : 0;
  let level = '待诊断';
  let summary = '先完成当前年级 A 卷，系统会自动生成错因画像和下一课路径。';

  if (lastResult) {
    if (lastResult.paper === 'c3' && lastResult.wrongCount === 0 && retryCount === 0) {
      level = '拔尖迁移';
      summary = 'C3拔尖压轴已通过，孩子已经能换材料、换题型、换表达稳定使用方法。';
    } else if ((isCPaper(lastResult.paper) && lastResult.wrongCount === 0) || (lastResult.paper === 'b' && lastResult.wrongCount === 0) || passedCount >= 3) {
      level = '提升巩固';
      summary = '同类变式或混合迁移基本过关，下一步要继续向更高层 C 卷推进。';
    } else if (lastPercent >= 80 && retryCount <= 1) {
      level = '掌握中';
      summary = '基础方法已有雏形，需要把薄弱错因做成稳定步骤。';
    } else {
      level = '专项补强';
      summary = '先集中处理最高频错因，别急着混刷题。';
    }
  }

  return {
    level,
    summary,
    mainIssue,
    lastResult,
    recentScores,
    metrics: [
      getProfileMetric('基础短板', ['b1'], stats, flowStatus, lastPercent || 82),
      getProfileMetric('阅读短板', ['r1', 'r2', 'r3', 'r4'], stats, flowStatus, lastPercent || 78),
      getProfileMetric('作文短板', ['w1', 'w2', 'w3'], stats, flowStatus, lastPercent || 76),
      getProfileMetric('迁移短板', ['c1'], stats, flowStatus, isCPaper(lastResult?.paper) && lastResult.wrongCount === 0 ? 96 : (lastPercent || 72)),
      {
        label: '拔尖潜力',
        score: Math.max(35, Math.min(100, (lastPercent || 70) + passedCount * 6 - retryCount * 12)),
        status: (lastPercent >= 90 && retryCount === 0) ? '拔尖' : (lastPercent >= 75 ? '提升' : '补课'),
        trend: getTrendLabel(recentScores)
      }
    ].map(metric => ({
      ...metric,
      trend: metric.trend === '待观察' ? getTrendLabel(recentScores) : metric.trend
    }))
  };
}

function renderLearningProfilePanel() {
  const panel = document.getElementById('learningProfilePanel');
  if (!panel) return;

  const profile = buildLearningProfile();
  const last = profile.lastResult;
  const trendText = profile.recentScores.length
    ? profile.recentScores.map(item => `${item.gradeLabel}${item.paperLabel}${item.percent}%`).join(' → ')
    : '暂无趋势，完成 3 次测评后生成';
  panel.innerHTML = `
    <div class="profile-summary">
      <span class="profile-level">${profile.level}</span>
      <p>${escapeHTML(profile.summary)}</p>
      <p><strong>主攻错因：</strong>${profile.mainIssue ? `${profile.mainIssue.code} ${profile.mainIssue.title}：${profile.mainIssue.problem}` : '等待诊断数据'}</p>
      <p><strong>最近测评：</strong>${last ? `${last.gradeLabel}${last.paperLabel} ${last.score}/${last.totalPoints} 分，错 ${last.wrongCount} 题` : '暂无记录'}</p>
      <p><strong>最近3次趋势：</strong>${escapeHTML(trendText)}</p>
    </div>
    <div class="profile-metric-grid">
      ${profile.metrics.map(metric => `
        <article class="profile-metric-card">
          <strong>${metric.label}</strong>
          <span>${metric.status}</span>
          <small>${escapeHTML(metric.trend)}</small>
          <div class="profile-meter"><span style="width:${metric.score}%"></span></div>
        </article>
      `).join('')}
    </div>
  `;
}

function buildNextLessonPath() {
  const result = readLastABScoreResult();
  if (!result) {
    return {
      title: '下一课：先做年级A卷诊断',
      desc: '没有诊断数据时，不直接刷题。先完成当前年级A卷，勾选错题后系统会生成画像。',
      actions: [
        { label: '一年级A卷', href: 'grade1.html' },
        { label: '二年级A卷', href: 'grade2.html' },
        { label: '三年级A卷', href: 'grade3.html' },
        { label: '四年级A卷', href: 'grade4.html' },
        { label: '五年级A卷', href: 'grade5.html' },
        { label: '六年级A卷', href: 'grade6.html' }
      ],
      steps: ['完成A卷', '勾选错题', '生成错因码']
    };
  }

  if (result.wrongCodes?.length) {
    const firstPack = getFlowPack(result.wrongCodes[0]);
    return {
      title: `下一课：${firstPack?.code || ''}${firstPack?.title || '错因'}专项精练`,
      desc: '先处理最高优先级错因，完成基础题、提升题、拔尖题后再复测。',
      actions: [
        firstPack ? { label: `进入${firstPack.code}训练包`, href: firstPack.href } : null,
        result.paper === 'a'
          ? { label: '训练后做B卷', href: result.retest }
          : (result.paper === 'b'
            ? { label: '再做B卷复测', href: result.retest }
            : { label: `再做${result.paperLabel}`, grade: result.grade, paper: result.paper })
      ].filter(Boolean),
      steps: ['重讲错因方法', '做3道递进题', isCPaper(result.paper) ? 'C卷再迁移' : 'B卷复测']
    };
  }

  if (result.paper === 'a') {
    return {
      title: '下一课：B卷同类变式',
      desc: 'A卷稳定不代表真正掌握，要用B卷换题验证同类迁移。',
      actions: [{ label: '去B卷复测', href: result.retest }],
      steps: ['口头讲方法', '完成B卷', '错题回流训练包']
    };
  }

  if (result.paper === 'b') {
    return {
      title: '下一课：C1基础混合迁移',
      desc: 'B卷通过后，进入 C1 混合题组，检查孩子能否判断题型、切换方法、稳定表达。',
      actions: [{ label: '打开C卷评分器', grade: result.grade, paper: 'c' }],
      steps: ['混合题限时做', '按错因码判题', '通过后进拔尖晋级']
    };
  }

  if (result.paper === 'c') {
    return {
      title: '下一课：C2限时综合',
      desc: 'C1通过后，加入限时压力，检查孩子是否还能稳定判断题型和完整表达。',
      actions: [{ label: '打开C2限时综合', grade: result.grade, paper: 'c2' }],
      steps: ['限时完成', '口头讲方法', '错因回流或进C3']
    };
  }

  if (result.paper === 'c2') {
    return {
      title: '下一课：C3拔尖压轴',
      desc: 'C2通过后，进入压轴题，重点看跨材料、改答案、作文构思的综合能力。',
      actions: [{ label: '打开C3拔尖压轴', grade: result.grade, paper: 'c3' }],
      steps: ['压轴题组', '改低分答案', '通过后进拔尖晋级']
    };
  }

  return {
    title: '下一课：拔尖晋级测评',
    desc: 'C卷通过后，不再重复刷基础题，重点检查会讲、会改、会迁移。',
    actions: [{ label: '进入拔尖晋级', href: '#peak-promotion' }],
    steps: ['讲清题型', '改低分答案', '换材料再迁移']
  };
}

function formatPrintDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('zh-CN');
}

function setPrintText(id, value, fallback = '') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value || fallback;
}

function getLatestDiagnosisWrongItems(lastDiagnosisResult, wrongAnswers) {
  if (!lastDiagnosisResult || !Array.isArray(wrongAnswers)) return [];
  const diagnosisDate = new Date(lastDiagnosisResult.date || 0).getTime();
  const questionIds = new Set(Array.isArray(lastDiagnosisResult.questionIds) ? lastDiagnosisResult.questionIds : []);
  return wrongAnswers
    .filter(item => {
      if (!item) return false;
      if (questionIds.size && item.questionId && questionIds.has(item.questionId)) return true;
      if (item.diagnosisGrade && String(item.diagnosisGrade) !== String(lastDiagnosisResult.grade)) return false;
      if (item.diagnosisPaper && String(item.diagnosisPaper) !== String(lastDiagnosisResult.paper)) return false;
      const itemTime = new Date(item.timestamp || 0).getTime();
      if (!diagnosisDate || !itemTime) return false;
      return Math.abs(itemTime - diagnosisDate) <= 10 * 60 * 1000;
    })
    .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
}

function getPrintMainIssue(codes) {
  if (!codes || !codes.length) return null;
  return getFlowPack(codes[0]) || null;
}

function buildPrintTrainingRows(uniqueCodes) {
  if (!uniqueCodes.length) {
    return '<tr><td colspan="6">暂无系统分析结果，先完成一次 A/B/C 卷诊断或评分。</td></tr>';
  }
  return uniqueCodes.map(code => {
    const pack = getFlowPack(code);
    const title = pack ? pack.title : '对应训练包';
    const problem = pack ? pack.problem : '按系统结果进入对应训练。';
    return `<tr><td>${escapeHTML(code)}</td><td>${escapeHTML(title)}</td><td>□</td><td>□</td><td>□</td><td>${escapeHTML(problem)}</td></tr>`;
  }).join('');
}

function buildPrintDiagnosisRows(items) {
  if (!items.length) {
    return [
      '<tr><td>1</td><td>完成 A 卷后自动生成</td><td>-</td><td>系统将推荐对应训练包</td></tr>',
      '<tr><td>2</td><td>完成 A 卷后自动生成</td><td>-</td><td>系统将推荐对应训练包</td></tr>',
      '<tr><td>3</td><td>完成 A 卷后自动生成</td><td>-</td><td>系统将推荐对应训练包</td></tr>'
    ].join('');
  }
  return items.slice(0, 8).map((item, index) => {
    const code = getWrongItemErrorCode(item, getAnalysisSourceForWrongItem(item)) || '-';
    const pack = getFlowPack(code);
    const tip = item.mistakeReason || item.tip || '系统已记录本题薄弱点。';
    return `<tr><td>${index + 1}</td><td>${escapeHTML(tip)}</td><td>${escapeHTML(code)}</td><td>${escapeHTML(pack ? `${pack.code} ${pack.title}` : '进入对应训练包')}</td></tr>`;
  }).join('');
}

function buildPrintReviewRows(uniqueCodes, nextLessonTitle) {
  if (!uniqueCodes.length) {
    return '<tr><td>等待系统分析</td><td>日期：________</td><td>日期：________</td><td>日期：________</td><td>先完成 A 卷诊断</td></tr>';
  }
  return uniqueCodes.slice(0, 3).map(code => {
    return `<tr><td>${escapeHTML(code)}</td><td>□ 已重讲方法</td><td>日期：________</td><td>日期：________</td><td>${escapeHTML(nextLessonTitle)}</td></tr>`;
  }).join('');
}

function buildPrintAnswerSheet(lastDiagnosisResult, wrongItems) {
  const list = document.getElementById('printAnswerSheet');
  if (!list) return;
  if (!lastDiagnosisResult) {
    list.innerHTML = [
      '<li>第1题答案：<span class="blank-line"></span></li>',
      '<li>第2题答案：<span class="blank-line"></span></li>',
      '<li>第3题答案：<span class="blank-line"></span></li>',
      '<li>第4题答案：<span class="blank-line"></span></li>',
      '<li>第5题答案：<span class="blank-line"></span></li>'
    ].join('');
    return;
  }
  const paperLabel = lastDiagnosisResult.paperLabel || getPaperLabel(lastDiagnosisResult.paper);
  const items = new Array(5).fill(null).map((_, index) => {
    const wrong = wrongItems[index];
    const answerText = wrong ? (wrong.userAnswer || '已记录到错题本') : '';
    return `<li>${paperLabel}第${index + 1}题答案：<span class="blank-line">${escapeHTML(answerText)}</span></li>`;
  });
  list.innerHTML = items.join('');
}

function updatePrintTrainingSheet() {
  const statusEl = document.getElementById('printTrainingStatus');
  const lastDiagnosisResult = safeParse('lastDiagnosisResult', null);
  const lastABResult = readLastABScoreResult();
  const wrongAnswers = getWrongAnswers();
  const latestDiagnosisWrongItems = getLatestDiagnosisWrongItems(lastDiagnosisResult, wrongAnswers);
  const profile = buildLearningProfile();
  const nextLesson = buildNextLessonPath();
  const codeStats = latestDiagnosisWrongItems.reduce((acc, item) => {
    const code = getWrongItemErrorCode(item, getAnalysisSourceForWrongItem(item));
    if (code) acc[code] = (acc[code] || 0) + 1;
    return acc;
  }, {});
  const uniqueCodes = Object.entries(codeStats)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(entry => entry[0]);
  const mainIssue = getPrintMainIssue(uniqueCodes);
  const diagnosisTotalPoints = Number(lastDiagnosisResult?.totalPoints || 15);
  const aScore = lastDiagnosisResult ? `${lastDiagnosisResult.totalScore || 0}/${diagnosisTotalPoints}` : '';
  const generatedDate = formatPrintDate(lastDiagnosisResult?.date || lastABResult?.createdAt || new Date().toISOString());
  const gradeLabel = lastDiagnosisResult?.gradeLabel || lastABResult?.gradeLabel || '';
  const nextLessonTitle = nextLesson?.title ? nextLesson.title.replace(/^下一课：/, '') : '';
  const reviewMethod = mainIssue ? mainIssue.problem : '先完成系统诊断';

  setPrintText('printStudentGrade', gradeLabel);
  setPrintText('printGeneratedDate', generatedDate);
  setPrintText('printAScore', aScore);
  setPrintText('printBResult', lastABResult?.paper === 'b' ? (lastABResult.wrongCount === 0 ? '通过' : '需再练') : '通过 / 需再练');
  setPrintText('printCResult', lastABResult && isCPaper(lastABResult.paper) ? (lastABResult.wrongCount === 0 ? '通过' : '需回炉') : '通过 / 需回炉');
  setPrintText('printMainErrorCode', mainIssue ? `${mainIssue.code} ${mainIssue.title}` : '');
  setPrintText('printProfileLevel', profile.level || '');
  setPrintText('printNextLesson', nextLessonTitle);
  setPrintText('printNextFocus', mainIssue ? `${mainIssue.code} ${mainIssue.title}` : '');
  setPrintText('printReviewError', mainIssue ? `${mainIssue.code} ${mainIssue.title}` : '');
  setPrintText('printReviewMethod', reviewMethod);
  setPrintText('printReviewNext', nextLessonTitle);

  const diagnosisRows = document.getElementById('printDiagnosisRows');
  if (diagnosisRows) diagnosisRows.innerHTML = buildPrintDiagnosisRows(latestDiagnosisWrongItems);

  const trainingRows = document.getElementById('printTrainingRows');
  if (trainingRows) trainingRows.innerHTML = buildPrintTrainingRows(uniqueCodes);

  const reviewRows = document.getElementById('printReviewRows');
  if (reviewRows) reviewRows.innerHTML = buildPrintReviewRows(uniqueCodes, nextLessonTitle || '进入下一课');

  buildPrintAnswerSheet(lastDiagnosisResult, latestDiagnosisWrongItems);

  if (statusEl) {
    statusEl.textContent = lastDiagnosisResult || lastABResult
      ? `已回填最近一次系统结果：${gradeLabel || ''}${lastDiagnosisResult?.paperLabel || lastABResult?.paperLabel || ''}，主攻 ${mainIssue ? `${mainIssue.code} ${mainIssue.title}` : '待系统分析'}。`
      : '暂无系统结果。先完成一次 A/B/C 卷诊断或电子评分，打印单会自动回填错因码和训练路径。';
  }
}

function printTrainingSheet() {
  updatePrintTrainingSheet();
  document.body.classList.add('printing-training-sheet');
  window.print();
}

function renderNextLessonPanel() {
  const panel = document.getElementById('nextLessonPanel');
  if (!panel) return;

  const path = buildNextLessonPath();
  panel.innerHTML = `
    <div class="next-lesson-card">
      <strong>${escapeHTML(path.title)}</strong>
      <p>${escapeHTML(path.desc)}</p>
      <ol class="next-lesson-steps">
        ${path.steps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}
      </ol>
      <div class="route-links">
        ${path.actions.map(action => action.href
          ? `<a href="${action.href}">${escapeHTML(action.label)}</a>`
          : `<button type="button" class="flow-action-btn" onclick="selectABPaper('${action.grade}', '${action.paper}')">${escapeHTML(action.label)}</button>`
        ).join('')}
      </div>
    </div>
  `;
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  syncPracticeLevelButtons();
  initModeSwitch();
  observeInteractivePractice();
  initCheckin();
  renderWrongList();
  renderErrorStats();
  renderFlowStatusPanel();
  injectFlowPackControls();
  initABScorePanel();
  renderLearningProfilePanel();
  renderNextLessonPanel();
  updatePrintTrainingSheet();
  renderAutoRoutingPanel();
  
  // 关闭奖励弹窗
  document.getElementById('rewardModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('rewardModal')) {
      closeReward();
    }
  });
  
  // 关闭奖励按钮
  document.getElementById('closeRewardBtn').addEventListener('click', closeReward);
});

// ==================== 诊断测评功能 ====================

// 诊断测评题目数据
let currentDiagnosisQuestion = 0;
let diagnosisAnswers = [];
let diagnosisScores = {
  '瀛楄瘝鍩虹': 0,
  '闃呰鐞嗚В': 0,
  '鍐欎綔琛ㄨ揪': 0
};

function selectDiagnosisOption(index) {
  diagnosisAnswers[currentDiagnosisQuestion] = index;
  renderDiagnosisQuestion();
}

function prevQuestion() {
  if (currentDiagnosisQuestion > 0) {
    currentDiagnosisQuestion--;
    renderDiagnosisQuestion();
  }
}

function goToPractice() {
  // 滚动到练习区域
  document.querySelector('.interactive-practice').scrollIntoView({ behavior: 'smooth' });
}

// 作文筛选功能
function filterWriting(grade) {
  // 更新按钮状态
  document.querySelectorAll('.grade-filter-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = 'white';
    btn.style.color = '#667eea';
  });
  
  event.target.classList.add('active');
  event.target.style.background = '#667eea';
  event.target.style.color = 'white';
  
  // 隐藏所有年级内容
  document.querySelectorAll('.writing-content').forEach(content => {
    content.style.display = 'none';
  });
  
  // 显示选中年级内容
  document.getElementById('writing-grade-' + grade).style.display = 'block';
}

// ==================== 动态诊断组卷：年级 + A/B/C + 同类变式 ====================
const DYNAMIC_DIAGNOSIS_GRADES = {
  1: { label: '一年级', band: 'lower' },
  2: { label: '二年级', band: 'lower' },
  3: { label: '三年级', band: 'middle' },
  4: { label: '四年级', band: 'middle' },
  5: { label: '五年级', band: 'upper' },
  6: { label: '六年级', band: 'upper' }
};

const DYNAMIC_DIAGNOSIS_PAPERS = {
  a: { label: 'A卷诊断', desc: '定位薄弱点，自动生成错因码' },
  b: { label: 'B卷复测', desc: '换同类题，检查是否真正掌握' },
  c: { label: 'C卷迁移', desc: '混合材料和综合题，检查能否迁移' }
};

const DYNAMIC_DIAGNOSIS_TARGETS = { '字词基础': 5, '阅读理解': 5, '写作表达': 5 };

let activeDiagnosisQuestions = [];
let currentDiagnosisMeta = {
  grade: '3',
  paper: 'a',
  gradeLabel: '三年级',
  paperLabel: 'A卷诊断'
};

function getDynamicDiagnosisBank() {
  return Array.isArray(dynamicDiagnosisBank) ? dynamicDiagnosisBank : [];
}


function getDynamicDiagnosisSelectValue(id, fallback) {
  const el = document.getElementById(id);
  return el ? el.value : fallback;
}

function shuffleDynamicDiagnosis(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function readRecentDiagnosisVariantIds() {
  try {
    if (typeof localStorage === 'undefined') return [];
    return JSON.parse(localStorage.getItem('recentDiagnosisVariantIds') || '[]');
  } catch (error) {
    return [];
  }
}

function rememberDiagnosisVariantIds(questions) {
  if (typeof localStorage === 'undefined') return;
  const existing = readRecentDiagnosisVariantIds();
  const next = [...questions.map(q => `${q.grade}-${q.paper}-${q.variant}`), ...existing].slice(0, 90);
  safeSet('recentDiagnosisVariantIds', next);
}

function buildDynamicDiagnosisPaper(grade, paper) {
  const gradeProfile = DYNAMIC_DIAGNOSIS_GRADES[grade] || DYNAMIC_DIAGNOSIS_GRADES[3];
  const paperProfile = DYNAMIC_DIAGNOSIS_PAPERS[paper] || DYNAMIC_DIAGNOSIS_PAPERS.a;
  const recent = new Set(readRecentDiagnosisVariantIds());
  const bank = getDynamicDiagnosisBank()
    .filter(q => q.band === gradeProfile.band)
    .map(q => ({
      ...q,
      id: `${q.variant}-${grade}-${paper}`,
      grade,
      gradeLabel: gradeProfile.label,
      paper,
      paperLabel: paperProfile.label
    }));

  const selected = [];
  Object.entries(DYNAMIC_DIAGNOSIS_TARGETS).forEach(([type, count]) => {
    const candidates = bank.filter(q => q.type === type);
    const fresh = candidates.filter(q => !recent.has(`${q.grade}-${q.paper}-${q.variant}`));
    const pool = fresh.length >= count ? fresh : candidates;
    selected.push(...shuffleDynamicDiagnosis(pool).slice(0, count));
  });

  return shuffleDynamicDiagnosis(selected).slice(0, 15);
}

function getActiveDiagnosisQuestions() {
  return activeDiagnosisQuestions;
}

function updateDiagnosisPaperCopy() {
  const grade = getDynamicDiagnosisSelectValue('diagnosisGradeSelect', '3');
  const paper = getDynamicDiagnosisSelectValue('diagnosisPaperSelect', 'a');
  const gradeProfile = DYNAMIC_DIAGNOSIS_GRADES[grade] || DYNAMIC_DIAGNOSIS_GRADES[3];
  const paperProfile = DYNAMIC_DIAGNOSIS_PAPERS[paper] || DYNAMIC_DIAGNOSIS_PAPERS.a;
  const hint = document.getElementById('diagnosisPaperHint');
  if (hint) {
    hint.textContent = `${gradeProfile.label}${paperProfile.label}：${paperProfile.desc}。每次从题库随机抽15题，同一错因会尽量更换同类变式题。`;
  }
}

async function startDiagnosis() {
  const grade = getDynamicDiagnosisSelectValue('diagnosisGradeSelect', '3');
  const paper = getDynamicDiagnosisSelectValue('diagnosisPaperSelect', 'a');
  const gradeProfile = DYNAMIC_DIAGNOSIS_GRADES[grade] || DYNAMIC_DIAGNOSIS_GRADES[3];
  const paperProfile = DYNAMIC_DIAGNOSIS_PAPERS[paper] || DYNAMIC_DIAGNOSIS_PAPERS.a;
  const startBtn = document.querySelector('.start-diagnosis-btn');
  const startBtnLabel = startBtn ? startBtn.textContent : '';

  if (startBtn) {
    startBtn.disabled = true;
    startBtn.textContent = '加载题目中...';
  }

  const bank = await ensureDynamicDiagnosisBank();

  if (startBtn) {
    startBtn.disabled = false;
    startBtn.textContent = startBtnLabel || '开始15分钟诊断';
  }

  if (!Array.isArray(bank) || bank.length === 0) {
    alert('诊断题目加载失败，请稍后重试。');
    return;
  }

  const generatedQuestions = buildDynamicDiagnosisPaper(grade, paper);
  activeDiagnosisQuestions = generatedQuestions;
  if (!generatedQuestions.length) {
    alert('暂时无法生成本套诊断题，请稍后重试。');
    return;
  }

  currentDiagnosisMeta = { grade, paper, gradeLabel: gradeProfile.label, paperLabel: paperProfile.label };
  rememberDiagnosisVariantIds(activeDiagnosisQuestions);
  currentDiagnosisQuestion = 0;
  diagnosisAnswers = new Array(activeDiagnosisQuestions.length).fill(null);
  document.getElementById('diagnosisIntro').style.display = 'grid';
  document.getElementById('diagnosisQuiz').style.display = 'block';
  document.getElementById('diagnosisResult').style.display = 'none';
  renderDiagnosisQuestion();
}

function renderDiagnosisQuestion() {
  const questions = getActiveDiagnosisQuestions();
  const question = questions[currentDiagnosisQuestion];
  const questionCard = document.getElementById('questionCard');
  if (!question || !questionCard) return;
  
  let optionsHTML = '';
  question.options.forEach((option, index) => {
    const isSelected = diagnosisAnswers[currentDiagnosisQuestion] === index;
    optionsHTML += `
      <button class="option-btn ${isSelected ? 'selected' : ''}" onclick="selectDiagnosisOption(${index})">
        ${option}
      </button>
    `;
  });
  
  questionCard.innerHTML = `
    <div class="question-type">${question.gradeLabel || ''}${question.paperLabel || ''} · ${question.type} · ${question.errorCode || '诊断'}</div>
    <div class="question-text">${currentDiagnosisQuestion + 1}. ${question.question}</div>
    <div class="question-options">${optionsHTML}</div>
  `;
  
  const progress = ((currentDiagnosisQuestion + 1) / questions.length) * 100;
  document.getElementById('quizProgress').style.width = progress + '%';
  document.getElementById('currentQ').textContent = currentDiagnosisQuestion + 1;
  updateDiagnosisNav();
}

function updateDiagnosisNav() {
  const questions = getActiveDiagnosisQuestions();
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  
  prevBtn.style.display = currentDiagnosisQuestion > 0 ? 'inline-block' : 'none';
  if (currentDiagnosisQuestion < questions.length - 1) {
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
  }
  nextBtn.disabled = diagnosisAnswers[currentDiagnosisQuestion] === null;
  submitBtn.disabled = diagnosisAnswers[currentDiagnosisQuestion] === null;
}

function nextQuestion() {
  if (currentDiagnosisQuestion < getActiveDiagnosisQuestions().length - 1) {
    currentDiagnosisQuestion++;
    renderDiagnosisQuestion();
  }
}

function submitDiagnosis() {
  const questions = getActiveDiagnosisQuestions();
  if (diagnosisAnswers.includes(null)) {
    alert('请完成所有题目后再提交！');
    return;
  }
  let totalScore = 0;
  diagnosisScores = { '字词基础': 0, '阅读理解': 0, '写作表达': 0 };
  questions.forEach((q, index) => {
    if (diagnosisAnswers[index] === q.answer) {
      totalScore++;
      diagnosisScores[q.type]++;
    }
  });
  saveDiagnosisMistakes();
  showDiagnosisResult(totalScore);
}

function saveDiagnosisMistakes() {
  const questions = getActiveDiagnosisQuestions();
  const wrongList = safeParse('wrongAnswers', []);
  questions.forEach((q, index) => {
    if (diagnosisAnswers[index] !== q.answer) {
      wrongList.push({
        type: `${q.gradeLabel || currentDiagnosisMeta.gradeLabel}${q.paperLabel || currentDiagnosisMeta.paperLabel} - ${q.type}`,
        question: q.question,
        userAnswer: q.options[diagnosisAnswers[index]],
        correctAnswer: q.options[q.answer],
        tip: q.explanation,
        questionId: q.id,
        errorCategory: q.errorCategory,
        errorCode: q.errorCode,
        mistakeReason: q.mistakeReason,
        diagnosisPaper: q.paper || currentDiagnosisMeta.paper,
        diagnosisGrade: q.grade || currentDiagnosisMeta.grade,
        variantId: q.variant,
        timestamp: new Date().toISOString()
      });
    }
  });
  if (wrongList.length > 50) wrongList.splice(0, wrongList.length - 50);
  safeSet('wrongAnswers', wrongList);
  renderWrongList();
}

function showDiagnosisResult(totalScore) {
  document.getElementById('diagnosisQuiz').style.display = 'none';
  document.getElementById('diagnosisResult').style.display = 'block';
  const resultHeader = document.querySelector('#diagnosisResult .result-header p');
  if (resultHeader) {
    resultHeader.textContent = `${currentDiagnosisMeta.gradeLabel}${currentDiagnosisMeta.paperLabel}完成：系统已按错因码生成错题本和下一步训练建议。`;
  }
  document.getElementById('totalScore').textContent = totalScore;
  const skills = Object.entries(DYNAMIC_DIAGNOSIS_TARGETS).map(([name, max]) => ({
    name,
    score: diagnosisScores[name] || 0,
    max
  }));
  const skillScoresDiv = document.getElementById('skillScores');
  skillScoresDiv.innerHTML = skills.map(skill => {
    const percentage = (skill.score / skill.max) * 100;
    const levelClass = percentage < 60 ? 'weak' : (percentage < 80 ? 'medium' : 'good');
    return `
      <div class="skill-item">
        <div class="skill-name">${skill.name}</div>
        <div class="skill-bar"><div class="skill-fill ${levelClass}" style="width: ${percentage}%"></div></div>
        <div class="skill-score">${skill.score}/${skill.max}</div>
      </div>
    `;
  }).join('');
  generateSuggestions(skills);
  safeSet('lastDiagnosisResult', {
    totalScore,
    skills: diagnosisScores,
    grade: currentDiagnosisMeta.grade,
    gradeLabel: currentDiagnosisMeta.gradeLabel,
    paper: currentDiagnosisMeta.paper,
    paperLabel: currentDiagnosisMeta.paperLabel,
    questionIds: getActiveDiagnosisQuestions().map(q => q.id || q.question),
    date: new Date().toISOString()
  });
}

function generateSuggestions(skills) {
  const questions = getActiveDiagnosisQuestions();
  const suggestionsDiv = document.getElementById('suggestions');
  const wrongItems = questions.filter((q, index) => diagnosisAnswers[index] !== q.answer);
  const codeStats = wrongItems.reduce((acc, item) => {
    acc[item.errorCode] = (acc[item.errorCode] || 0) + 1;
    return acc;
  }, {});
  const topCode = Object.entries(codeStats).sort((a, b) => b[1] - a[1])[0];
  const paperNext = currentDiagnosisMeta.paper === 'a'
    ? '完成主攻错因训练包后，用B卷复测同类变式。'
    : currentDiagnosisMeta.paper === 'b'
      ? 'B卷通过后进入C卷迁移；若仍有错题，回到对应错因包重练。'
      : 'C卷重点看混合迁移能力，错题进入考前未掌握清单。';
  let suggestionsHTML = `<h3>个性化学习建议</h3>
    <div class="suggestion-item">
      <div class="suggestion-title">${currentDiagnosisMeta.gradeLabel}${currentDiagnosisMeta.paperLabel}测后路径</div>
      <div class="suggestion-text">主攻错因：${topCode ? `${topCode[0]}（${topCode[1]}题）` : '暂无明显错因'}。${paperNext}</div>
    </div>`;
  skills.forEach(skill => {
    const percentage = (skill.score / skill.max) * 100;
    const title = percentage < 60 ? `${skill.name}需要加强` : (percentage < 80 ? `${skill.name}有提升空间` : `${skill.name}表现稳定`);
    const text = percentage < 60
      ? '建议先做对应错因训练包，再进入同类变式复测。'
      : (percentage < 80 ? '下一步做B卷同类变式，检查方法是否稳定。' : '可以挑战C卷迁移题，看能否换材料继续做对。');
    suggestionsHTML += `<div class="suggestion-item"><div class="suggestion-title">${title}</div><div class="suggestion-text">${text}</div></div>`;
  });
  suggestionsDiv.innerHTML = suggestionsHTML;
}

function resetDiagnosis() {
  document.getElementById('diagnosisIntro').style.display = 'grid';
  document.getElementById('diagnosisQuiz').style.display = 'none';
  document.getElementById('diagnosisResult').style.display = 'none';
  currentDiagnosisQuestion = 0;
  diagnosisAnswers = [];
  activeDiagnosisQuestions = [];
  updateDiagnosisPaperCopy();
}

document.addEventListener('DOMContentLoaded', () => {
  updateDiagnosisPaperCopy();
  document.getElementById('diagnosisGradeSelect')?.addEventListener('change', updateDiagnosisPaperCopy);
  document.getElementById('diagnosisPaperSelect')?.addEventListener('change', updateDiagnosisPaperCopy);

  // 初始化分层学习
  initLayerLearning();
});

if (typeof window !== 'undefined') {
  window.buildDynamicDiagnosisPaper = buildDynamicDiagnosisPaper;
  window.rememberDiagnosisVariantIds = rememberDiagnosisVariantIds;
}

// ==================== 分层学习系统 ====================

// 分层学习初始化
function initLayerLearning() {
  const savedLayer = localStorage.getItem('studentLayer');
  if (savedLayer) {
    switchLayerTab(savedLayer);
  }

  // 更新学习画像数据
  updateLearningProfile();
  initRewardSystem();
}

// 分层选项卡切换
function switchLayerTab(tab) {
  // 切换按钮状态
  document.querySelectorAll('.layer-tab-btn').forEach(btn => {
    btn.classList.remove('active', 'top-active', 'avg-active');
  });

  const tabBtn = document.getElementById('layer' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (tabBtn) {
    if (tab === 'top') {
      tabBtn.classList.add('top-active');
    } else if (tab === 'avg') {
      tabBtn.classList.add('avg-active');
    } else {
      tabBtn.classList.add('active');
    }
  }

  // 切换内容显示
  document.querySelectorAll('.layer-content').forEach(content => {
    content.classList.remove('active');
  });

  const contentId = 'content' + tab.charAt(0).toUpperCase() + tab.slice(1);
  const content = document.getElementById(contentId);
  if (content) {
    content.classList.add('active');
  }

  // 保存选择
  if (tab !== 'all') {
    safeSet('studentLayer', tab);
  }

  // 更新学习画像
  updateLearningProfile();
}

// 更新学习画像数据
function updateLearningProfile() {
  const savedLayer = localStorage.getItem('studentLayer');

  // 获取诊断历史数据
  const lastResult = safeParse('lastDiagnosisResult', {});
  const wrongAnswers = safeParse('wrongAnswers', []);

  // 计算各维度正确率
  const diagnosisTotalPoints = Number(lastResult.totalPoints || 15);
  const totalQuestions = wrongAnswers.length + (lastResult.totalScore || 0);
  const correctRate = totalQuestions > 0 ? Math.round((lastResult.totalScore || 0) / diagnosisTotalPoints * 100) : 0;

  if (savedLayer === 'top') {
    // 尖子生画像更新
    const topScore = document.getElementById('topScore');
    const topStability = document.getElementById('topStability');
    const topTransfer = document.getElementById('topTransfer');
    const topDepth = document.getElementById('topDepth');

    if (topScore) topScore.textContent = correctRate || 92;
    if (topStability) topStability.textContent = Math.min(99, Math.max(80, correctRate + 3)) + '%';
    if (topTransfer) topTransfer.textContent = Math.min(98, Math.max(75, correctRate - 4)) + '%';
    if (topDepth) topDepth.textContent = Math.min(95, Math.max(70, correctRate + 3)) + '%';
  } else if (savedLayer === 'avg') {
    // 中等生画像更新
    const avgScore = document.getElementById('avgScore');
    const avgFoundation = document.getElementById('avgFoundation');
    const avgWeakness = document.getElementById('avgWeakness');
    const avgProgress = document.getElementById('avgProgress');

    if (avgScore) avgScore.textContent = correctRate || 78;
    if (avgFoundation) avgFoundation.textContent = Math.min(90, Math.max(60, correctRate - 6)) + '%';

    // 计算待攻弱势数量
    const errorCodes = {};
    wrongAnswers.forEach(w => {
      if (w.errorCode) {
        errorCodes[w.errorCode] = (errorCodes[w.errorCode] || 0) + 1;
      }
    });
    const weaknessCount = Object.keys(errorCodes).length;
    if (avgWeakness) avgWeakness.textContent = Math.min(5, Math.max(1, weaknessCount || 3));

    // 计算进步分数（模拟）
    if (avgProgress) avgProgress.textContent = '+' + Math.min(15, Math.max(0, correctRate - 70 + 3));
  }
}

// ==================== 激励机制 ====================

// 初始化激励机制
function initRewardSystem() {
  // 从localStorage加载积分和徽章数据
  const rewardData = safeParse('rewardData', {});

  const points = rewardData.points || 0;
  const badges = rewardData.badges || [];

  // 更新积分显示
  const pointsEl = document.getElementById('totalPoints');
  if (pointsEl) {
    pointsEl.textContent = points;
  }

  // 更新徽章状态
  updateBadgeStatus(badges);
}

// 更新徽章状态
function updateBadgeStatus(unlockedBadges) {
  const badgeGrid = document.getElementById('badgeGrid');
  if (!badgeGrid) return;

  const badgeNames = ['坚持之星', '诊断达人', '复测高手', '迁移大师', '满分王者', '写作新星'];

  badgeGrid.querySelectorAll('.reward-badge').forEach((badge, index) => {
    if (unlockedBadges.includes(badgeNames[index])) {
      badge.classList.remove('locked');
    }
  });
}

// 添加积分
function addPoints(amount, reason) {
  const rewardData = safeParse('rewardData', {});
  rewardData.points = (rewardData.points || 0) + amount;

  // 记录最近成就
  if (!rewardData.recentAchievements) {
    rewardData.recentAchievements = [];
  }
  rewardData.recentAchievements.unshift({
    reason: reason,
    points: amount,
    date: new Date().toISOString()
  });
  rewardData.recentAchievements = rewardData.recentAchievements.slice(0, 5);

  safeSet('rewardData', rewardData);

  // 更新显示
  const pointsEl = document.getElementById('totalPoints');
  if (pointsEl) {
    animatePoints(pointsEl, rewardData.points);
  }
}

// 积分动画
function animatePoints(element, targetValue) {
  const currentValue = parseInt(element.textContent) || 0;
  const diff = targetValue - currentValue;
  const duration = 500;
  const steps = 20;
  const increment = diff / steps;
  let step = 0;

  const animate = () => {
    step++;
    element.textContent = Math.round(currentValue + increment * step);
    if (step < steps) {
      setTimeout(animate, duration / steps);
    } else {
      element.textContent = targetValue;
    }
  };
  animate();
}

// 解锁徽章
function unlockBadge(badgeName) {
  const rewardData = safeParse('rewardData', {});
  if (!rewardData.badges) {
    rewardData.badges = [];
  }
  if (!rewardData.badges.includes(badgeName)) {
    rewardData.badges.push(badgeName);
    safeSet('rewardData', rewardData);

    // 显示奖励弹窗
    showRewardModal(badgeName);

    // 更新徽章显示
    updateBadgeStatus(rewardData.badges);
  }
}

// 显示奖励弹窗
function showRewardModal(badgeName) {
  const modal = document.getElementById('rewardModal');
  if (modal) {
    const title = document.getElementById('rewardTitle');
    const text = document.getElementById('rewardText');
    if (title) title.textContent = '恭喜解锁新徽章！';
    if (text) text.textContent = `你已获得 "${badgeName}" 徽章，继续加油！`;
    modal.classList.add('show');
  }
}

// 关闭奖励弹窗
document.addEventListener('click', (e) => {
  if (e.target.id === 'closeRewardBtn' || e.target.closest('#closeRewardBtn')) {
    const modal = document.getElementById('rewardModal');
    if (modal) modal.classList.remove('show');
  }
});

// ==================== 家长话术库 ====================

// 筛选话术
function filterScripts(type) {
  // 切换筛选按钮状态
  document.querySelectorAll('.scripts-filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // 筛选话术卡片
  const cards = document.querySelectorAll('.script-card');
  cards.forEach(card => {
    if (type === 'all') {
      card.style.display = 'block';
    } else {
      const cardType = card.getAttribute('data-type');
      card.style.display = cardType === type || cardType === 'avg' ? 'block' : 'none';
    }
  });
}

// ==================== 学习路径可视化 ====================

// 路径类型（详细配置）
const PATH_TYPES = {
  top: {
    name: '尖子生路径',
    desc: '适合基础扎实，目标满分的学生',
    steps: [
      { 
        id: 'a', 
        name: 'A卷诊断', 
        icon: '📋', 
        desc: '定位薄弱点，生成错因码', 
        target: '稳定90分+',
        duration: '30分钟',
        skills: ['错因分析', '薄弱定位'],
        method: '使用A卷进行基础诊断，系统自动分析薄弱环节'
      },
      { 
        id: 'b', 
        name: 'B卷复测', 
        icon: '🔄', 
        desc: '同类变式验证，巩固方法', 
        target: '稳定方法',
        duration: '40分钟',
        skills: ['变式练习', '方法巩固'],
        method: '使用B卷进行同类变式练习，验证掌握程度'
      },
      { 
        id: 'c1', 
        name: 'C1混合迁移', 
        icon: '📚', 
        desc: '混合题组，检查题型判断', 
        target: '混合判断',
        duration: '45分钟',
        skills: ['题型判断', '综合应用'],
        method: '混合多种题型训练，提高题型识别能力'
      },
      { 
        id: 'c2', 
        name: 'C2限时综合', 
        icon: '⏱️', 
        desc: '限时压力测试，检验稳定性', 
        target: '限时稳定',
        duration: '50分钟',
        skills: ['时间管理', '抗压能力'],
        method: '在限定时间内完成综合练习'
      },
      { 
        id: 'c3', 
        name: 'C3压轴拔尖', 
        icon: '🏆', 
        desc: '压轴题训练，冲刺满分', 
        target: '满分冲刺',
        duration: '60分钟',
        skills: ['压轴突破', '满分策略'],
        method: '专项训练压轴题，冲刺满分'
      }
    ]
  },
  avg: {
    name: '中等生路径',
    desc: '适合需要打牢基础，稳步提升的学生',
    steps: [
      { 
        id: 'a', 
        name: 'A卷诊断', 
        icon: '📋', 
        desc: '定位薄弱维度', 
        target: '明确问题',
        duration: '30分钟',
        skills: ['问题定位', '基础评估'],
        method: '使用A卷诊断，找出主要薄弱点'
      },
      { 
        id: 'b1', 
        name: 'B1基础强化', 
        icon: '📖', 
        desc: '字词基础补强', 
        target: '基础85%+',
        duration: '40分钟',
        skills: ['字词积累', '基础夯实'],
        method: '针对字词进行专项强化训练'
      },
      { 
        id: 'r1', 
        name: 'R1概括训练', 
        icon: '🎯', 
        desc: '概括能力专项', 
        target: '概括准确',
        duration: '35分钟',
        skills: ['概括技巧', '要点提取'],
        method: '专项训练概括能力，学会提取要点'
      },
      { 
        id: 'r2', 
        name: 'R2依据训练', 
        icon: '🔍', 
        desc: '依据意识培养', 
        target: '有据可依',
        duration: '35分钟',
        skills: ['依据意识', '原文引用'],
        method: '培养依据意识，学会引用原文'
      },
      { 
        id: 'b', 
        name: 'B卷复测', 
        icon: '✅', 
        desc: '综合能力验证', 
        target: '稳步提升',
        duration: '45分钟',
        skills: ['综合应用', '能力验证'],
        method: '使用B卷验证综合能力提升'
      }
    ]
  }
};

// 里程碑配置
const MILESTONES = [
  { percent: 25, name: '初窥门径', icon: '🥉' },
  { percent: 50, name: '小有所成', icon: '🥈' },
  { percent: 75, name: '出类拔萃', icon: '🥇' },
  { percent: 100, name: '满分达人', icon: '🏆' }
];

// 当前路径类型
let currentPathType = 'top';

// 获取学习统计数据
function getLearningStats() {
  const statsData = safeParse('learningStats', {});
  const practiceHistory = safeParse('practiceHistory', []);
  
  // 计算统计数据
  let totalTime = statsData.totalStudyTime || 12.5;
  let practiceCount = practiceHistory.length || 23;
  let accuracyTrend = statsData.accuracyTrend || [72, 75, 78, 80, 82, 83, 85];
  
  return {
    totalTime,
    practiceCount,
    accuracyTrend
  };
}

// 获取当前学习进度
function getLearningProgress() {
  const lastResult = readLastABScoreResult();
  const rewardData = JSON.parse(localStorage.getItem('rewardData') || '{}');
  const checkinData = JSON.parse(localStorage.getItem('checkinData') || '{"days":0}');
  
  let currentStep = 'a';
  let completedSteps = [];
  
  if (lastResult) {
    if (lastResult.paper === 'a' && lastResult.wrongCount === 0) {
      currentStep = 'b';
      completedSteps = ['a'];
    } else if (lastResult.paper === 'b' && lastResult.wrongCount === 0) {
      if (currentPathType === 'top') {
        currentStep = 'c1';
        completedSteps = ['a', 'b'];
      } else {
        currentStep = 'b';
        completedSteps = ['a'];
      }
    } else if (lastResult.paper === 'c' && lastResult.wrongCount === 0) {
      currentStep = 'c2';
      completedSteps = ['a', 'b', 'c1'];
    } else if (lastResult.paper === 'c2' && lastResult.wrongCount === 0) {
      currentStep = 'c3';
      completedSteps = ['a', 'b', 'c1', 'c2'];
    } else if (lastResult.paper === 'c3' && lastResult.wrongCount === 0) {
      completedSteps = ['a', 'b', 'c1', 'c2', 'c3'];
    } else if (lastResult.wrongCodes?.length > 0) {
      currentStep = lastResult.paper;
      completedSteps = ['a'];
    }
  }
  
  return {
    currentStep,
    completedSteps,
    totalPoints: rewardData.totalPoints || 256,
    checkinDays: checkinData.days || 3,
    lastResult
  };
}

// 计算进度百分比
function calculateProgressPercent() {
  const progress = getLearningProgress();
  const path = PATH_TYPES[currentPathType];
  const totalSteps = path.steps.length;
  const completedSteps = progress.completedSteps.length;
  return Math.round((completedSteps / totalSteps) * 100);
}

// 生成SVG路径图
function renderPathSVG(pathType) {
  const path = PATH_TYPES[pathType];
  const progress = getLearningProgress();
  const steps = path.steps;
  const nodeCount = steps.length;
  
  const svgWidth = 800;
  const svgHeight = 280;
  const startX = 60;
  const endX = svgWidth - 60;
  const centerY = 100;
  const spacing = (endX - startX) / (nodeCount - 1);
  
  let svg = `<svg class="path-svg" viewBox="0 0 ${svgWidth} ${svgHeight}">`;
  
  // 添加渐变定义
  svg += `
    <defs>
      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#667eea"/>
        <stop offset="100%" style="stop-color:#764ba2"/>
      </linearGradient>
    </defs>
  `;
  
  // 绘制连接线和箭头
  for (let i = 0; i < nodeCount - 1; i++) {
    const x1 = startX + i * spacing;
    const x2 = startX + (i + 1) * spacing;
    const isCompleted = progress.completedSteps.includes(steps[i].id);
    const isCurrent = progress.currentStep === steps[i].id;
    
    const connectorClass = isCompleted ? 'completed' : (isCurrent ? 'current' : '');
    
    const midX = (x1 + x2) / 2;
    svg += `<path class="path-connector ${connectorClass}" d="M${x1 + 35},${centerY} Q${midX},${centerY - 20} ${x2 - 35},${centerY}" />`;
    svg += `<polygon class="path-arrow ${connectorClass}" points="${x2 - 40},${centerY - 6} ${x2 - 30},${centerY} ${x2 - 40},${centerY + 6}" />`;
  }
  
  // 绘制节点
  for (let i = 0; i < nodeCount; i++) {
    const x = startX + i * spacing;
    const step = steps[i];
    
    const isCompleted = progress.completedSteps.includes(step.id);
    const isCurrent = progress.currentStep === step.id;
    
    let nodeClass = 'pending';
    if (isCompleted) nodeClass = 'completed';
    else if (isCurrent) nodeClass = 'current';
    
    const circleColor = isCompleted ? '#4caf50' : (isCurrent ? '#667eea' : '#e0e0e0');
    
    svg += `
      <g class="path-node ${nodeClass}" data-step="${step.id}" onclick="showNodeDetail('${step.id}')">
        <circle class="path-node-circle" cx="${x}" cy="${centerY}" r="28" fill="${circleColor}" />
        <text class="path-node-text" x="${x}" y="${centerY - 2}">${step.icon}</text>
        <text class="path-node-label" x="${x}" y="${centerY + 50}">${step.name}</text>
      </g>
    `;
  }
  
  // 绘制阶段标签
  svg += `
    <text x="40" y="180" font-size="11" fill="#999">基础阶段</text>
    <text x="250" y="180" font-size="11" fill="#999">提升阶段</text>
    <text x="500" y="180" font-size="11" fill="#999">迁移阶段</text>
    <text x="680" y="180" font-size="11" fill="#999">拔尖阶段</text>
  `;
  
  svg += `
    <line x1="200" y1="170" x2="200" y2="200" stroke="#eee" stroke-width="1" stroke-dasharray="4 2"/>
    <line x1="450" y1="170" x2="450" y2="200" stroke="#eee" stroke-width="1" stroke-dasharray="4 2"/>
    <line x1="620" y1="170" x2="620" y2="200" stroke="#eee" stroke-width="1" stroke-dasharray="4 2"/>
  `;
  
  svg += '</svg>';
  
  return svg;
}

// 显示节点详情
function showNodeDetail(stepId) {
  const path = PATH_TYPES[currentPathType];
  const step = path.steps.find(s => s.id === stepId);
  const progress = getLearningProgress();
  
  const isCompleted = progress.completedSteps.includes(stepId);
  const isCurrent = progress.currentStep === stepId;
  
  let statusClass = 'pending';
  let statusText = '未开始';
  if (isCompleted) {
    statusClass = 'completed';
    statusText = '已完成';
  } else if (isCurrent) {
    statusClass = 'current';
    statusText = '进行中';
  }
  
  const detailHTML = `
    <div class="path-node-detail active" id="nodeDetail" style="top: 10px; left: 50%; transform: translateX(-50%);">
      <div class="path-detail-header">
        <span class="path-detail-icon">${step.icon}</span>
        <span class="path-detail-title">${step.name}</span>
      </div>
      <p class="path-detail-desc">${step.desc}</p>
      <p class="path-detail-desc"><strong>目标：</strong>${step.target}</p>
      <p class="path-detail-desc"><strong>时长：</strong>${step.duration}</p>
      <span class="path-detail-status ${statusClass}">${statusText}</span>
    </div>
  `;
  
  const oldDetail = document.getElementById('nodeDetail');
  if (oldDetail) oldDetail.remove();
  
  const pathway = document.getElementById('learningPathway');
  pathway.insertAdjacentHTML('beforeend', detailHTML);
  
  setTimeout(() => {
    const detail = document.getElementById('nodeDetail');
    if (detail) detail.remove();
  }, 3000);
}

// 切换路径类型
function switchPathType(type) {
  currentPathType = type;
  
  document.getElementById('pathTopBtn').classList.toggle('active', type === 'top');
  document.getElementById('pathAvgBtn').classList.toggle('active', type === 'avg');
  
  renderPathway();
  
  safeSet('pathType', type);
}

// 渲染完整路径
function renderPathway() {
  const pathway = document.getElementById('learningPathway');
  const progress = getLearningProgress();
  const path = PATH_TYPES[currentPathType];
  const stats = getLearningStats();
  
  // 渲染SVG
  pathway.innerHTML = renderPathSVG(currentPathType);
  
  // 添加图例
  pathway.innerHTML += `
    <div class="path-legend">
      <div class="path-legend-item">
        <div class="path-legend-dot completed"></div>
        <span>已完成</span>
      </div>
      <div class="path-legend-item">
        <div class="path-legend-dot current"></div>
        <span>进行中</span>
      </div>
      <div class="path-legend-item">
        <div class="path-legend-dot pending"></div>
        <span>未开始</span>
      </div>
    </div>
  `;
  
  // 更新概览卡片
  updatePathOverview(progress, stats);
  
  // 更新里程碑
  updateMilestones(progress, path);
  
  // 更新阶段详情
  updateStepDetails(progress, path);
  
  // 更新状态栏
  const currentStep = path.steps.find(s => s.id === progress.currentStep) || path.steps[0];
  document.getElementById('currentStepIcon').textContent = currentStep.icon;
  document.getElementById('currentStepName').textContent = currentStep.name;
  document.getElementById('pathTotalPoints').textContent = progress.totalPoints;
  document.getElementById('pathCheckinDays').textContent = progress.checkinDays + '天';
  
  // 更新下一步建议
  updatePathSuggestion();
  
  // 绘制趋势图
  drawTrendChart(stats.accuracyTrend);
}

// 更新路径概览
function updatePathOverview(progress, stats) {
  const percent = calculateProgressPercent();
  const avgAccuracy = stats.accuracyTrend[stats.accuracyTrend.length - 1];
  
  // 更新进度环
  document.getElementById('pathProgressPercent').textContent = percent + '%';
  const progressBar = document.getElementById('pathProgressBar');
  const circumference = 283;
  const offset = circumference - (percent / 100) * circumference;
  progressBar.style.strokeDashoffset = offset;
  
  // 更新统计
  document.getElementById('totalStudyTime').textContent = stats.totalTime + 'h';
  document.getElementById('totalPracticeCount').textContent = stats.practiceCount + '次';
  document.getElementById('avgAccuracy').textContent = avgAccuracy + '%';
  
  // 更新路径推荐
  const path = PATH_TYPES[currentPathType];
  document.getElementById('recommendedPath').textContent = path.name;
  document.getElementById('pathRecommendReason').textContent = path.desc;
}

// 更新里程碑
function updateMilestones(progress, path) {
  const totalSteps = path.steps.length;
  const completedSteps = progress.completedSteps.length;
  
  MILESTONES.forEach(milestone => {
    const milestoneKey = milestone.percent;
    const threshold = Math.ceil((milestone.percent / 100) * totalSteps);
    const isAchieved = completedSteps >= threshold;
    
    const statusEl = document.getElementById(`milestone${milestoneKey}Status`);
    const itemEl = document.getElementById(`milestone-${milestoneKey}`);
    
    if (isAchieved) {
      statusEl.textContent = '已达成';
      statusEl.className = 'milestone-status achieved';
      itemEl.classList.add('achieved');
    } else {
      statusEl.textContent = '未达成';
      statusEl.className = 'milestone-status pending';
      itemEl.classList.remove('achieved');
    }
  });
}

// 更新阶段详情
function updateStepDetails(progress, path) {
  const container = document.getElementById('stepDetailsList');
  container.innerHTML = '';
  
  path.steps.forEach((step, index) => {
    const isCompleted = progress.completedSteps.includes(step.id);
    const isCurrent = progress.currentStep === step.id;
    
    let statusClass = 'pending';
    let statusText = '未开始';
    if (isCompleted) {
      statusClass = 'completed';
      statusText = '已完成';
    } else if (isCurrent) {
      statusClass = 'current';
      statusText = '进行中';
    }
    
    const cardHTML = `
      <div class="step-detail-card ${statusClass}" id="stepCard-${step.id}" onclick="toggleStepDetail('${step.id}')">
        <div class="step-detail-header">
          <span class="step-detail-icon">${step.icon}</span>
          <span class="step-detail-title">${step.name}</span>
          <span class="step-detail-status ${statusClass}">${statusText}</span>
        </div>
        <p class="step-detail-desc">${step.desc}</p>
        <div class="step-detail-expand">
          <div class="step-expand-item">
            <strong>目标</strong>
            <span>${step.target}</span>
          </div>
          <div class="step-expand-item">
            <strong>时长</strong>
            <span>${step.duration}</span>
          </div>
          <div class="step-expand-item">
            <strong>技能</strong>
            <span>${step.skills.join('、')}</span>
          </div>
          <div class="step-expand-item">
            <strong>方法</strong>
            <span>${step.method}</span>
          </div>
          <button class="step-detail-action" onclick="event.stopPropagation(); goToStep('${step.id}')">
            ${isCurrent ? '开始练习' : (isCompleted ? '再次练习' : '查看详情')}
          </button>
        </div>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// 展开/收起阶段详情
function toggleStepDetail(stepId) {
  const card = document.getElementById(`stepCard-${stepId}`);
  card.classList.toggle('expanded');
}

// 前往指定阶段
function goToStep(stepId) {
  const step = PATH_TYPES[currentPathType].steps.find(s => s.id === stepId);
  if (step) {
    showNodeDetail(stepId);
    setTimeout(() => {
      goToNextStep();
    }, 500);
  }
}

// 更新路径建议
function updatePathSuggestion() {
  const progress = getLearningProgress();
  const path = PATH_TYPES[currentPathType];
  const currentStepIndex = path.steps.findIndex(s => s.id === progress.currentStep);
  const currentStep = path.steps[currentStepIndex] || path.steps[0];
  
  let suggestion = '';
  let actionText = '';
  
  if (progress.completedSteps.length === path.steps.length) {
    suggestion = '🎉 恭喜！你已完成全部学习路径！继续保持，成功冲刺满分！';
    actionText = '继续挑战';
  } else if (progress.completedSteps.includes(currentStep.id)) {
    const nextStep = path.steps[currentStepIndex + 1];
    if (nextStep) {
      suggestion = `已完成 ${currentStep.name}，接下来进入「${nextStep.name}」`;
      actionText = `进入${nextStep.name}`;
    }
  } else {
    suggestion = `当前阶段：${currentStep.name} - ${currentStep.desc}`;
    actionText = `开始${currentStep.name}`;
  }
  
  document.getElementById('nextSuggestionText').textContent = suggestion;
  document.getElementById('pathActionBtn').textContent = actionText;
  document.getElementById('nextStepTime').textContent = `预计 ${currentStep.duration}`;
}

// 绘制趋势图
function drawTrendChart(data) {
  const canvas = document.getElementById('trendCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 30;
  
  // 清除画布
  ctx.clearRect(0, 0, width, height);
  
  // 绘制目标线
  const targetY = padding + (1 - 0.9) * (height - 2 * padding);
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#667eea';
  ctx.lineWidth = 1;
  ctx.moveTo(padding, targetY);
  ctx.lineTo(width - padding, targetY);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // 绘制折线
  const stepX = (width - 2 * padding) / (data.length - 1);
  
  ctx.beginPath();
  ctx.strokeStyle = '#4caf50';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  data.forEach((value, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - value / 100) * (height - 2 * padding);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // 绘制数据点
  data.forEach((value, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - value / 100) * (height - 2 * padding);
    
    ctx.beginPath();
    ctx.fillStyle = '#4caf50';
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 绘制标签
  ctx.fillStyle = '#999';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  
  const labels = ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '本周'];
  data.forEach((_, i) => {
    const x = padding + i * stepX;
    ctx.fillText(labels[i], x, height - 8);
  });
}

// 查看阶段预览
function showStepPreview() {
  const progress = getLearningProgress();
  const path = PATH_TYPES[currentPathType];
  const currentStep = path.steps.find(s => s.id === progress.currentStep) || path.steps[0];
  
  // 滚动到阶段详情
  document.getElementById('pathStepDetails').scrollIntoView({ behavior: 'smooth' });
  
  // 自动展开当前步骤
  setTimeout(() => {
    toggleStepDetail(currentStep.id);
  }, 500);
}

// 前往下一步
function goToNextStep() {
  const progress = getLearningProgress();
  const path = PATH_TYPES[currentPathType];
  const currentStep = path.steps.find(s => s.id === progress.currentStep) || path.steps[0];
  
  switch (currentStep.id) {
    case 'a':
    case 'b':
    case 'c1':
    case 'c2':
    case 'c3':
      window.location.href = '#diagnosis';
      document.getElementById('diagnosis')?.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'b1':
      window.location.href = '#layer-learning';
      break;
    case 'r1':
    case 'r2':
      window.location.href = '#layer-learning';
      break;
    default:
      window.location.href = '#diagnosis';
  }
}

// 初始化学习路径可视化
function initLearningPathViz() {
  const savedType = localStorage.getItem('pathType');
  if (savedType && PATH_TYPES[savedType]) {
    currentPathType = savedType;
    document.getElementById('pathTopBtn').classList.toggle('active', savedType === 'top');
    document.getElementById('pathAvgBtn').classList.toggle('active', savedType === 'avg');
  }
  
  renderPathway();
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  initLearningPathViz();
  initThickeningAssessments();
  initSelfAssessments();
});

// ==================== 补厚训练评估卡 ====================

const THICKENING_STORAGE_KEY = 'thickeningProgress';

function getThickeningProgress() {
  try {
    return JSON.parse(localStorage.getItem(THICKENING_STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveThickeningProgress(progress) {
  safeSet(THICKENING_STORAGE_KEY, progress);
}

function initThickeningAssessments() {
  // 找到所有补厚评估卡 - 在 thickening-training section 内
  var thickeningSection = document.getElementById('thickening-training');
  if (!thickeningSection) return;

  // 找到所有包含 "过关" 关键词的 .routine p 元素
  var allP = thickeningSection.querySelectorAll('.routine p');
  var found = false;

  allP.forEach(function (p) {
    var rawText = p.textContent;
    // 查找所有 □ + 后面跟着"过关"的评估项
    if (!/过关/.test(rawText)) return;
    found = true;

    var fullHtml = p.innerHTML;
    var progress = getThickeningProgress();
    var itemCounter = 0;

    // 先清理已有的 thicken-checkbox（防止重复初始化）
    p.querySelectorAll('.thicken-checkbox').forEach(function (el) { el.remove(); });

    // 用正则替换所有 □...过关 的内容块
    var newHtml = fullHtml.replace(/□\s*([^□]+?)(?=(□|$))/g, function (match, content) {
      var itemId = 'thicken_' + p.dataset.thickenPid + '_' + itemCounter;
      if (!p.dataset.thickenPid) {
        p.dataset.thickenPid = 'p' + Math.random().toString(36).substr(2, 8);
        itemId = 'thicken_' + p.dataset.thickenPid + '_' + itemCounter;
      }
      itemCounter++;
      var checked = progress[itemId] || false;
      var symbol = checked ? '☑' : '☐';
      var cls = checked ? ' checked' : '';
      return '<span class="thicken-checkbox' + cls + '" data-item-id="' + itemId + '" role="checkbox" aria-checked="' + (checked ? 'true' : 'false') + '" tabindex="0" style="cursor:pointer;font-size:18px;margin-right:5px;user-select:none;transition:transform 0.15s;display:inline-block;">' + symbol + '</span>' + content.trim();
    });

    p.innerHTML = newHtml;

    // 绑定点击事件
    p.querySelectorAll('.thicken-checkbox').forEach(function (span) {
      span.addEventListener('click', function (e) {
        e.stopPropagation();
        var progress = getThickeningProgress();
        var itemId = span.getAttribute('data-item-id');
        var isChecked = !progress[itemId];
        progress[itemId] = isChecked;
        saveThickeningProgress(progress);

        if (isChecked) {
          span.innerHTML = '☑';
          span.classList.add('checked');
          span.setAttribute('aria-checked', 'true');
          span.style.transform = 'scale(1.3)';
          setTimeout(function () { span.style.transform = 'scale(1)'; }, 150);
          addPoints(2, '\u8865\u539a\u8bad\u7ec3\u8fc7\u5173');
        } else {
          span.innerHTML = '☐';
          span.classList.remove('checked');
          span.setAttribute('aria-checked', 'false');
        }

        checkThickeningBadges();
      });

      span.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          span.click();
        }
      });
    });
  });

  if (found) {
    checkThickeningBadges();
  }
}

// ==================== 学生自我评估量表 ====================

const SELF_ASSESS_STORAGE_KEY = 'selfAssessment';

function getSelfAssessment() {
  try {
    return JSON.parse(localStorage.getItem(SELF_ASSESS_STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveSelfAssessment(data) {
  safeSet(SELF_ASSESS_STORAGE_KEY, data);
}

function initSelfAssessments() {
  var selfAssessSection = document.getElementById('parent-coaching-scripts');
  if (!selfAssessSection) return;

  var checkLists = selfAssessSection.querySelectorAll('.check-list');
  if (checkLists.length === 0) return;

  var assessmentData = getSelfAssessment();
  var allItems = [];

  checkLists.forEach(function (list, listIdx) {
    var items = list.querySelectorAll('li');
    items.forEach(function (li, itemIdx) {
      var itemId = 'self_eval_' + listIdx + '_' + itemIdx;
      var text = li.textContent.replace(/^□\s*/, '').trim();
      allItems.push({ id: itemId, text: text, li: li, listIdx: listIdx, itemIdx: itemIdx });
    });
  });

  allItems.forEach(function (item) {
    var checked = assessmentData[item.id] || false;
    var span = document.createElement('span');
    span.className = 'self-eval-checkbox' + (checked ? ' checked' : '');
    span.setAttribute('data-item-id', item.id);
    span.setAttribute('role', 'checkbox');
    span.setAttribute('aria-checked', checked ? 'true' : 'false');
    span.setAttribute('tabindex', '0');
    span.innerHTML = checked ? '☑' : '☐';
    span.style.cssText = 'cursor:pointer;font-size:18px;margin-right:8px;user-select:none;transition:transform 0.15s;display:inline-block;vertical-align:middle;';

    span.addEventListener('click', function (e) {
      e.stopPropagation();
      var data = getSelfAssessment();
      var isChecked = !data[item.id];
      data[item.id] = isChecked;
      data._lastUpdate = new Date().toISOString().split('T')[0];
      saveSelfAssessment(data);

      if (isChecked) {
        span.innerHTML = '☑';
        span.classList.add('checked');
        span.setAttribute('aria-checked', 'true');
        span.style.transform = 'scale(1.3)';
        setTimeout(function () { span.style.transform = 'scale(1)'; }, 150);
        addPoints(1, '\u81ea\u6211\u8bc4\u4f30\u8fbe\u6807');
      } else {
        span.innerHTML = '☐';
        span.classList.remove('checked');
        span.setAttribute('aria-checked', 'false');
      }

      updateSelfAssessmentStats();
    });

    span.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        span.click();
      }
    });

    // 替换 li 中的 □
    var html = item.li.innerHTML;
    html = html.replace('□ ', span.outerHTML + ' ');
    item.li.innerHTML = html;
  });

  updateSelfAssessmentStats();
}

function updateSelfAssessmentStats() {
  var data = getSelfAssessment();
  var checkedCount = Object.values(data).filter(function (v) { return v === true; }).length;
  var totalCount = Object.keys(data).filter(function (k) { return k !== '_lastUpdate'; }).length;

  var pointsEl = document.getElementById('selfAssessPoints');
  if (pointsEl) {
    if (checkedCount > 0) {
      pointsEl.textContent = checkedCount + '/' + (totalCount || 10) + ' \u9879\u8fbe\u6807';
    } else {
      pointsEl.textContent = '\u5f85\u66f4\u65b0';
    }
  }

  // 自评量表进度徽章
  if (checkedCount >= 5) unlockBadge('\u81ea\u8bc4\u8d77\u6b65');
  if (checkedCount >= 8) unlockBadge('\u81ea\u8bc4\u8fbe\u4eba');
  if (checkedCount >= totalCount && totalCount > 0) unlockBadge('\u81ea\u8bc4\u6ee1\u5206');
}

// ==================== 检查补厚勋章解锁 ====================

function checkThickeningBadges() {
  var progress = getThickeningProgress();
  var doneCount = Object.values(progress).filter(function (v) { return v; }).length;

  // 字词补厚勋章：基础+变式+综合=4项全过
  // 阅读补厚勋章
  // 写作补厚勋章
  // 全补厚勋章

  var badgeNames = [];
  if (doneCount >= 4) badgeNames.push('\u57fa\u7840\u8865\u539a\u52cb\u7ae0');
  if (doneCount >= 8) badgeNames.push('\u53d8\u5f0f\u8865\u539a\u52cb\u7ae0');
  if (doneCount >= 12) badgeNames.push('\u7efc\u5408\u8865\u539a\u52cb\u7ae0');
  if (doneCount >= 16) badgeNames.push('\u5168\u80fd\u8865\u539a\u52cb\u7ae0');

  badgeNames.forEach(function (name) {
    unlockBadge(name);
  });
}

// ==================== 全局函数暴露 ====================

if (typeof window !== 'undefined') {
  window.switchLayerTab = switchLayerTab;
  window.filterScripts = filterScripts;
  window.addPoints = addPoints;
  window.unlockBadge = unlockBadge;
  window.switchPathType = switchPathType;
  window.showNodeDetail = showNodeDetail;
  window.goToNextStep = goToNextStep;
  window.toggleStepDetail = toggleStepDetail;
  window.goToStep = goToStep;
  window.showStepPreview = showStepPreview;
  window.initThickeningAssessments = initThickeningAssessments;
  window.initSelfAssessments = initSelfAssessments;
  window.checkThickeningBadges = checkThickeningBadges;
}
