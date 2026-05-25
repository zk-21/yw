/**
 * 浮层页面导航 TOC
 * 自动扫描页面中带 id 的 section，生成快速导航
 * 用法：<script defer src="page-toc.js?v=90"></script>
 */
(function() {
  'use strict';

  // 要忽略的 id（非内容区导航元素）
  var SKIP_IDS = ['top', 'taskList', 'quiz-options', 'quiz-container', 'quiz-feedback',
    'quiz-restart-btn', 'quiz-next-btn', 'hero-search-input', 'hero-search-btn',
    'searchInput', 'searchBtn', 'hw-filter-bar'];

  // 自定义标签映射：id → 简短标签
  var LABEL_MAP = {
    'diagnosis': '🧪 诊断测评',
    'layer-learning': '📊 分层学习',
    'top-student-zone': '🏆 尖子生通道',
    'avg-student-zone': '📚 中等生通道',
    'learning-path-viz': '📈 成长路线',
    'reward-system': '🎖️ 激励机制',
    'stage-assessment': '📝 阶段测评',
    'error-masterclass': '🔍 错因精讲',
    'dual-track-system': '🔄 双轨训练',
    'master-peak-training': '⛰️ 拔尖训练',
    'pack-r1': '📦 R1:概括',
    'pack-r2': '📦 R2:依据',
    'pack-r3': '📦 R3:赏析',
    'pack-r4': '📦 R4:材料',
    'pack-w1': '📦 W1:写话',
    'pack-w2': '📦 W2:重点段',
    'pack-w3': '📦 W3:审题',
    'pack-c1': '📦 C1:综合',
    'c-paper-materials': '📄 C卷材料',
    'thickening-training': '💪 补厚训练',
    'extended-knowledge': '📖 扩展知识',
    'peak-track': '🚀 尖子方案',
    'improve-track': '📈 提分方案',
    'grammar-db-quick': '📦 语法索引',
    'hw-collection-grid': '✍️ 作业题库'
  };

  // 收集所有待导航的 section
  function collectSections() {
    var sections = [];
    var seen = {};

    // 优先查找独立的 section[id] 元素
    document.querySelectorAll('section[id]').forEach(function(el) {
      if (SKIP_IDS.indexOf(el.id) >= 0) return;
      if (seen[el.id]) return;
      seen[el.id] = true;

      // 提取标题
      var title = '';
      var h = el.querySelector('h1,h2,h3');
      if (h) {
        title = h.textContent.trim();
        // 截断过长的标题
        if (title.length > 20) title = title.substring(0, 18) + '…';
      }
      if (!title && LABEL_MAP[el.id]) title = LABEL_MAP[el.id];
      if (!title) title = el.id.replace(/-/g, ' ');

      sections.push({ id: el.id, title: title, el: el });
    });

    // 补充有 id 的 div 容器（如分流训练包、双轨辅导等独立模块）
    var extraSelectors = [
      'div[id^="pack-"]',          // 分流训练包
      'div[id="c-paper-materials"]',
      'div[id="thickening-training"]',
      'div[id="extended-knowledge"]',
      'div[id="peak-track"]',
      'div[id="improve-track"]',
      'div[id="grammar-db-quick"]'
    ];
    extraSelectors.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) {
          if (SKIP_IDS.indexOf(el.id) >= 0) return;
          if (seen[el.id]) return;
          seen[el.id] = true;
          var title = LABEL_MAP[el.id] || el.id.replace(/-/g, ' ');
          sections.push({ id: el.id, title: title, el: el });
        });
      } catch(e) {}
    });

    return sections;
  }

  // 构建 TOC DOM
  function buildTOC(sections) {
    if (sections.length < 3) return; // 太短的页面不需要 TOC

    var toc = document.createElement('nav');
    toc.className = 'page-toc';
    toc.setAttribute('aria-label', '页面快速导航');

    // 折叠/展开按钮
    var toggle = document.createElement('button');
    toggle.className = 'page-toc-toggle';
    toggle.textContent = '☰';
    toggle.setAttribute('aria-label', '展开页面导航');
    toggle.addEventListener('click', function() {
      var expanded = toc.classList.toggle('expanded');
      toggle.setAttribute('aria-label', expanded ? '收起页面导航' : '展开页面导航');
      toggle.textContent = expanded ? '✕' : '☰';
    });
    toc.appendChild(toggle);

    // 导航项列表
    var list = document.createElement('div');
    list.className = 'page-toc-list';

    sections.forEach(function(s) {
      var a = document.createElement('a');
      a.className = 'page-toc-item';
      a.href = '#' + s.id;
      a.textContent = s.title;
      a.title = s.title;
      // 点击后收起移动端的展开状态
      a.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          toc.classList.remove('expanded');
          toggle.textContent = '☰';
          toggle.setAttribute('aria-label', '展开页面导航');
        }
      });
      a.setAttribute('data-toc-id', s.id);
      list.appendChild(a);
    });

    toc.appendChild(list);
    document.body.appendChild(toc);
    return toc;
  }

  // 滚动时高亮当前 section
  function setupScrollSpy(sections, toc) {
    if (!toc) return;
    var items = toc.querySelectorAll('.page-toc-item');
    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          updateActive(sections, items);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function updateActive(sections, items) {
    var viewMiddle = window.innerHeight / 3;
    var current = sections[0] ? sections[0].id : '';

    for (var i = sections.length - 1; i >= 0; i--) {
      var rect = sections[i].el.getBoundingClientRect();
      if (rect.top <= viewMiddle) {
        current = sections[i].id;
        break;
      }
    }

    items.forEach(function(item) {
      if (item.getAttribute('data-toc-id') === current) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // 初始化
  function init() {
    // 不为主页显示 TOC
    if (document.querySelector('.dashboard-hero') && window.location.pathname.indexOf('practice') < 0) return;

    var sections = collectSections();
    var toc = buildTOC(sections);
    if (toc) {
      setupScrollSpy(sections, toc);
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 100);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, 100);
    });
  }
})();
