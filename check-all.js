#!/usr/bin/env node

/**
 * 语文成长地图 — 项目验证脚本
 *
 * 用法：
 *   node check-all.js js     检查 JS 语法
 *   node check-all.js links  检查 HTML 资源引用完整性
 *   node check-all.js sw     检查 service-worker 缓存列表完整性
 *   node check-all.js analysis 检查题库解析分级完整性
 *   node check-all.js         默认跑全部
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HTML_DIR = ROOT;
const DATA_DIR = path.join(ROOT, 'data');

let errors = 0;

function log(ok, msg) {
  const icon = ok ? '  PASS' : '  FAIL';
  console.log(`${icon}  ${msg}`);
  if (!ok) errors++;
}

// 统一使用 Unix 风格路径分隔符
function toUnixPath(p) {
  return p.replace(/\\/g, '/');
}

// ── 工具函数 ──────────────────────────────────────────────
function listHtmlFiles() {
  return fs.readdirSync(HTML_DIR)
    .filter(f => f.endsWith('.html'));
}

function listJsFiles() {
  const rootJs = fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.js') && f !== 'check-all.js' && f !== 'service-worker.js');
  const dataJs = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.js'))
    .map(f => 'data/' + f);
  return [...rootJs, ...dataJs];
}

// ── 1. JS 语法检查 ───────────────────────────────────────
function checkJsSyntax() {
  console.log('\n=== 1. JS 语法检查 ===');

  for (const file of listJsFiles()) {
    const fullPath = path.join(ROOT, file);
    try {
      const code = fs.readFileSync(fullPath, 'utf8');
      // node --check 等价：用 vm 模块做语法解析
      try {
        new (require('vm').Script)(code, { filename: fullPath });
        log(true, file);
      } catch (e) {
        log(false, `${file} — 语法错误: ${e.message.split('\n')[0]}`);
      }
    } catch (e) {
      log(false, `${file} — 无法读取: ${e.message}`);
    }
  }
}

// ── 2. HTML 资源引用完整性 ───────────────────────────────
function checkLinks() {
  console.log('\n=== 2. HTML 资源引用检查 ===');

  // 收集项目中实际存在的所有文件
  const existingFiles = new Set();
  function collectFiles(dir, prefix) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        collectFiles(path.join(dir, entry.name), rel);
      } else {
        if (!rel.includes('node_modules')) {
          existingFiles.add('./' + toUnixPath(rel));
        }
      }
    }
  }
  collectFiles(ROOT, '');

  // 检查每个 HTML 的引用 —— 仅检查真正的资源引用
  for (const htmlFile of listHtmlFiles()) {
    let rawContent = fs.readFileSync(path.join(ROOT, htmlFile), 'utf8');

    // 移除 <script>...</script> 代码块中的内容，避免误匹配 JS 字符串中的路径
    let content = rawContent.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

    let pageOk = true;

    // 只匹配资源类标签的属性：
    //   <link href="...">  — 样式表
    //   <script src="...">  — 脚本
    //   <img src="...">  — 图片
    //   导航 <a href="...">  — 内部页面链接
    const patterns = [
      { re: /<link\b[^>]*?href="([^"]+)"/gi,  type: 'css' },
      { re: /<script\b[^>]*?src="([^"]+)"/gi, type: 'js' },
      { re: /<img\b[^>]*?src="([^"]+)"/gi,    type: 'img' },
      { re: /<a\b[^>]*?href="([^"]+)"/gi,     type: 'nav' },
    ];

    for (const { re, type } of patterns) {
      let m;
      while ((m = re.exec(content)) !== null) {
        let ref = m[1].trim();
        // 跳过外部链接、锚点、协议类
        if (/^(https?:|\/\/|#|mailto:|data:|tel:|javascript:)/i.test(ref)) continue;
        if (ref.includes('{{') || ref.includes('}}')) continue;
        if (ref === '' || ref === '/') continue;

        // 规范化：去掉查询参数和 hash
        const cleanRef = ref.split('?')[0].split('#')[0];

        // 构造相对路径
        const relativePath = cleanRef.startsWith('./') ? cleanRef :
                             cleanRef.startsWith('/') ? '.' + cleanRef :
                             './' + cleanRef;

        if (!existingFiles.has(relativePath)) {
          log(false, `${htmlFile} → ${ref} (${type}) 文件不存在`);
          pageOk = false;
        }
      }
    }

    if (pageOk) log(true, htmlFile);
  }
}

// ── 3. Service Worker 缓存检查 ───────────────────────────
function checkServiceWorker() {
  console.log('\n=== 3. Service Worker 缓存检查 ===');

  const swFile = path.join(ROOT, 'service-worker.js');
  if (!fs.existsSync(swFile)) {
    log(false, 'service-worker.js 不存在');
    return;
  }

  let swContent;
  try {
    swContent = fs.readFileSync(swFile, 'utf8');
  } catch (e) {
    log(false, `无法读取 service-worker.js: ${e.message}`);
    return;
  }

  // 检查是否有硬编码版本号
  const verMatch = swContent.match(/CACHE_VERSION\s*=\s*(\d+)/);
  if (verMatch) {
    log(true, `缓存版本号: v${verMatch[1]}`);
  } else {
    log(false, '未找到 CACHE_VERSION 定义');
  }

  // 提取 PRECACHE 数组中的文件
  const precacheMatch = swContent.match(/const PRECACHE = \[([\s\S]*?)\];/);
  if (!precacheMatch) {
    log(false, '未找到 PRECACHE 数组');
    return;
  }

  const entries = precacheMatch[1]
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith("'./"))
    .map(l => l.replace(/^'/, '').replace(/',?$/, ''));

  // 收集项目实际存在的文件
  const existingFiles = new Set();
  function collectFiles(dir, prefix) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (!['node_modules', '.git'].includes(entry.name)) {
          collectFiles(path.join(dir, entry.name), rel);
        }
      } else {
        existingFiles.add('./' + toUnixPath(rel));
      }
    }
  }
  collectFiles(ROOT, '');

  // 检查 PRECACHE 中的文件
  for (const entry of entries) {
    const normalized = entry.startsWith('./') ? entry : './' + entry;
    if (existingFiles.has(normalized)) {
      // 已存在，跳过详细输出
    } else {
      log(false, `SW precache 缺失: ${entry}`);
    }
  }

  // 检查关键 JS 是否在 PRECACHE 中（仅提示，不算错误）
  const criticalJs = listJsFiles().map(f => './' + f);
  const missingFromPrecache = criticalJs.filter(js => !precacheMatch[1].includes(js));
  if (missingFromPrecache.length > 0) {
    console.log(`   (runtime 缓存的 JS: ${missingFromPrecache.join(', ')})`);
  }

  log(true, `PRECACHE 包含 ${entries.length} 个文件`);
}

function normalizeAnalysisText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, '')
    .replace(/[，。！？、；：“”‘’（）()《》【】\[\]{}.,!?;:'"`~·\-—_]/g, '');
}

function bigramSimilarity(a, b) {
  const left = normalizeAnalysisText(a);
  const right = normalizeAnalysisText(b);
  if (!left || !right) return 0;
  if (Math.min(left.length, right.length) < 8) return 0;

  function toBigrams(text) {
    const grams = new Set();
    for (let i = 0; i < text.length - 1; i++) grams.add(text.slice(i, i + 2));
    return grams;
  }

  const leftSet = toBigrams(left);
  const rightSet = toBigrams(right);
  const union = new Set([...leftSet, ...rightSet]);
  let intersection = 0;
  leftSet.forEach(gram => {
    if (rightSet.has(gram)) intersection++;
  });
  return union.size ? intersection / union.size : 0;
}

function hasParentFollowUp(value) {
  const text = String(value || '');
  return /追问|问孩子|再问|提问|问他|问一问|想想|想一想|说说|说一说|为什么|哪|谁|什么|怎么|是否|是不是|能不能|有没有|圈出|找出/.test(text);
}

function isSpecificPracticeTask(value) {
  const text = String(value || '').trim();
  const compact = normalizeAnalysisText(text);
  if (compact.length < 10) return false;
  if (/^(继续)?(多)?(练习|复习|巩固|做题|做同类题)(一下|一遍|几道题)?$/.test(compact)) return false;
  if (/同类题|类似题|继续练|多练习/.test(text) && compact.length < 18) return false;
  return /写|读|找|圈|改|列|分析|概括|赏析|扩写|缩句|标|区分|观察|给|按|用|以|把|完成|至少|\d|[“《（]/.test(text);
}

// ── 4. 题库解析分级完整性检查 ─────────────────────────────
function checkExerciseAnalysis() {
  console.log('\n=== 4. 题库解析分级检查 ===');

  const file = path.join(DATA_DIR, 'exercises.json');
  if (!fs.existsSync(file)) {
    log(false, 'data/exercises.json 不存在');
    return;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    log(false, `data/exercises.json JSON 解析失败: ${e.message}`);
    return;
  }

  const items = data['题库'];
  if (!Array.isArray(items)) {
    log(false, 'data/exercises.json 缺少数组字段：题库');
    return;
  }

  const meta = data._meta || {};
  if (meta.itemCount !== items.length) {
    log(false, `_meta.itemCount=${meta.itemCount} 与题库数量 ${items.length} 不一致`);
  } else {
    log(true, `题库数量: ${items.length}`);
  }

  const requiredFields = meta.analysisFields || [
    '标准答案',
    '解题思路',
    '易错点',
    '低分示例',
    '满分表达',
    '家长讲解话术',
    '复练任务'
  ];

  let covered = 0;
  let qualityChecked = 0;
  items.forEach((item, index) => {
    const label = item.id || `第${index + 1}题`;
    const analysis = item['解析分级'];
    if (!analysis || typeof analysis !== 'object') {
      log(false, `${label} 缺少 解析分级`);
      return;
    }

    covered++;
    requiredFields.forEach(field => {
      const value = analysis[field];
      const ok = Array.isArray(value)
        ? value.length > 0 && value.every(v => String(v || '').trim())
        : String(value || '').trim().length > 0;
      if (!ok) {
        log(false, `${label} 解析分级缺少或为空: ${field}`);
      }
    });

    qualityChecked++;
    const lowScore = analysis['低分示例'];
    const fullScore = analysis['满分表达'];
    const similarity = bigramSimilarity(lowScore, fullScore);
    if (similarity >= 0.82) {
      log(false, `${label} 低分示例与满分表达太像，相似度 ${(similarity * 100).toFixed(0)}%`);
    }

    if (!hasParentFollowUp(analysis['家长讲解话术'])) {
      log(false, `${label} 家长讲解话术缺少追问/引导提问`);
    }

    if (!isSpecificPracticeTask(analysis['复练任务'])) {
      log(false, `${label} 复练任务过空泛，需要具体动作、材料或产出`);
    }
  });

  const coverage = items.length ? Math.round((covered / items.length) * 100) : 0;
  if (coverage !== 100) {
    log(false, `解析分级覆盖率 ${coverage}% (${covered}/${items.length})`);
  } else {
    log(true, `解析分级覆盖率 100% (${covered}/${items.length})`);
  }

  if (meta.analysisCoverage && meta.analysisCoverage !== `${coverage}%`) {
    log(false, `_meta.analysisCoverage=${meta.analysisCoverage} 与实际 ${coverage}% 不一致`);
  } else if (meta.analysisCoverage) {
    log(true, `元数据覆盖率: ${meta.analysisCoverage}`);
  }

  if (qualityChecked === items.length) {
    log(true, `解析质量规则: 已检查 ${qualityChecked} 题`);
  }
}

// ── 主入口 ────────────────────────────────────────────────
const mode = process.argv[2] || 'all';

if (mode === 'js' || mode === 'all') checkJsSyntax();
if (mode === 'links' || mode === 'all') checkLinks();
if (mode === 'sw' || mode === 'all') checkServiceWorker();
if (mode === 'analysis' || mode === 'all') checkExerciseAnalysis();

if (errors > 0) {
  console.log(`\n⚠  发现 ${errors} 个问题`);
  process.exit(1);
} else {
  console.log('\n✓  全部检查通过');
}
