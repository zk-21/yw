(function () {
  'use strict';

  var SKIP_IDS = [
    'top',
    'taskList',
    'quiz-options',
    'quiz-container',
    'quiz-feedback',
    'quiz-restart-btn',
    'quiz-next-btn',
    'hero-search-input',
    'hero-search-btn',
    'searchInput',
    'searchBtn',
    'hw-filter-bar'
  ];

  var LABEL_MAP = {
    'diagnosis': '诊断测评',
    'layer-learning': '分层学习',
    'top-student-zone': '拔尖通道',
    'avg-student-zone': '提升通道',
    'learning-path-viz': '成长路线',
    'reward-system': '激励机制',
    'stage-assessment': '阶段测评',
    'error-masterclass': '错因精讲',
    'dual-track-system': '双轨训练',
    'master-peak-training': '拔尖训练',
    'c-paper-materials': 'C 卷材料',
    'thickening-training': '补厚训练',
    'extended-knowledge': '扩展知识',
    'peak-track': '拔尖方案',
    'improve-track': '提分方案',
    'grammar-db-quick': '语法索引',
    'hw-collection-grid': '作业题库'
  };

  function collectSections() {
    var sections = [];
    var seen = {};

    document.querySelectorAll('section[id], div[id], article[id]').forEach(function (el) {
      if (!el.id || SKIP_IDS.indexOf(el.id) !== -1 || seen[el.id]) return;
      if (!shouldInclude(el)) return;

      seen[el.id] = true;
      sections.push({
        id: el.id,
        title: getSectionTitle(el),
        el: el
      });
    });

    return sections;
  }

  function shouldInclude(el) {
    if (!el || !el.id) return false;
    if (/^pack-/.test(el.id)) return true;
    if (LABEL_MAP[el.id]) return true;
    if (el.tagName === 'SECTION' || el.tagName === 'ARTICLE') return true;
    return !!el.querySelector('h1, h2, h3');
  }

  function getSectionTitle(el) {
    var heading = el.querySelector('h1, h2, h3');
    var title = heading ? heading.textContent.trim() : '';
    if (!title) title = LABEL_MAP[el.id] || el.id.replace(/-/g, ' ');
    title = title.replace(/\s+/g, ' ').trim();
    if (title.length > 20) title = title.slice(0, 20) + '...';
    return title;
  }

  function buildTOC(sections) {
    if (sections.length < 3) return null;

    var toc = document.createElement('nav');
    toc.className = 'page-toc';
    toc.setAttribute('aria-label', '页面快速导航');

    var toggle = document.createElement('button');
    toggle.className = 'page-toc-toggle';
    toggle.type = 'button';
    toggle.textContent = '目录';
    toggle.setAttribute('aria-label', '展开页面导航');
    toggle.addEventListener('click', function () {
      var expanded = toc.classList.toggle('expanded');
      toggle.textContent = expanded ? '收起' : '目录';
      toggle.setAttribute('aria-label', expanded ? '收起页面导航' : '展开页面导航');
    });

    var list = document.createElement('div');
    list.className = 'page-toc-list';

    sections.forEach(function (section) {
      var link = document.createElement('a');
      link.className = 'page-toc-item';
      link.href = '#' + section.id;
      link.textContent = section.title;
      link.title = section.title;
      link.setAttribute('data-toc-id', section.id);
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          toc.classList.remove('expanded');
          toggle.textContent = '目录';
          toggle.setAttribute('aria-label', '展开页面导航');
        }
      });
      list.appendChild(link);
    });

    toc.appendChild(toggle);
    toc.appendChild(list);
    document.body.appendChild(toc);
    return toc;
  }

  function setupScrollSpy(sections, toc) {
    if (!toc) return;
    var items = toc.querySelectorAll('.page-toc-item');
    var ticking = false;

    function update() {
      var current = sections[0] ? sections[0].id : '';
      var threshold = window.innerHeight / 3;

      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.getBoundingClientRect().top <= threshold) {
          current = sections[i].id;
          break;
        }
      }

      items.forEach(function (item) {
        item.classList.toggle('active', item.getAttribute('data-toc-id') === current);
      });
    }

    update();
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }, { passive: true });
  }

  function init() {
    if (document.querySelector('.dashboard-hero') && location.pathname.indexOf('practice') < 0) return;
    var sections = collectSections();
    var toc = buildTOC(sections);
    if (toc) setupScrollSpy(sections, toc);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
