/**
 * 隐私安全埋点 — 只统计行为，不收集答案内容
 *
 * 使用方式：
 *   <script defer src="data/analytics.js"></script>
 *
 * 统计指标（匿名）：
 *   - pageview         页面访问
 *   - search_no_result 搜索无结果
 *   - diagnosis_done   诊断完成
 *   - ai_request_fail  AI 请求失败
 *   - export_trigger   导出操作
 *
 * 隐私保护：
 *   - 不收集具体答案、作文内容、错题内容
 *   - 不收集任何可识别个人信息
 *   - 可通过 localStorage('analytics_opt_out') 关闭
 *   - 使用 sendBeacon 确保数据发送不影响页面卸载
 */

(function () {
  'use strict';

  if (tryGet('analytics_opt_out') === 'true') return;

  var ANALYTICS_URL = null; // 替换为你的统计服务端点，例如 'https://your-analytics.example.com/beacon'
  var SESSION_ID = sessionStorage.getItem('analytics_sid') || generateId();
  sessionStorage.setItem('analytics_sid', SESSION_ID);

  /* ── 工具函数 ── */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function tryGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function send(event, payload) {
    if (!ANALYTICS_URL) return; // 未配置端点时静默跳过

    var data = {
      e: event,
      ts: Date.now(),
      sid: SESSION_ID,
      url: location.pathname,
      ref: document.referrer ? new URL(document.referrer).hostname : '',
      vw: window.innerWidth,
      d: payload || {}
    };

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ANALYTICS_URL, JSON.stringify(data));
      }
    } catch (e) {
      // 静默失败，不影响用户体验
    }

    // 同时记录到 console（开发调试用，生产可删除）
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('[Analytics]', event, data.d);
    }
  }

  /* ── 自动页面浏览 ── */
  send('pageview', {});

  /* ── 公开 API ── */
  window.Analytics = {
    /**
     * 搜索事件 — 记录搜索词长度（不记录具体词）
     * @param {number} queryLength  搜索词字符数
     * @param {number} resultCount  返回结果数（0 表示无结果）
     */
    trackSearch: function (queryLength, resultCount) {
      send('search', {
        ql: queryLength,
        rc: resultCount,
        nr: resultCount === 0 ? 1 : 0
      });
    },

    /** 诊断完成事件 */
    trackDiagnosis: function (score, grade, goal) {
      send('diagnosis_done', {
        sc: score,
        gr: grade,
        go: goal
      });
    },

    /** AI 请求事件 */
    trackAIRequest: function (success, durationMs, provider) {
      send(success ? 'ai_request_ok' : 'ai_request_fail', {
        dur: Math.round(durationMs),
        pr: provider || ''
      });
    },

    /** 导出操作 */
    trackExport: function (type) {
      send('export_trigger', { tp: type });
    },

    /** 练习完成 */
    trackExerciseDone: function (exerciseId, correct, timeSec) {
      send('exercise_done', {
        ex: exerciseId,
        ok: correct ? 1 : 0,
        tm: Math.round(timeSec)
      });
    },

    /** 用户选择退出 */
    optOut: function () {
      try { localStorage.setItem('analytics_opt_out', 'true'); } catch (e) {}
    }
  };
})();
