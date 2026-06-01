var VIEW_MODE_STORAGE = 'diandianViewMode';

(function () {
  var PAGE_META = {
    'index.html': { label: '总览', category: '首页', mobile: '首页' },
    'report.html': { label: '学习报告', category: '概览', mobile: '报告' },
    'agent.html': { label: 'AI 助手', category: '工具', mobile: 'AI' },
    'practice.html': { label: '练习计划', category: '练习', mobile: '练习' },
    'search.html': { label: '站内搜索', category: '工具', mobile: '搜索' },
    'knowledge-map.html': { label: '知识总图', category: '专题', mobile: '专题' },
    'composition.html': { label: '作文专题', category: '专题', mobile: '作文' },
    'extra-topics.html': { label: '易错专题', category: '专题', mobile: '专题' },
    'oral-communication.html': { label: '口语交际', category: '专题', mobile: '专题' },
    'application-writing.html': { label: '应用文专题', category: '专题', mobile: '专题' },
    'integrated-learning.html': { label: '综合性学习', category: '专题', mobile: '专题' },
    'narrative-reading.html': { label: '记叙文阅读', category: '专题', mobile: '专题' },
    'non-continuous-text.html': { label: '非连续性文本', category: '专题', mobile: '专题' },
    'expository-reading.html': { label: '说明文阅读', category: '专题', mobile: '专题' },
    'classical-reading.html': { label: '古诗文阅读', category: '专题', mobile: '专题' },
    'literary.html': { label: '文学常识', category: '专题', mobile: '专题' },
    'modern-poetry.html': { label: '现代诗与儿童诗', category: '专题', mobile: '专题' },
    'book-reading.html': { label: '整本书阅读', category: '专题', mobile: '专题' },
    'advanced.html': { label: '拔尖拓展', category: '专题', mobile: '专题' },
    'pinyin.html': { label: '拼音学习', category: '专题', mobile: '专题' },
    'grammar.html': { label: '语法知识', category: '专题', mobile: '专题' },
    'vocabulary.html': { label: '词语学习', category: '专题', mobile: '专题' },
    'grade1.html': { label: '一年级', category: '年级', mobile: '年级' },
    'grade2.html': { label: '二年级', category: '年级', mobile: '年级' },
    'grade3.html': { label: '三年级', category: '年级', mobile: '年级' },
    'grade4.html': { label: '四年级', category: '年级', mobile: '年级' },
    'grade5.html': { label: '五年级', category: '年级', mobile: '年级' },
    'grade6.html': { label: '六年级', category: '年级', mobile: '年级' }
  };

  var GRADE_PAGES = ['grade1.html', 'grade2.html', 'grade3.html', 'grade4.html', 'grade5.html', 'grade6.html'];
  var TOPIC_PAGES = [
    'knowledge-map.html', 'composition.html', 'extra-topics.html', 'oral-communication.html',
    'application-writing.html', 'integrated-learning.html', 'narrative-reading.html',
    'non-continuous-text.html', 'expository-reading.html', 'classical-reading.html',
    'literary.html', 'modern-poetry.html', 'book-reading.html', 'advanced.html',
    'pinyin.html', 'grammar.html', 'vocabulary.html'
  ];

  document.addEventListener('DOMContentLoaded', function () {
    var topbar = document.querySelector('.topbar');
    var hamburger = document.getElementById('hamburger-btn');

    ensureManifestLink();
    registerServiceWorker();
    applyViewMode(getViewMode());
    enhanceTopNavigation(topbar);
    addViewSwitcher(topbar);
    bindTopbar(topbar, hamburger);
    bindNavGroups(topbar);
    addMobileBottomNav();
    addBreadcrumbBar();
    addBackToTop();
    addPageNav();
    setupInstallPrompt();
  });

  function ensureManifestLink() {
    if (document.querySelector('link[rel="manifest"]')) return;
    var manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = 'manifest.json';
    document.head.appendChild(manifest);
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (!window.isSecureContext && location.hostname !== 'localhost') return;

    navigator.serviceWorker.register('service-worker.js').then(function (registration) {
      registration.addEventListener('updatefound', function () {
        var newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', function () {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateNotification();
          }
        });
      });

      if (registration.waiting && navigator.serviceWorker.controller) {
        showUpdateNotification();
      }
    }).catch(function () {});
  }

  function showUpdateNotification() {
    if (document.getElementById('sw-update-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'sw-update-bar';
    bar.innerHTML = '<span>检测到新版本</span><button id="sw-update-btn" type="button">立即刷新</button>';
    document.body.appendChild(bar);
    document.getElementById('sw-update-btn').addEventListener('click', function () {
      bar.remove();
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        window.location.reload();
      }, { once: true });
      setTimeout(function () {
        window.location.reload();
      }, 1500);
    });
  }

  function setupInstallPrompt() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) return;
    if (sessionStorage.getItem('diandianInstallHintDismissed') === 'true') return;

    var deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      deferredPrompt = event;
      showInstallHint(function () {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function () {
          deferredPrompt = null;
          hideInstallHint();
        });
      });
    });
  }

  function showInstallHint(onInstall) {
    if (document.querySelector('.pwa-install-hint')) return;
    var hint = document.createElement('div');
    hint.className = 'pwa-install-hint';
    hint.innerHTML = [
      '<div>',
      '<strong>添加到桌面</strong>',
      '<span>用独立窗口打开，访问更快，也更像本地应用。</span>',
      '</div>',
      '<button type="button" class="pwa-install-button">安装</button>',
      '<button type="button" class="pwa-install-close" aria-label="关闭">×</button>'
    ].join('');
    hint.querySelector('.pwa-install-button').addEventListener('click', onInstall);
    hint.querySelector('.pwa-install-close').addEventListener('click', function () {
      sessionStorage.setItem('diandianInstallHintDismissed', 'true');
      hideInstallHint();
    });
    document.body.appendChild(hint);
  }

  function hideInstallHint() {
    var hint = document.querySelector('.pwa-install-hint');
    if (hint) hint.remove();
  }

  function getCurrentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function getViewMode() {
    return localStorage.getItem(VIEW_MODE_STORAGE) || 'auto';
  }

  function applyViewMode(mode) {
    var nextMode = ['auto', 'mobile', 'desktop'].indexOf(mode) === -1 ? 'auto' : mode;
    document.documentElement.classList.remove('view-auto', 'view-mobile', 'view-desktop');
    document.documentElement.classList.add('view-' + nextMode);
    document.documentElement.dataset.viewMode = nextMode;

    var viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }

    viewport.setAttribute('content', nextMode === 'desktop'
      ? 'width=1200, viewport-fit=cover'
      : 'width=device-width, initial-scale=1, viewport-fit=cover');
  }

  function enhanceTopNavigation(topbar) {
    if (!topbar) return;
    var nav = topbar.querySelector('.nav');
    if (!nav || topbar.dataset.enhanced === 'true') return;

    topbar.dataset.enhanced = 'true';
    var currentPage = getCurrentPage();

    nav.innerHTML = [
      navLink('index.html', '总览', currentPage === 'index.html'),
      navLink('report.html', '学习报告', currentPage === 'report.html'),
      navGroup('年级切换', GRADE_PAGES.indexOf(currentPage) !== -1, GRADE_PAGES.map(function (page) {
        return navLink(page, PAGE_META[page].label, currentPage === page);
      })),
      navGroup('专题学习', TOPIC_PAGES.indexOf(currentPage) !== -1, TOPIC_PAGES.map(function (page) {
        return navLink(page, PAGE_META[page].label, currentPage === page);
      })),
      navLink('agent.html', 'AI 助手', currentPage === 'agent.html'),
      navLink('practice.html', '练习计划', currentPage === 'practice.html'),
      navLink('search.html', '站内搜索', currentPage === 'search.html')
    ].join('');
  }

  function navLink(href, label, active) {
    return '<a class="' + (active ? 'active' : '') + '" href="' + href + '">' + label + '</a>';
  }

  function navGroup(label, active, links) {
    return [
      '<div class="nav-group ' + (active ? 'active' : '') + '">',
      '<button class="nav-group-button" type="button" aria-haspopup="true" aria-expanded="false">' + label + '</button>',
      '<div class="nav-menu">' + links.join('') + '</div>',
      '</div>'
    ].join('');
  }

  function bindTopbar(topbar, hamburger) {
    if (!topbar || !hamburger) return;
    hamburger.addEventListener('click', function (event) {
      event.stopPropagation();
      topbar.classList.toggle('nav-visible');
    });

    topbar.addEventListener('click', function (event) {
      var link = event.target.closest('.nav a');
      if (link) topbar.classList.remove('nav-visible');
    });

    document.addEventListener('click', function (event) {
      if (!topbar.contains(event.target)) {
        topbar.classList.remove('nav-visible');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        topbar.classList.remove('nav-visible');
      }
    });
  }

  function bindNavGroups(topbar) {
    if (!topbar || topbar.dataset.navGroupsBound === 'true') return;
    topbar.dataset.navGroupsBound = 'true';

    function closeGroups() {
      topbar.querySelectorAll('.nav-group.open').forEach(function (group) {
        group.classList.remove('open');
        var button = group.querySelector('.nav-group-button');
        if (button) button.setAttribute('aria-expanded', 'false');
      });
    }

    topbar.querySelectorAll('.nav-group-button').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var group = button.closest('.nav-group');
        var willOpen = group && !group.classList.contains('open');
        closeGroups();
        if (group && willOpen) {
          group.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });

    topbar.querySelectorAll('.nav-menu a').forEach(function (link) {
      link.addEventListener('click', closeGroups);
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.nav-group')) closeGroups();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeGroups();
    });
  }

  function addViewSwitcher(topbar) {
    if (!topbar || topbar.querySelector('.view-switcher')) return;
    var switcher = document.createElement('div');
    switcher.className = 'view-switcher';
    switcher.setAttribute('aria-label', '页面视图切换');
    switcher.innerHTML = [
      '<button type="button" data-view-mode="auto" title="自动适配屏幕">自动</button>',
      '<button type="button" data-view-mode="mobile" title="按手机宽度查看">手机</button>',
      '<button type="button" data-view-mode="desktop" title="按桌面宽度查看">电脑</button>'
    ].join('');

    topbar.appendChild(switcher);

    function refreshButtons(mode) {
      switcher.querySelectorAll('button').forEach(function (button) {
        button.classList.toggle('active', button.dataset.viewMode === mode);
      });
    }

    refreshButtons(getViewMode());

    switcher.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-view-mode]');
      if (!button) return;
      var mode = button.dataset.viewMode;
      localStorage.setItem(VIEW_MODE_STORAGE, mode);
      applyViewMode(mode);
      refreshButtons(mode);
      addMobileBottomNav();
      document.querySelectorAll('.mobile-bottom-nav, .agent-bottom-nav').forEach(bindBottomNavSizing);
    });
  }

  function addMobileBottomNav() {
    var agentNav = document.querySelector('.agent-bottom-nav');
    if (agentNav) return;

    var existingNav = document.querySelector('.mobile-bottom-nav');
    if (existingNav) {
      bindBottomNavSizing(existingNav);
      return;
    }

    var currentPage = getCurrentPage();
    var items = [
      { href: 'index.html', label: '首页', active: currentPage === 'index.html', icon: '<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/>' },
      { href: 'agent.html', label: 'AI', active: currentPage === 'agent.html', icon: '<path d="M12 3v18"/><path d="M5 10h14"/><path d="M6 17h12"/>' },
      { href: 'knowledge-map.html', label: '专题', active: TOPIC_PAGES.indexOf(currentPage) !== -1, icon: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 1-2-1.5z"/>' },
      { href: 'practice.html', label: '练习', active: currentPage === 'practice.html', icon: '<path d="M9 11l2 2 4-5"/><path d="M5 4h14v16H5z"/>' }
    ];

    var nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', '手机底部导航');
    nav.innerHTML = '<div class="mobile-bottom-nav-inner">' + items.map(function (item) {
      return [
        '<a href="' + item.href + '" class="' + (item.active ? 'active' : '') + '">',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">' + item.icon + '</svg>',
        '<span>' + item.label + '</span>',
        '</a>'
      ].join('');
    }).join('') + '</div>';

    document.body.appendChild(nav);
    bindBottomNavSizing(nav);
  }

  function bindBottomNavSizing(nav) {
    if (!nav || nav.classList.contains('agent-bottom-nav')) return;

    function applySize() {
      var inner = nav.querySelector('.mobile-bottom-nav-inner, .agent-bottom-nav-inner');
      var itemCount = inner ? inner.querySelectorAll('a').length : 0;
      var widths = [
        window.visualViewport && window.visualViewport.width,
        document.documentElement && document.documentElement.clientWidth,
        window.innerWidth
      ].filter(function (value) {
        return Number(value) > 0;
      });
      var viewportWidth = widths.length ? Math.min.apply(null, widths) : 390;
      var width = Math.max(288, Math.min(viewportWidth - 24, 430));

      nav.style.left = '50%';
      nav.style.right = 'auto';
      nav.style.width = width + 'px';
      nav.style.maxWidth = width + 'px';
      nav.style.transform = 'translateX(-50%)';

      if (inner && itemCount) {
        inner.style.width = '100%';
        inner.style.maxWidth = '100%';
        inner.style.gridTemplateColumns = 'repeat(' + itemCount + ', minmax(0, 1fr))';
      }
    }

    applySize();
    window.addEventListener('resize', applySize);
    window.addEventListener('orientationchange', applySize);
  }

  function addBreadcrumbBar() {
    if (document.querySelector('.breadcrumb-bar')) return;
    var currentPage = getCurrentPage();
    var info = PAGE_META[currentPage];
    if (!info || currentPage === 'index.html') return;

    var bar = document.createElement('div');
    bar.className = 'breadcrumb-bar';
    bar.setAttribute('aria-label', '面包屑导航');
    bar.innerHTML = [
      '<a href="index.html">首页</a>',
      '<span class="bc-sep">/</span>',
      '<span>' + info.category + '</span>',
      '<span class="bc-sep">/</span>',
      '<span class="bc-current">' + info.label + '</span>'
    ].join('');

    var topbar = document.querySelector('.topbar');
    if (topbar && topbar.parentNode) {
      if (topbar.nextSibling) {
        topbar.parentNode.insertBefore(bar, topbar.nextSibling);
      } else {
        topbar.parentNode.appendChild(bar);
      }
    }
  }

  function addBackToTop() {
    if (document.querySelector('.back-to-top')) return;
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', '回到顶部');
    btn.title = '回到顶部';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle('visible', window.scrollY > 500);
        ticking = false;
      });
    }, { passive: true });
  }

  function addPageNav() {
    if (document.querySelector('.page-nav-row')) return;
    var currentPage = getCurrentPage();
    var pages = GRADE_PAGES.indexOf(currentPage) !== -1 ? GRADE_PAGES : (TOPIC_PAGES.indexOf(currentPage) !== -1 ? TOPIC_PAGES : null);
    if (!pages) return;

    var index = pages.indexOf(currentPage);
    var prevPage = index > 0 ? pages[index - 1] : null;
    var nextPage = index < pages.length - 1 ? pages[index + 1] : null;
    if (!prevPage && !nextPage) return;

    var navRow = document.createElement('div');
    navRow.className = 'page-nav-row';
    navRow.setAttribute('aria-label', '页面切换');

    var centerText = GRADE_PAGES.indexOf(currentPage) !== -1
      ? '按年级顺序浏览，便于看清能力递进。'
      : '按专题顺序浏览，便于集中补齐同类问题。';

    navRow.innerHTML = [
      prevPage ? '<a class="page-nav-btn" href="' + prevPage + '">上一页：' + PAGE_META[prevPage].label + '</a>' : '<span class="page-nav-btn disabled">已经是第一页</span>',
      '<div class="page-nav-center">' + centerText + '</div>',
      nextPage ? '<a class="page-nav-btn" href="' + nextPage + '">下一页：' + PAGE_META[nextPage].label + '</a>' : '<span class="page-nav-btn disabled">已经是最后一页</span>'
    ].join('');

    var mainEl = document.querySelector('main');
    if (mainEl) mainEl.appendChild(navRow);
  }
})();
