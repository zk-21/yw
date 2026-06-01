(function () {
  'use strict';

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

  function loadDeferredScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.body.appendChild(script);
    });
  }

  function initRoleViews() {
    if (!window.RoleManager) return;

    var studentEnhancersPromise = null;

    function safeParse(key, defaultValue) {
      try {
        var value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    }

    function getLearningData() {
      return {
        lastResult: safeParse('lastDiagnosisResult', {}),
        wrongList: safeParse('wrongAnswers', []),
        streak: parseInt(localStorage.getItem('checkinStreak') || '0', 10),
        rewardData: safeParse('rewardData', {})
      };
    }

    function renderRoleSwitch() {
      var container = document.getElementById('roleSwitch');
      if (!container) return;

      var roles = [
        { id: 'student', name: '学生', icon: '👦', desc: '专注学习' },
        { id: 'parent', name: '家长', icon: '👨‍👩‍👧', desc: '了解进度' },
        { id: 'teacher', name: '老师', icon: '👨‍🏫', desc: '教学指导' }
      ];

      var currentRole = RoleManager.getCurrentRole();
      container.innerHTML = '<div class="role-switch-wrapper">' + roles.map(function (role) {
        return '<button class="role-btn' + (currentRole === role.id ? ' active' : '') + '" data-role="' + role.id + '" title="' + role.desc + '">' +
          '<span class="role-icon">' + role.icon + '</span>' +
          '<span class="role-name">' + role.name + '</span>' +
          '</button>';
      }).join('') + '</div>';
    }

    function loadStudentEnhancers() {
      if (window.LearningPathEnhanced && window.LearningPathRecommender) {
        return Promise.resolve();
      }
      if (studentEnhancersPromise) return studentEnhancersPromise;

      var version = encodeURIComponent(getAssetVersion());
      studentEnhancersPromise = Promise.all([
        loadDeferredScript('data/learning-path-recommender.js?v=' + version),
        loadDeferredScript('data/learning-path-enhanced.js?v=' + version)
      ]).then(function () {
        if (RoleManager.getCurrentRole() === 'student') {
          renderStudentView();
        }
      }).catch(function (err) {
        studentEnhancersPromise = null;
        throw err;
      });

      return studentEnhancersPromise;
    }

    function scheduleStudentEnhancersLoad() {
      if (window.LearningPathEnhanced && window.LearningPathRecommender) return;

      var start = function () {
        loadStudentEnhancers().catch(function () {});
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(start, { timeout: 1500 });
      } else if ('requestAnimationFrame' in window) {
        window.requestAnimationFrame(start);
      } else {
        setTimeout(start, 0);
      }
    }

    function generateStudentTasks(data) {
      var tasks = [];
      var wrongList = data.wrongList;
      var lastResult = data.lastResult;
      var now = new Date().toISOString();
      var overdueCount = wrongList.filter(function (item) {
        return item.mastery !== 'mastered' && item.nextReview && item.nextReview < now;
      }).length;

      if (overdueCount > 0) {
        tasks.push({
          title: '复习超期错题',
          desc: '有 ' + overdueCount + ' 道题需要复习，加深记忆',
          time: '10分钟',
          link: 'practice.html#wrong-notebook'
        });
      } else if (wrongList.length > 0) {
        tasks.push({
          title: '错题巩固',
          desc: '复习已掌握的错题，防止遗忘',
          time: '10分钟',
          link: 'practice.html#wrong-notebook'
        });
      }

      if (lastResult.totalScore && lastResult.totalScore < 12) {
        tasks.push({
          title: '针对性训练',
          desc: '根据诊断结果，提升薄弱环节',
          time: '15分钟',
          link: 'practice.html#flow-training'
        });
      } else if (!lastResult.totalScore) {
        tasks.push({
          title: '能力诊断',
          desc: '了解当前水平，找到学习方向',
          time: '15分钟',
          link: 'practice.html#diagnosis'
        });
      } else {
        tasks.push({
          title: '进阶挑战',
          desc: '挑战更高难度，突破自我',
          time: '15分钟',
          link: 'practice.html#diagnosis'
        });
      }

      if (lastResult.gradeLabel) {
        tasks.push({
          title: '阅读与写作',
          desc: '本周阅读训练 + 小练笔',
          time: '20分钟',
          link: 'composition.html'
        });
      } else {
        tasks.push({
          title: '积累古诗',
          desc: '学习一首古诗，培养语感',
          time: '10分钟',
          link: 'pinyin.html'
        });
      }

      return tasks.slice(0, 3);
    }

    function renderStudentView() {
      var container = document.getElementById('studentTasks');
      if (!container) return;

      var data = getLearningData();
      var tasks = [];

      if (window.LearningPathEnhanced) {
        var personalizedPlan = window.LearningPathEnhanced.generatePersonalizedPlan(data);
        if (personalizedPlan.modules && personalizedPlan.modules.length > 0) {
          tasks = personalizedPlan.modules.map(function (module) {
            return {
              title: module.name,
              description: module.objectives ? module.objectives.join('、') : '个性化训练任务',
              duration: module.duration,
              priority: module.priority,
              link: 'practice.html#' + module.id,
              type: module.id
            };
          });
        }
      }

      if (tasks.length === 0) {
        var recommendations = window.LearningPathRecommender && window.LearningPathRecommender.getPersonalizedRecommendations
          ? window.LearningPathRecommender.getPersonalizedRecommendations(data)
          : {};
        tasks = recommendations.dailyTasks || generateStudentTasks(data);
      }

      if (tasks.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;">' +
          '<div style="font-size:48px;margin-bottom:16px;">🎯</div>' +
          '<h3 style="color:#333;margin-bottom:8px;">准备开始学习</h3>' +
          '<p style="color:#888;margin-bottom:20px;">完成一次诊断，系统会为你推荐今日任务</p>' +
          '<a href="practice.html#diagnosis" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:8px;text-decoration:none;font-weight:600;">开始诊断 →</a>' +
          '</div>';
        return;
      }

      container.innerHTML = '<div class="student-tasks-grid">' + tasks.map(function (task, index) {
        var priorityColor = task.priority === 'high'
          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
          : task.priority === 'medium'
            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
            : 'linear-gradient(135deg, #6b7280, #4b5563)';

        return '<div class="student-task-card">' +
          '<div class="task-number" style="background:' + priorityColor + '">' + (index + 1) + '</div>' +
          '<div class="task-content">' +
          '<h4>' + task.title + '</h4>' +
          '<p>' + (task.description || task.desc) + '</p>' +
          '<div class="task-meta">' +
          '<span class="task-time">⏱️ ' + (task.duration ? task.duration + '分钟' : task.time) + '</span>' +
          (task.priority === 'high' ? '<span style="font-size:12px;color:#ef4444;font-weight:600;margin-left:12px;">🔥 优先完成</span>' : '') +
          '</div>' +
          '</div>' +
          '<a href="' + task.link + '" class="task-action">开始 →</a>' +
          '</div>';
      }).join('') + '</div>';
    }

    function renderParentView() {
      var container = document.getElementById('pdCards');
      if (!container) return;

      var data = getLearningData();
      var lastResult = data.lastResult;
      var wrongList = data.wrongList;
      var streak = data.streak;
      var points = data.rewardData.points || 0;
      var badges = data.rewardData.badges || [];

      if (!lastResult.totalScore && !wrongList.length && !streak && !points) {
        container.innerHTML = '<div class="pd-empty-state" style="grid-column:1/-1;">' +
          '<div class="icon">👋</div>' +
          '<p style="font-size:15px;color:#888;">还没有学习数据</p>' +
          '<p style="font-size:13px;color:#bbb;">让孩子完成一次诊断后，看板会自动显示</p>' +
          '<a class="pd-new-user-cta" href="practice.html#diagnosis">开始诊断</a>' +
          '</div>';
        return;
      }

      function fmtDate(iso) {
        if (!iso) return '—';
        var d = new Date(iso);
        return d.getMonth() + 1 + '/' + d.getDate();
      }

      var diagScore = lastResult.totalScore || 0;
      var diagGrade = lastResult.gradeLabel || '';
      var diagDate = lastResult.date || '';
      var overdueCount = wrongList.filter(function (item) {
        return item.mastery !== 'mastered' && item.nextReview && item.nextReview < new Date().toISOString();
      }).length;
      var streakClass = streak >= 7 ? 'good' : (streak >= 3 ? 'info' : '');
      var warnClass = overdueCount > 0 ? 'warn' : 'good';

      container.innerHTML = '' +
        '<div class="pd-card info">' +
        '<div class="pd-card-icon">📝</div>' +
        '<div class="pd-value">' + diagScore + ' <span style="font-size:14px;font-weight:400;color:#888;">/ 15</span></div>' +
        '<div class="pd-label">最近诊断 ' + (diagGrade || '—') + '</div>' +
        '<div class="pd-sub">' + fmtDate(diagDate) + (diagDate ? '（' + Math.floor((Date.now() - new Date(diagDate)) / 86400000) + '天前）' : '') + '</div>' +
        '</div>' +
        '<div class="pd-card ' + warnClass + '">' +
        '<div class="pd-card-icon">📒</div>' +
        '<div class="pd-value">' + wrongList.length + '</div>' +
        '<div class="pd-label">错题总数</div>' +
        '<div class="pd-sub">' + (overdueCount > 0 ? '<span style="color:#f59e0b;font-weight:600;">' + overdueCount + ' 条超期未复习</span>' : (wrongList.length > 0 ? '全部已复习 ✓' : '暂无错题')) + '</div>' +
        '</div>' +
        '<div class="pd-card ' + streakClass + '">' +
        '<div class="pd-card-icon">🔥</div>' +
        '<div class="pd-value">' + streak + ' <span style="font-size:14px;font-weight:400;color:#888;">天</span></div>' +
        '<div class="pd-label">连续打卡</div>' +
        '<div class="pd-sub">' + (streak >= 7 ? '很稳定，继续保持！' : streak >= 3 ? '坚持就是胜利' : '继续加油') + '</div>' +
        '</div>' +
        '<div class="pd-card info">' +
        '<div class="pd-card-icon">⭐</div>' +
        '<div class="pd-value">' + points + '</div>' +
        '<div class="pd-label">学习积分</div>' +
        '<div class="pd-sub">徽章：' + (badges.length > 0 ? badges.join('、') : '暂无') + '</div>' +
        '</div>' +
        '<div style="grid-column:1/-1; text-align:center; margin-top:4px;">' +
        '<a href="report.html" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:20px;text-decoration:none;font-size:14px;font-weight:600;">📊 查看完整学习报告 →</a>' +
        '</div>';
    }

    function renderTeacherView() {
      var container = document.getElementById('teacherContent');
      if (!container) return;

      container.innerHTML = '<div class="teacher-content-grid">' +
        '<div class="teacher-card">' +
        '<div class="teacher-card-icon">📚</div>' +
        '<h3>教学要点</h3>' +
        '<ul>' +
        '<li><strong>阅读题教学：</strong>先定位问题类型，再找原文依据，最后组织语言</li>' +
        '<li><strong>作文教学：</strong>结构清晰（开头-中间-结尾），细节描写要具体</li>' +
        '<li><strong>基础知识：</strong>拼音、字词、句型要扎实，每天5分钟巩固</li>' +
        '</ul>' +
        '</div>' +
        '<div class="teacher-card">' +
        '<div class="teacher-card-icon">📝</div>' +
        '<h3>评分标准参考</h3>' +
        '<div class="scoring-guide">' +
        '<div class="scoring-item"><span class="score">A (90+)</span><span>思路清晰，表达准确，有细节</span></div>' +
        '<div class="scoring-item"><span class="score">B (75-89)</span><span>思路基本清楚，表达较准确</span></div>' +
        '<div class="scoring-item"><span class="score">C (60-74)</span><span>有思路，但表达不够完整</span></div>' +
        '<div class="scoring-item"><span class="score">D (60以下)</span><span>需要加强基础训练</span></div>' +
        '</div>' +
        '</div>' +
        '<div class="teacher-card">' +
        '<div class="teacher-card-icon">🔍</div>' +
        '<h3>常见错因及对策</h3>' +
        '<ul>' +
        '<li><strong>R1 审题不清：</strong>教学生圈画题目关键词</li>' +
        '<li><strong>R2 找依据弱：</strong>训练定位原文关键句</li>' +
        '<li><strong>R3 概括能力弱：</strong>练习提炼段落中心</li>' +
        '<li><strong>L1 表达不完整：</strong>用"因为...所以..."句式训练</li>' +
        '</ul>' +
        '</div>' +
        '<div class="teacher-card">' +
        '<div class="teacher-card-icon">🔗</div>' +
        '<h3>教学资源链接</h3>' +
        '<div class="resource-links">' +
        '<a href="knowledge-map.html">知识地图</a>' +
        '<a href="grammar.html">语法知识点</a>' +
        '<a href="vocabulary.html">词汇积累</a>' +
        '<a href="composition.html">作文指导</a>' +
        '</div>' +
        '</div>' +
        '</div>';
    }

    function updateViews() {
      var studentView = document.getElementById('studentView');
      var parentView = document.getElementById('parentView');
      var teacherView = document.getElementById('teacherView');
      if (!studentView || !parentView || !teacherView) return;

      studentView.style.display = 'none';
      parentView.style.display = 'none';
      teacherView.style.display = 'none';

      switch (RoleManager.getCurrentRole()) {
        case 'student':
          studentView.style.display = 'block';
          renderStudentView();
          scheduleStudentEnhancersLoad();
          break;
        case 'parent':
          parentView.style.display = 'block';
          renderParentView();
          break;
        case 'teacher':
          teacherView.style.display = 'block';
          renderTeacherView();
          break;
      }
    }

    window.switchRole = function (roleId) {
      if (RoleManager.setRole(roleId)) {
        updateViews();
      }
    };

    var roleSwitch = document.getElementById('roleSwitch');
    if (roleSwitch) {
      roleSwitch.addEventListener('click', function (event) {
        var button = event.target.closest('.role-btn[data-role]');
        if (!button) return;
        window.switchRole(button.dataset.role);
      });
    }

    renderRoleSwitch();
    updateViews();
    window.addEventListener('roleChange', function () {
      renderRoleSwitch();
      updateViews();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRoleViews);
  } else {
    initRoleViews();
  }
})();
