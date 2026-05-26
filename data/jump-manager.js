// 专题间跳转管理器
window.JumpManager = (function() {
  let errorMapping = null;

  // 加载错因码映射数据
  async function loadErrorMapping() {
    if (errorMapping) return errorMapping;
    
    try {
      const response = await fetch('data/error-mapping.json');
      errorMapping = await response.json();
      return errorMapping;
    } catch (error) {
      console.error('加载错因码映射失败:', error);
      return null;
    }
  }

  // 根据错因码获取跳转链接
  async function getJumpLinks(errorCode) {
    const mapping = await loadErrorMapping();
    if (!mapping || !mapping.errorCodes || !mapping.errorCodes[errorCode]) {
      return null;
    }
    return mapping.errorCodes[errorCode].jumpLinks || null;
  }

  // 获取规则页面链接
  async function getRulePage(errorCode) {
    const links = await getJumpLinks(errorCode);
    return links ? links.rulePage : null;
  }

  // 获取练习页面链接
  async function getPracticePage(errorCode) {
    const links = await getJumpLinks(errorCode);
    return links ? links.practicePage : null;
  }

  // 获取习题页面链接
  async function getExercisePage(errorCode) {
    const links = await getJumpLinks(errorCode);
    return links ? links.exercisePage : null;
  }

  // 跳转到规则页面
  async function jumpToRule(errorCode) {
    const url = await getRulePage(errorCode);
    if (url) {
      window.location.href = url;
      return true;
    }
    return false;
  }

  // 跳转到练习页面
  async function jumpToPractice(errorCode) {
    const url = await getPracticePage(errorCode);
    if (url) {
      window.location.href = url;
      return true;
    }
    return false;
  }

  // 跳转到习题页面
  async function jumpToExercise(errorCode) {
    const url = await getExercisePage(errorCode);
    if (url) {
      window.location.href = url;
      return true;
    }
    return false;
  }

  // 渲染跳转按钮
  async function renderJumpButtons(containerId, errorCode) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const links = await getJumpLinks(errorCode);
    if (!links) return;

    let html = '<div class="jump-buttons">';
    
    if (links.rulePage) {
      html += `<button class="jump-btn jump-btn-rule" onclick="JumpManager.jumpToRule('${errorCode}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        <span>查看规则</span>
      </button>`;
    }
    
    if (links.practicePage) {
      html += `<button class="jump-btn jump-btn-practice" onclick="JumpManager.jumpToPractice('${errorCode}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11l2 2 4-5"/><path d="M5 4h14v16H5z"/></svg>
        <span>专项练习</span>
      </button>`;
    }
    
    if (links.exercisePage) {
      html += `<button class="jump-btn jump-btn-exercise" onclick="JumpManager.jumpToExercise('${errorCode}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
        <span>相关习题</span>
      </button>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
  }

  // 获取错因码的完整信息
  async function getErrorInfo(errorCode) {
    const mapping = await loadErrorMapping();
    if (!mapping || !mapping.errorCodes || !mapping.errorCodes[errorCode]) {
      return null;
    }
    return mapping.errorCodes[errorCode];
  }

  return {
    loadErrorMapping,
    getJumpLinks,
    getRulePage,
    getPracticePage,
    getExercisePage,
    jumpToRule,
    jumpToPractice,
    jumpToExercise,
    renderJumpButtons,
    getErrorInfo
  };
})();