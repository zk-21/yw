// 内容管理后台核心功能

const ADMIN_DATA = {
  exercises: [],
  vocabulary: [],
  grammar: [],
  essays: []
};

let currentPage = 1;
const PAGE_SIZE = 10;

// 初始化
async function initAdmin() {
  await loadAllData();
  renderDashboard();
}

// 加载所有数据
async function loadAllData() {
  try {
    ADMIN_DATA.exercises = await loadJsonData('data/exercises.json') || [];
    ADMIN_DATA.vocabulary = await loadJsonData('data/vocabulary.json') || {};
    ADMIN_DATA.grammar = await loadJsonData('data/grammar.json') || {};
    ADMIN_DATA.essays = await loadJsonData('data/model-essays.json') || {};
  } catch (e) {
    console.error('加载数据失败:', e);
  }
}

// 加载JSON数据
async function loadJsonData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error(`加载 ${url} 失败:`, e);
    return null;
  }
}

// 保存数据到服务器（模拟）
async function saveJsonData(url, data) {
  try {
    // 在浏览器环境下，我们使用localStorage存储变更
    // 实际项目中应该发送到服务器
    localStorage.setItem(`admin_${url}`, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`保存 ${url} 失败:`, e);
    return false;
  }
}

// 显示指定区域
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
  
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
  
  // 根据区域重新加载数据
  switch(sectionId) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'exercises':
      renderExercisesTable(currentPage);
      break;
    case 'vocabulary':
      renderVocabularyTable();
      break;
    case 'grammar':
      renderGrammarTable();
      break;
    case 'essays':
      renderEssaysTable();
      break;
  }
}

// 渲染数据概览
function renderDashboard() {
  // 统计题库数量
  const exerciseCount = ADMIN_DATA.exercises.length || 0;
  document.getElementById('stat-exercises').textContent = exerciseCount;
  
  // 统计词汇数量
  let vocabCount = 0;
  const vocab = ADMIN_DATA.vocabulary;
  if (vocab) {
    ['同义词', '反义词', '成语', '多音字'].forEach(key => {
      if (vocab[key]) {
        if (typeof vocab[key] === 'object' && vocab[key].length !== undefined) {
          vocabCount += vocab[key].length;
        } else if (typeof vocab[key] === 'object') {
          Object.keys(vocab[key]).forEach(k => {
            if (vocab[key][k] && vocab[key][k].length) {
              vocabCount += vocab[key][k].length;
            }
          });
        }
      }
    });
  }
  document.getElementById('stat-vocabulary').textContent = vocabCount;
  
  // 统计语法知识点数量
  let grammarCount = 0;
  const grammar = ADMIN_DATA.grammar;
  if (grammar) {
    Object.keys(grammar).forEach(key => {
      if (key !== '_meta' && grammar[key]) {
        if (typeof grammar[key] === 'object' && grammar[key].length !== undefined) {
          grammarCount += grammar[key].length;
        } else if (typeof grammar[key] === 'object') {
          Object.keys(grammar[key]).forEach(k => {
            if (grammar[key][k] && grammar[key][k].length) {
              grammarCount += grammar[key][k].length;
            }
          });
        }
      }
    });
  }
  document.getElementById('stat-grammar').textContent = grammarCount;
  
  // 统计范文类型数量
  const essayCount = ADMIN_DATA.essays && ADMIN_DATA.essays['作文类型'] ? 
    ADMIN_DATA.essays['作文类型'].length : 0;
  document.getElementById('stat-essays').textContent = essayCount;
  
  // 渲染年级分布图表
  renderGradeChart();
}

// 渲染年级分布图表
function renderGradeChart() {
  const chart = document.getElementById('grade-chart');
  chart.innerHTML = '';
  
  const gradeColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
  
  for (let grade = 1; grade <= 6; grade++) {
    const count = ADMIN_DATA.exercises.filter(e => e.grade === grade).length;
    const maxCount = Math.max(...[1,2,3,4,5,6].map(g => 
      ADMIN_DATA.exercises.filter(e => e.grade === g).length
    ));
    const height = maxCount > 0 ? (count / maxCount) * 100 : 10;
    
    const bar = document.createElement('div');
    bar.style.width = '60px';
    bar.style.height = `${Math.max(height, 10)}px`;
    bar.style.background = gradeColors[grade-1];
    bar.style.borderRadius = '4px';
    bar.style.display = 'flex';
    bar.style.alignItems = 'flex-end';
    bar.style.justifyContent = 'center';
    bar.style.color = 'white';
    bar.style.fontSize = '12px';
    bar.style.fontWeight = 'bold';
    bar.style.paddingBottom = '4px';
    bar.style.minHeight = '40px';
    bar.innerHTML = count;
    
    const label = document.createElement('div');
    label.textContent = `${grade}年级`;
    label.style.textAlign = 'center';
    label.style.marginTop = '8px';
    label.style.fontSize = '13px';
    label.style.color = '#64748b';
    
    const container = document.createElement('div');
    container.appendChild(bar);
    container.appendChild(label);
    chart.appendChild(container);
  }
}

// 渲染题库表格
function renderExercisesTable(page = 1) {
  const table = document.getElementById('exercises-table').querySelector('tbody');
  const exercises = ADMIN_DATA.exercises || [];
  
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedExercises = exercises.slice(start, end);
  
  table.innerHTML = '';
  
  paginatedExercises.forEach(exercise => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exercise.id || '-'}</td>
      <td>${exercise.grade}年级${exercise.semester || ''}</td>
      <td>${exercise.type || '-'}</td>
      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${exercise.question || '-'}</td>
      <td>
        <span class="status-badge ${getDifficultyClass(exercise.difficulty)}">${getDifficultyLabel(exercise.difficulty)}</span>
      </td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="editExercise('${exercise.id}')">编辑</button>
        <button class="btn btn-danger" style="padding: 4px 10px; font-size: 12px; margin-left: 5px;" onclick="deleteExercise('${exercise.id}')">删除</button>
      </td>
    `;
    table.appendChild(row);
  });
  
  // 渲染分页
  renderPagination('exercises-pagination', exercises.length, page);
}

// 获取难度样式类
function getDifficultyClass(difficulty) {
  const classes = {
    'basic': 'status-draft',
    'improve': 'status-published',
    'advanced': 'btn-warning',
    'exam': 'btn-danger'
  };
  return classes[difficulty] || 'status-draft';
}

// 获取难度标签
function getDifficultyLabel(difficulty) {
  const labels = {
    'basic': '基础',
    'improve': '提高',
    'advanced': '拔尖',
    'exam': '小升初'
  };
  return labels[difficulty] || difficulty;
}

// 渲染分页
function renderPagination(containerId, total, currentPage) {
  const container = document.getElementById(containerId);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '';
  if (currentPage > 1) {
    html += `<button onclick="renderExercisesTable(${currentPage - 1})">上一页</button>`;
  }
  
  for (let i = 1; i <= totalPages; i++) {
    html += `<button ${i === currentPage ? 'class="active"' : ''} onclick="renderExercisesTable(${i})">${i}</button>`;
  }
  
  if (currentPage < totalPages) {
    html += `<button onclick="renderExercisesTable(${currentPage + 1})">下一页</button>`;
  }
  
  container.innerHTML = html;
}

// 搜索题库
function searchExercises(keyword) {
  const exercises = ADMIN_DATA.exercises || [];
  const filtered = exercises.filter(e => 
    e.question?.toLowerCase().includes(keyword.toLowerCase()) ||
    e.id?.toLowerCase().includes(keyword.toLowerCase())
  );
  
  renderFilteredExercises(filtered);
}

// 按年级过滤
function filterByGrade(grade) {
  if (!grade) {
    renderExercisesTable(1);
    return;
  }
  
  const filtered = ADMIN_DATA.exercises.filter(e => e.grade == grade);
  renderFilteredExercises(filtered);
}

// 渲染过滤后的题库
function renderFilteredExercises(exercises) {
  const table = document.getElementById('exercises-table').querySelector('tbody');
  table.innerHTML = '';
  
  exercises.forEach(exercise => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exercise.id || '-'}</td>
      <td>${exercise.grade}年级${exercise.semester || ''}</td>
      <td>${exercise.type || '-'}</td>
      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${exercise.question || '-'}</td>
      <td>
        <span class="status-badge ${getDifficultyClass(exercise.difficulty)}">${getDifficultyLabel(exercise.difficulty)}</span>
      </td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="editExercise('${exercise.id}')">编辑</button>
        <button class="btn btn-danger" style="padding: 4px 10px; font-size: 12px; margin-left: 5px;" onclick="deleteExercise('${exercise.id}')">删除</button>
      </td>
    `;
    table.appendChild(row);
  });
  
  document.getElementById('exercises-pagination').innerHTML = '';
}

// 词汇搜索
function searchVocabulary(keyword) {
  const vocab = ADMIN_DATA.vocabulary;
  const results = [];
  
  ['同义词', '反义词'].forEach(type => {
    if (vocab[type]) {
      ['单字', '词语'].forEach(key => {
        if (vocab[type][key] && Array.isArray(vocab[type][key])) {
          vocab[type][key].forEach(item => {
            if (item && (item['词A']?.includes(keyword) || item['词B']?.includes(keyword))) {
              results.push({ wordA: item['词A'], wordB: item['词B'], type: type, grade: item['年级'] });
            }
          });
        }
      });
    }
  });
  
  if (vocab['成语'] && Array.isArray(vocab['成语'])) {
    vocab['成语'].forEach(item => {
      if (item && item.成语?.includes(keyword)) {
        results.push({ wordA: item.成语, wordB: item.释义, type: '成语', grade: item['年级'] });
      }
    });
  }
  
  renderVocabularyTable(results);
}

// 按类型过滤词汇
function filterVocabularyByType(type) {
  if (!type) {
    renderVocabularyTable();
    return;
  }
  
  const vocab = ADMIN_DATA.vocabulary;
  const results = [];
  const typeMap = { 'synonym': '同义词', 'antonym': '反义词', 'idiom': '成语' };
  const chineseType = typeMap[type];
  
  if (chineseType === '同义词' || chineseType === '反义词') {
    ['单字', '词语'].forEach(key => {
      if (vocab[chineseType]?.[key]) {
        vocab[chineseType][key].forEach(item => {
          if (item) {
            results.push({ wordA: item['词A'], wordB: item['词B'], type: chineseType, grade: item['年级'] });
          }
        });
      }
    });
  } else if (chineseType === '成语') {
    vocab['成语']?.forEach(item => {
      if (item) {
        results.push({ wordA: item.成语, wordB: item.释义, type: '成语', grade: item['年级'] });
      }
    });
  }
  
  renderVocabularyTable(results);
}

// 渲染词汇表格
function renderVocabularyTable(data = null) {
  const table = document.getElementById('vocabulary-table').querySelector('tbody');
  table.innerHTML = '';
  
  let results = [];
  
  if (data) {
    results = data;
  } else {
    const vocab = ADMIN_DATA.vocabulary;
    
    ['同义词', '反义词'].forEach(type => {
      ['单字', '词语'].forEach(key => {
        if (vocab[type]?.[key]) {
          vocab[type][key].forEach(item => {
            if (item && item['词A'] && item['词B']) {
              results.push({ wordA: item['词A'], wordB: item['词B'], type: type, grade: item['年级'] });
            }
          });
        }
      });
    });
    
    if (vocab['成语']) {
      vocab['成语'].forEach(item => {
        if (item) {
          results.push({ wordA: item.成语, wordB: item.释义, type: '成语', grade: item['年级'] });
        }
      });
    }
  }
  
  results.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.wordA || '-'}</td>
      <td>${item.wordB || '-'}</td>
      <td>${item.type || '-'}</td>
      <td>${item.grade || '-'}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;">编辑</button>
        <button class="btn btn-danger" style="padding: 4px 10px; font-size: 12px; margin-left: 5px;">删除</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// 搜索语法
function searchGrammar(keyword) {
  const grammar = ADMIN_DATA.grammar;
  const results = [];
  
  Object.keys(grammar).forEach(key => {
    if (key !== '_meta' && grammar[key]) {
      if (Array.isArray(grammar[key])) {
        grammar[key].forEach(item => {
          if (item && (item.name?.includes(keyword) || item.名称?.includes(keyword))) {
            results.push({ name: item.name || item.名称, category: key, grade: item['适用年级'] });
          }
        });
      } else if (typeof grammar[key] === 'object') {
        Object.keys(grammar[key]).forEach(k => {
          if (grammar[key][k] && Array.isArray(grammar[key][k])) {
            grammar[key][k].forEach(item => {
              if (item && (item.name?.includes(keyword) || item.名称?.includes(keyword))) {
                results.push({ name: item.name || item.名称, category: key, grade: item['适用年级'] });
              }
            });
          }
        });
      }
    }
  });
  
  renderGrammarTable(results);
}

// 渲染语法表格
function renderGrammarTable(data = null) {
  const table = document.getElementById('grammar-table').querySelector('tbody');
  table.innerHTML = '';
  
  let results = [];
  
  if (data) {
    results = data;
  } else {
    const grammar = ADMIN_DATA.grammar;
    
    Object.keys(grammar).forEach(key => {
      if (key !== '_meta' && grammar[key]) {
        if (Array.isArray(grammar[key])) {
          grammar[key].forEach(item => {
            if (item) {
              results.push({ name: item.name || item.名称, category: key, grade: item['适用年级'] });
            }
          });
        } else if (typeof grammar[key] === 'object') {
          Object.keys(grammar[key]).forEach(k => {
            if (grammar[key][k] && Array.isArray(grammar[key][k])) {
              grammar[key][k].forEach(item => {
                if (item) {
                  results.push({ name: item.name || item.名称, category: key, grade: item['适用年级'] });
                }
              });
            }
          });
        }
      }
    });
  }
  
  results.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name || '-'}</td>
      <td>${item.category || '-'}</td>
      <td>${item.grade || '-'}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;">编辑</button>
        <button class="btn btn-danger" style="padding: 4px 10px; font-size: 12px; margin-left: 5px;">删除</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// 渲染范文表格
function renderEssaysTable() {
  const table = document.getElementById('essays-table').querySelector('tbody');
  table.innerHTML = '';
  
  const essays = ADMIN_DATA.essays?.['作文类型'] || [];
  
  essays.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.type || item.类型 || '-'}</td>
      <td>${item.description || item.说明 || '-'}</td>
      <td>${item.grade || '-'}</td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;">编辑</button>
        <button class="btn btn-danger" style="padding: 4px 10px; font-size: 12px; margin-left: 5px;">删除</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// 打开题目编辑模态框
function openExerciseModal() {
  document.getElementById('exercise-modal-title').textContent = '新增题目';
  document.getElementById('exercise-form').reset();
  document.getElementById('exercise-modal').classList.add('active');
}

// 编辑题目
function editExercise(id) {
  const exercise = ADMIN_DATA.exercises.find(e => e.id === id);
  if (!exercise) return;
  
  document.getElementById('exercise-modal-title').textContent = '编辑题目';
  const form = document.getElementById('exercise-form');
  form.grade.value = exercise.grade;
  form.semester.value = exercise.semester || '上';
  form.type.value = exercise.type || '拼音认读';
  form.difficulty.value = exercise.difficulty || 'basic';
  form.time.value = exercise.time || 5;
  form.question.value = exercise.question || '';
  form.answer.value = exercise.answer || '';
  form.analysis.value = exercise.analysis || '';
  form.id.value = id;
  
  document.getElementById('exercise-modal').classList.add('active');
}

// 保存题目
function saveExercise() {
  const form = document.getElementById('exercise-form');
  const data = {
    grade: parseInt(form.grade.value),
    semester: form.semester.value,
    type: form.type.value,
    difficulty: form.difficulty.value,
    time: parseInt(form.time.value),
    question: form.question.value,
    answer: form.answer.value,
    analysis: form.analysis.value,
    id: form.id.value || generateId()
  };
  
  if (!form.id.value) {
    // 新增
    ADMIN_DATA.exercises.push(data);
  } else {
    // 编辑
    const index = ADMIN_DATA.exercises.findIndex(e => e.id === data.id);
    if (index !== -1) {
      ADMIN_DATA.exercises[index] = data;
    }
  }
  
  saveJsonData('data/exercises.json', ADMIN_DATA.exercises);
  closeModal('exercise-modal');
  renderExercisesTable(1);
  renderDashboard();
  alert('保存成功！');
}

// 删除题目
function deleteExercise(id) {
  if (!confirm('确定要删除这道题目吗？')) return;
  
  ADMIN_DATA.exercises = ADMIN_DATA.exercises.filter(e => e.id !== id);
  saveJsonData('data/exercises.json', ADMIN_DATA.exercises);
  renderExercisesTable(1);
  renderDashboard();
  alert('删除成功！');
}

// 生成唯一ID
function generateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `g${Math.floor(Math.random() * 6) + 1}_${timestamp}${random}`;
}

// 打开词汇编辑模态框
function openVocabularyModal() {
  document.getElementById('vocabulary-modal-title').textContent = '新增词汇';
  document.getElementById('vocabulary-form').reset();
  document.getElementById('vocabulary-modal').classList.add('active');
}

// 保存词汇
function saveVocabulary() {
  const form = document.getElementById('vocabulary-form');
  const typeMap = { 'synonym': '同义词', 'antonym': '反义词', 'idiom': '成语' };
  const chineseType = typeMap[form.type.value];
  const grade = parseInt(form.grade.value);
  
  const item = {
    '词A': form.wordA.value,
    '词B': form.wordB.value,
    '年级': grade
  };
  
  if (!ADMIN_DATA.vocabulary[chineseType]) {
    ADMIN_DATA.vocabulary[chineseType] = { '词语': [] };
  }
  
  if (!ADMIN_DATA.vocabulary[chineseType]['词语']) {
    ADMIN_DATA.vocabulary[chineseType]['词语'] = [];
  }
  
  ADMIN_DATA.vocabulary[chineseType]['词语'].push(item);
  saveJsonData('data/vocabulary.json', ADMIN_DATA.vocabulary);
  closeModal('vocabulary-modal');
  renderVocabularyTable();
  renderDashboard();
  alert('保存成功！');
}

// 打开语法编辑模态框
function openGrammarModal() {
  document.getElementById('grammar-modal-title').textContent = '新增语法知识点';
  document.getElementById('grammar-form').reset();
  document.getElementById('grammar-modal').classList.add('active');
}

// 保存语法
function saveGrammar() {
  const form = document.getElementById('grammar-form');
  const categoryMap = { '词性': '词性', '修辞': '修辞', '句式': '句式变换' };
  const chineseCategory = categoryMap[form.category.value];
  
  const item = {
    '名称': form.name.value,
    '定义': form.definition.value,
    '适用年级': parseInt(form.grade.value),
    '例子': form.examples.value ? form.examples.value.split(/[,，]/).map(e => e.trim()) : []
  };
  
  if (!ADMIN_DATA.grammar[chineseCategory]) {
    ADMIN_DATA.grammar[chineseCategory] = [];
  }
  
  ADMIN_DATA.grammar[chineseCategory].push(item);
  saveJsonData('data/grammar.json', ADMIN_DATA.grammar);
  closeModal('grammar-modal');
  renderGrammarTable();
  renderDashboard();
  alert('保存成功！');
}

// 打开范文编辑模态框
function openEssayModal() {
  document.getElementById('essay-modal-title').textContent = '新增作文类型';
  document.getElementById('essay-form').reset();
  document.getElementById('essay-modal').classList.add('active');
}

// 保存范文类型
function saveEssay() {
  const form = document.getElementById('essay-form');
  const item = {
    '类型': form.type.value,
    '说明': form.description.value,
    '年级': form.grade.value
  };
  
  if (!ADMIN_DATA.essays['作文类型']) {
    ADMIN_DATA.essays['作文类型'] = [];
  }
  
  ADMIN_DATA.essays['作文类型'].push(item);
  saveJsonData('data/model-essays.json', ADMIN_DATA.essays);
  closeModal('essay-modal');
  renderEssaysTable();
  renderDashboard();
  alert('保存成功！');
}

// 关闭模态框
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// 下载导入模板
function downloadTemplate(type) {
  let content = '';
  
  if (type === 'exercises') {
    content = 'id,grade,semester,type,difficulty,time,question,answer,analysis\n';
    content += 'g1_001,1,上,拼音认读,basic,5,"给下列汉字注音：小明","xiǎo míng","声母：x、m；韵母：iǎo、íng"\n';
    content += 'g2_001,2,上,识字写字,basic,5,"写出下列字的笔画顺序：大","横、撇、捺","先横后撇再捺"\n';
  } else if (type === 'vocabulary') {
    content = 'wordA,wordB,type,grade\n';
    content += '开心,快乐,synonym,1\n';
    content += '大,小,antonym,1\n';
    content += '一心一意,专心致志,idiom,3\n';
  }
  
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${type}_template.csv`;
  link.click();
}

// 上传区域点击处理
function setupUploadHandlers() {
  const exercisesUpload = document.getElementById('exercises-upload');
  const exercisesFile = document.getElementById('exercises-file');
  
  exercisesUpload.addEventListener('click', () => exercisesFile.click());
  exercisesUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    exercisesUpload.classList.add('dragover');
  });
  exercisesUpload.addEventListener('dragleave', () => {
    exercisesUpload.classList.remove('dragover');
  });
  exercisesUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    exercisesUpload.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    handleFileUpload(file, 'exercises');
  });
  
  exercisesFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, 'exercises');
  });
  
  // 词汇上传
  const vocabularyUpload = document.getElementById('vocabulary-upload');
  const vocabularyFile = document.getElementById('vocabulary-file');
  
  vocabularyUpload.addEventListener('click', () => vocabularyFile.click());
  vocabularyUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    vocabularyUpload.classList.add('dragover');
  });
  vocabularyUpload.addEventListener('dragleave', () => {
    vocabularyUpload.classList.remove('dragover');
  });
  vocabularyUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    vocabularyUpload.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    handleFileUpload(file, 'vocabulary');
  });
  
  vocabularyFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, 'vocabulary');
  });
}

// 处理文件上传
function handleFileUpload(file, type) {
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      let data;
      
      if (file.name.endsWith('.json')) {
        data = JSON.parse(e.target.result);
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(e.target.result);
      }
      
      if (type === 'exercises') {
        importExercises(data);
      } else if (type === 'vocabulary') {
        importVocabulary(data);
      }
      
      alert(`成功导入 ${data.length} 条数据！`);
    } catch (err) {
      console.error('解析文件失败:', err);
      alert('解析文件失败，请检查文件格式');
    }
  };
  
  reader.readAsText(file);
}

// 解析CSV
function parseCSV(csv) {
  const lines = csv.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    results.push(obj);
  }
  
  return results;
}

// 解析CSV行（处理带引号的字段）
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && line[i+1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// 导入题库
function importExercises(data) {
  if (!Array.isArray(data)) return;
  
  data.forEach(item => {
    const exercise = {
      id: item.id || generateId(),
      grade: parseInt(item.grade),
      semester: item.semester || '上',
      type: item.type || '拼音认读',
      difficulty: item.difficulty || 'basic',
      time: parseInt(item.time) || 5,
      question: item.question || '',
      answer: item.answer || '',
      analysis: item.analysis || ''
    };
    
    ADMIN_DATA.exercises.push(exercise);
  });
  
  saveJsonData('data/exercises.json', ADMIN_DATA.exercises);
  renderExercisesTable(1);
  renderDashboard();
}

// 导入词汇
function importVocabulary(data) {
  if (!Array.isArray(data)) return;
  
  data.forEach(item => {
    const typeMap = { 'synonym': '同义词', 'antonym': '反义词', 'idiom': '成语' };
    const chineseType = typeMap[item.type] || '同义词';
    const grade = parseInt(item.grade) || 1;
    
    if (!ADMIN_DATA.vocabulary[chineseType]) {
      ADMIN_DATA.vocabulary[chineseType] = { '词语': [] };
    }
    
    ADMIN_DATA.vocabulary[chineseType]['词语'].push({
      '词A': item.wordA || '',
      '词B': item.wordB || '',
      '年级': grade
    });
  });
  
  saveJsonData('data/vocabulary.json', ADMIN_DATA.vocabulary);
  renderVocabularyTable();
  renderDashboard();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initAdmin();
  setupUploadHandlers();
});