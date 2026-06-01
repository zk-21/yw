(function () {
  'use strict';

  function bindHeroSearch() {
    var input = document.getElementById('hero-search-input');
    var button = document.getElementById('hero-search-btn');
    if (!input || !button) return;

    function submitSearch() {
      var query = input.value.trim();
      if (query) {
        window.location.href = 'search.html?q=' + encodeURIComponent(query);
      }
    }

    button.addEventListener('click', submitSearch);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        submitSearch();
      }
    });
  }

  function initDailyTasks() {
    var taskList = document.getElementById('taskList');
    if (!taskList) return;

    try {
      var savedTasks = localStorage.getItem('dailyTasks');
      if (savedTasks) {
        var tasks = JSON.parse(savedTasks);
        taskList.querySelectorAll('.task-item').forEach(function (item, index) {
          if (!tasks[index]) return;
          var checkbox = item.querySelector('.task-checkbox');
          var taskText = item.querySelector('.task-text');
          if (checkbox) checkbox.classList.add('completed');
          if (taskText) taskText.classList.add('completed');
        });
      }
    } catch (e) {}

    taskList.addEventListener('click', function (event) {
      var btn = event.target.closest('.task-checkbox');
      if (!btn) return;
      var taskItem = btn.parentElement;
      var taskText = taskItem ? taskItem.querySelector('.task-text') : null;
      btn.classList.toggle('completed');
      if (taskText) taskText.classList.toggle('completed');

      var state = Array.from(taskList.querySelectorAll('.task-item')).map(function (item) {
        var checkbox = item.querySelector('.task-checkbox');
        return checkbox ? checkbox.classList.contains('completed') : false;
      });
      localStorage.setItem('dailyTasks', JSON.stringify(state));
    });
  }

  function initLayerCards() {
    var container = document.querySelector('.layer-cards');
    if (!container) return;

    function goToLayer(card) {
      if (!card || !card.dataset.layer) return;
      var target = card.dataset.layer === 'top'
        ? 'practice.html#top-student-zone'
        : 'practice.html#avg-student-zone';
      window.location.href = target;
    }

    container.addEventListener('click', function (event) {
      goToLayer(event.target.closest('.layer-card'));
    });

    container.addEventListener('keydown', function (event) {
      var card = event.target.closest('.layer-card');
      if (!card || !card.dataset.layer) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      goToLayer(card);
    });
  }

  function animateCards() {
    var cards = document.querySelectorAll('.grade-panel, .mini-card, .plan-card');
    cards.forEach(function (card, index) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(function () {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });

    document.querySelectorAll('.grade-panel').forEach(function (panel) {
      panel.addEventListener('click', function () {
        panel.style.transform = 'scale(0.98)';
        setTimeout(function () {
          panel.style.transform = 'scale(1)';
        }, 100);
      });
    });
  }

  function getAssetVersion() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].getAttribute('src') || '';
      if (
        src.indexOf('nav.js') === -1 &&
        src.indexOf('table-responsive.js') === -1 &&
        src.indexOf('role-manager.js') === -1 &&
        src.indexOf('index-home-role.js') === -1 &&
        src.indexOf('index-home-core.js') === -1
      ) {
        continue;
      }
      var match = src.match(/[?&]v=([^&]+)/);
      if (match) return match[1];
    }
    return 'dev';
  }

  function initQuickDiagnosis() {
    var STORAGE_KEY = 'quickDiagnosis';
    var card = document.getElementById('qdCard');
    var stepsEl = document.getElementById('qdSteps');
    var choicesEl = document.getElementById('qdChoices');
    var resultEl = document.getElementById('qdResult');
    if (!card || !stepsEl || !choicesEl || !resultEl) return;

    var state = { grade: null, goal: null, time: null, step: 1 };

    function updateSteps() {
      stepsEl.querySelectorAll('.qd-step').forEach(function (step) {
        var stepNumber = parseInt(step.dataset.step, 10);
        step.classList.remove('active', 'done');
        if (stepNumber < state.step) step.classList.add('done');
        if (stepNumber === state.step) step.classList.add('active');
      });
    }

    function renderGradeChoices() {
      choicesEl.style.display = '';
      choicesEl.innerHTML =
        '<button class="qd-choice" data-val="1">一年级<span class="sub">拼音·识字</span></button>' +
        '<button class="qd-choice" data-val="2">二年级<span class="sub">字词·写话</span></button>' +
        '<button class="qd-choice" data-val="3">三年级<span class="sub">段落·作文</span></button>' +
        '<button class="qd-choice" data-val="4">四年级<span class="sub">概括·赏析</span></button>' +
        '<button class="qd-choice" data-val="5">五年级<span class="sub">分析·立意</span></button>' +
        '<button class="qd-choice" data-val="6">六年级<span class="sub">综合·冲刺</span></button>';
    }

    function renderGoalChoices() {
      choicesEl.innerHTML =
        '<button class="qd-choice" data-val="fill">📚 补弱<span class="sub">基础薄弱，需要巩固</span></button>' +
        '<button class="qd-choice" data-val="advance">🚀 拔高<span class="sub">成绩不错，挑战更难</span></button>' +
        '<button class="qd-choice" data-val="explore">🔍 综合了解<span class="sub">先看看整体情况</span></button>';
    }

    function renderTimeChoices() {
      choicesEl.innerHTML =
        '<button class="qd-choice" data-val="5">⚡ 5分钟<span class="sub">快速诊断</span></button>' +
        '<button class="qd-choice" data-val="15">⏱ 15分钟<span class="sub">标准训练</span></button>' +
        '<button class="qd-choice" data-val="30">📖 30分钟<span class="sub">深入学习</span></button>';
    }

    function saveState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function renderResult() {
      if (!state.grade || !state.goal || !state.time) return;

      choicesEl.style.display = 'none';
      resultEl.classList.add('show');
      card.classList.add('solved');

      var gradeUrl = 'grade' + state.grade + '.html';
      var paths;
      if (state.goal === 'fill') {
        paths = [
          { num: 1, cls: 'step1', text: '诊断定位：做一次' + (state.time >= 15 ? '完整' : '快速') + '诊断', url: 'practice.html#diagnosis' },
          { num: 2, cls: 'step2', text: '查看' + ['', '一', '二', '三', '四', '五', '六'][state.grade] + '年级薄弱点', url: gradeUrl },
          { num: 3, cls: 'step3', text: '针对性练习错题', url: 'practice.html#wrong-notebook' }
        ];
      } else if (state.goal === 'advance') {
        paths = [
          { num: 1, cls: 'step1', text: '查看年级拔尖重点', url: gradeUrl },
          { num: 2, cls: 'step2', text: '挑战进阶训练', url: 'practice.html#flow-training' },
          { num: 3, cls: 'step3', text: 'AI 一对一深度辅导', url: 'agent.html' }
        ];
      } else {
        paths = [
          { num: 1, cls: 'step1', text: '查看年级知识地图', url: gradeUrl },
          { num: 2, cls: 'step2', text: '浏览' + ['', '一', '二', '三', '四', '五', '六'][state.grade] + '年级课标要求', url: gradeUrl },
          { num: 3, cls: 'step3', text: '按兴趣选择专题学习', url: 'knowledge-map.html' }
        ];
      }

      var timeLabel = state.time >= 30 ? '30分钟深度学习' : state.time >= 15 ? '15分钟标准训练' : '5分钟快速诊断';
      var goalLabel = state.goal === 'fill' ? '补弱巩固' : state.goal === 'advance' ? '拔高冲刺' : '综合了解';

      resultEl.innerHTML =
        '<h4>✅ 已为你规划：' + goalLabel + ' · ' + timeLabel + '</h4>' +
        '<div class="qd-path">' + paths.map(function (path) {
          return '<a class="qd-path-item ' + path.cls + '" href="' + path.url + '">' +
            '<span class="qd-path-num">' + path.num + '</span>' +
            '<span>' + path.text + '</span>' +
            '</a>';
        }).join('') + '</div>' +
        '<div style="margin-top:10px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">' +
        '<a href="report.html" style="display:inline-flex;align-items:center;gap:4px;padding:6px 16px;background:#eef2ff;color:#4f46e5;border-radius:16px;text-decoration:none;font-size:13px;font-weight:600;">📊 查看学习报告</a>' +
        '<span class="qd-reset">🔄 重新选择</span>' +
        '</div>';

      updateSteps();
    }

    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.grade && saved.goal && saved.time) {
        state = saved;
        renderResult();
      }
    } catch (e) {}

    choicesEl.addEventListener('click', function (event) {
      var button = event.target.closest('.qd-choice');
      if (!button) return;
      var value = button.dataset.val;

      if (state.step === 1) {
        state.grade = value;
        state.step = 2;
        updateSteps();
        renderGoalChoices();
      } else if (state.step === 2) {
        state.goal = value;
        state.step = 3;
        updateSteps();
        renderTimeChoices();
      } else if (state.step === 3) {
        state.time = value;
        saveState();
        renderResult();
      }
    });

    resultEl.addEventListener('click', function (event) {
      if (!event.target.classList.contains('qd-reset')) return;
      state = { grade: null, goal: null, time: null, step: 1 };
      localStorage.removeItem(STORAGE_KEY);
      card.classList.remove('solved');
      resultEl.classList.remove('show');
      resultEl.innerHTML = '';
      renderGradeChoices();
      updateSteps();
    });
  }

  function initDataOverview() {
    var overviewGrid = document.getElementById('data-overview-grid');
    if (!overviewGrid) return;

    var overviewDataCache = {};
    var overviewDataLoads = {};
    var overviewDbs = [
      { name: 'grammar', label: '语法知识', icon: '📚' },
      { name: 'vocabulary', label: '词语学习', icon: '📖' },
      { name: 'exercises', label: '练习题库', icon: '✍️' },
      { name: 'literary-knowledge', label: '文学常识', icon: '📙' },
      { name: 'common-mistakes', label: '常见错误', icon: '⚠️' },
      { name: 'model-essays', label: '范文方法', icon: '🏆' },
      { name: 'grades', label: '年级元数据', icon: '🎯' }
    ];

    function escapeHTML(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function loadOverviewData(name) {
      if (overviewDataCache[name]) return Promise.resolve(overviewDataCache[name]);
      if (overviewDataLoads[name]) return overviewDataLoads[name];

      overviewDataLoads[name] = fetch('data/' + name + '.json?v=' + encodeURIComponent(getAssetVersion()))
        .then(function (response) {
          if (!response.ok) throw new Error('Failed to load ' + name);
          return response.json();
        })
        .then(function (data) {
          overviewDataCache[name] = data;
          delete overviewDataLoads[name];
          return data;
        })
        .catch(function () {
          delete overviewDataLoads[name];
          return null;
        });

      return overviewDataLoads[name];
    }

    function showOverviewPreview(db) {
      loadOverviewData(db.name).then(function (data) {
        if (!data) return;

        var meta = data._meta || {};
        var topKeys = Object.keys(data).filter(function (key) { return key !== '_meta'; }).slice(0, 10);
        var contentPreview = topKeys.map(function (key) {
          var value = data[key];
          if (Array.isArray(value)) {
            return '<span style="background:#f0f4ff;padding:2px 8px;border-radius:12px;margin:2px;display:inline-block;font-size:12px;">' +
              escapeHTML(key) + ' (' + value.length + ')</span>';
          }
          if (typeof value === 'object' && value !== null) {
            return '<span style="background:#fff3e0;padding:2px 8px;border-radius:12px;margin:2px;display:inline-block;font-size:12px;">' +
              escapeHTML(key) + ' (' + Object.keys(value).length + ')</span>';
          }
          return '';
        }).join(' ');

        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
        modal.addEventListener('click', function (event) {
          if (event.target === modal) modal.remove();
        });

        var content = document.createElement('div');
        content.style.cssText = 'background:white;border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;';
        content.innerHTML =
          '<h3 style="margin:0 0 8px;">' + escapeHTML(db.icon + ' ' + db.label) + '</h3>' +
          '<p style="color:#888;font-size:13px;margin:0 0 12px;">' + escapeHTML(meta.description || '') + '</p>' +
          '<p style="font-size:12px;color:#999;">Version: ' + escapeHTML(meta.version || '1.0') + ' | Updated: ' + escapeHTML(meta.lastUpdated || '') + '</p>' +
          '<div style="margin:12px 0;">' + contentPreview + '</div>' +
          '<button type="button" style="margin-top:12px;padding:8px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;">Close</button>';

        content.querySelector('button').addEventListener('click', function () {
          modal.remove();
        });
        modal.appendChild(content);
        document.body.appendChild(modal);
      });
    }

    function updateOverviewStat(db) {
      loadOverviewData(db.name).then(function (data) {
        var statEl = document.getElementById('stat-' + db.name);
        if (!statEl || !data) {
          if (statEl) statEl.textContent = 'Load failed';
          return;
        }

        var count = 0;
        try {
          count = JSON.stringify(data).length;
        } catch (e) {}

        statEl.textContent = (count / 1024).toFixed(1) + ' KB';
        if (data._meta && data._meta.description) {
          statEl.title = data._meta.description;
        }
      });
    }

    function renderDataOverview() {
      overviewGrid.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">' + overviewDbs.map(function (db) {
        return '<button type="button" class="data-card" data-db="' + db.name + '" style="background:white;border:0;border-radius:12px;padding:16px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.06);cursor:pointer;transition:all 0.2s;font:inherit;">' +
          '<div style="font-size:32px;margin-bottom:8px;">' + db.icon + '</div>' +
          '<strong style="color:#333;">' + db.label + '</strong>' +
          '<div style="font-size:12px;color:#999;margin-top:4px;" id="stat-' + db.name + '">Loading...</div>' +
          '</button>';
      }).join('') + '</div>';

      overviewDbs.forEach(updateOverviewStat);
    }

    overviewGrid.addEventListener('click', function (event) {
      var card = event.target.closest('.data-card');
      if (!card) return;
      var dbName = card.getAttribute('data-db');
      var db = overviewDbs.find(function (item) { return item.name === dbName; });
      if (db) showOverviewPreview(db);
    });

    overviewGrid.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">📦 加载中...</div>';

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        renderDataOverview();
      });
    }, { threshold: 0.1, rootMargin: '100px' });

    observer.observe(overviewGrid);
  }

  function init() {
    bindHeroSearch();
    animateCards();
    initDailyTasks();
    initLayerCards();
    initQuickDiagnosis();
    initDataOverview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
