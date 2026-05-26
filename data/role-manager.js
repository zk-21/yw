/**
 * 角色管理工具
 * 支持学生/家长/老师三种角色的切换和视图控制
 */
(function() {
  'use strict';

  const ROLES = {
    STUDENT: 'student',
    PARENT: 'parent',
    TEACHER: 'teacher'
  };

  const ROLE_CONFIG = {
    [ROLES.STUDENT]: {
      name: '学生',
      icon: '👦',
      description: '专注学习任务',
      showTodayTasks: true,
      showLearningPath: true,
      showReport: false,
      showTeachingTips: false,
      showScoringGuide: false,
      showErrorAnalysis: false
    },
    [ROLES.PARENT]: {
      name: '家长',
      icon: '👨‍👩‍👧',
      description: '了解学习进度',
      showTodayTasks: false,
      showLearningPath: true,
      showReport: true,
      showTeachingTips: true,
      showScoringGuide: false,
      showErrorAnalysis: true
    },
    [ROLES.TEACHER]: {
      name: '老师',
      icon: '👨‍🏫',
      description: '教学指导视角',
      showTodayTasks: false,
      showLearningPath: true,
      showReport: true,
      showTeachingTips: true,
      showScoringGuide: true,
      showErrorAnalysis: true
    }
  };

  let currentRole = ROLES.STUDENT;

  function getStoredRole() {
    try {
      const stored = localStorage.getItem('currentRole');
      if (stored && ROLES[stored.toUpperCase()]) {
        return stored.toLowerCase();
      }
    } catch(e) {}
    return ROLES.STUDENT;
  }

  function saveRole(role) {
    try {
      localStorage.setItem('currentRole', role);
    } catch(e) {}
  }

  // ── 公开 API ──────────────────────────────────────────────
  window.RoleManager = {
    ROLES: ROLES,
    
    init: function() {
      currentRole = getStoredRole();
    },
    
    getCurrentRole: function() {
      return currentRole;
    },
    
    getCurrentRoleConfig: function() {
      return ROLE_CONFIG[currentRole];
    },
    
    setRole: function(role) {
      if (ROLE_CONFIG[role]) {
        currentRole = role;
        saveRole(role);
        this.notifyRoleChange();
        return true;
      }
      return false;
    },
    
    getAllRoles: function() {
      return Object.keys(ROLES).map(key => ({
        id: ROLES[key],
        ...ROLE_CONFIG[ROLES[key]]
      }));
    },
    
    canSee: function(feature) {
      const config = ROLE_CONFIG[currentRole];
      return config[feature] || false;
    },
    
    notifyRoleChange: function() {
      const event = new CustomEvent('roleChange', { detail: { role: currentRole } });
      window.dispatchEvent(event);
    }
  };

  // 初始化
  RoleManager.init();
})();