// 角色视图管理器
window.RoleViewManager = (function() {
  const ROLES = {
    STUDENT: 'student',
    PARENT: 'parent',
    TEACHER: 'teacher'
  };

  let currentRole = ROLES.STUDENT;

  // 获取当前角色
  function getCurrentRole() {
    return currentRole;
  }

  // 设置角色
  function setRole(role) {
    if (ROLES[role.toUpperCase()]) {
      currentRole = role.toLowerCase();
      localStorage.setItem('currentRole', currentRole);
      updateView();
    }
  }

  // 加载保存的角色
  function loadRole() {
    const saved = localStorage.getItem('currentRole');
    if (saved && ROLES[saved.toUpperCase()]) {
      currentRole = saved;
    }
  }

  // 更新视图
  function updateView() {
    // 隐藏所有角色特定内容
    document.querySelectorAll('[data-role]').forEach(el => {
      el.style.display = 'none';
    });

    // 显示当前角色的内容
    document.querySelectorAll(`[data-role="${currentRole}"]`).forEach(el => {
      el.style.display = '';
    });

    // 更新角色切换按钮状态
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.role === currentRole) {
        btn.classList.add('active');
      }
    });

    // 更新页面内容
    updatePageContent();
  }

  // 更新页面内容
  function updatePageContent() {
    const roleConfigs = {
      student: {
        heroTitle: '今天练什么',
        heroSubtitle: '根据你的学习情况，为你推荐今日任务',
        showTasks: true,
        showReports: false,
        showTeachingTips: false
      },
      parent: {
        heroTitle: '为什么练这个',
        heroSubtitle: '了解孩子的学习进度和能力分析',
        showTasks: false,
        showReports: true,
        showTeachingTips: false
      },
      teacher: {
        heroTitle: '怎么讲、怎么批改',
        heroSubtitle: '教学要点和评分标准',
        showTasks: false,
        showReports: false,
        showTeachingTips: true
      }
    };

    const config = roleConfigs[currentRole];

    // 更新标题
    const heroTitle = document.querySelector('.role-title');
    if (heroTitle) {
      heroTitle.textContent = config.heroTitle;
    }

    const heroSubtitle = document.querySelector('.role-subtitle');
    if (heroSubtitle) {
      heroSubtitle.textContent = config.heroSubtitle;
    }

    // 显示/隐藏模块
    if (config.showTasks) {
      document.querySelectorAll('.student-content').forEach(el => el.style.display = '');
    } else {
      document.querySelectorAll('.student-content').forEach(el => el.style.display = 'none');
    }

    if (config.showReports) {
      document.querySelectorAll('.parent-content').forEach(el => el.style.display = '');
    } else {
      document.querySelectorAll('.parent-content').forEach(el => el.style.display = 'none');
    }

    if (config.showTeachingTips) {
      document.querySelectorAll('.teacher-content').forEach(el => el.style.display = '');
    } else {
      document.querySelectorAll('.teacher-content').forEach(el => el.style.display = 'none');
    }
  }

  // 获取角色配置
  function getRoleConfig() {
    const configs = {
      student: {
        name: '学生',
        icon: '👨‍🎓',
        color: '#3b82f6'
      },
      parent: {
        name: '家长',
        icon: '👨‍👩‍👧',
        color: '#10b981'
      },
      teacher: {
        name: '老师',
        icon: '👨‍🏫',
        color: '#f59e0b'
      }
    };
    return configs[currentRole];
  }

  // 渲染角色切换器
  function renderRoleSwitcher(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const roles = [
      { id: 'student', name: '学生', icon: '👨‍🎓' },
      { id: 'parent', name: '家长', icon: '👨‍👩‍👧' },
      { id: 'teacher', name: '老师', icon: '👨‍🏫' }
    ];

    let html = '<div class="role-switcher">';
    roles.forEach(role => {
      const active = currentRole === role.id ? 'active' : '';
      html += `
        <button class="role-btn ${active}" data-role="${role.id}" onclick="RoleViewManager.setRole('${role.id}')">
          <span class="role-icon">${role.icon}</span>
          <span class="role-name">${role.name}</span>
        </button>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  }

  // 获取角色特定的数据
  function getRoleData(dataType) {
    const roleData = {
      student: {
        todayTasks: [
          { id: '1', title: '完成拼音练习', progress: 75 },
          { id: '2', title: '复习生字词', progress: 100 },
          { id: '3', title: '阅读训练', progress: 0 }
        ],
        weeklyGoal: { target: 10, completed: 7 }
      },
      parent: {
        childProgress: {
          overall: 85,
          reading: 90,
          writing: 78,
          vocabulary: 88
        },
        recentActivities: [
          { time: '今天', activity: '完成了3道阅读理解题' },
          { time: '昨天', activity: '复习了20个生字词' },
          { time: '前天', activity: '完成了一篇看图写话' }
        ]
      },
      teacher: {
        teachingPoints: [
          '重点讲解修辞手法的识别',
          '强调阅读理解答题格式',
          '指导作文结构安排'
        ],
        gradingStandards: {
          reading: '要点齐全，引用原文',
          writing: '结构完整，语言通顺',
          vocabulary: '用词准确，搭配恰当'
        }
      }
    };

    return roleData[currentRole][dataType] || null;
  }

  // 初始化
  loadRole();

  return {
    ROLES,
    getCurrentRole,
    setRole,
    updateView,
    getRoleConfig,
    renderRoleSwitcher,
    getRoleData
  };
})();