var VIEW_MODE_STORAGE = 'diandianViewMode';

document.addEventListener('DOMContentLoaded', function () {
  var topbar = document.querySelector('.topbar');
  var hamburger = document.getElementById('hamburger-btn');
  applyViewMode(getViewMode());
  enhanceTopNavigation(topbar);
  addViewSwitcher(topbar);
  bindNavGroups(topbar);

  if (topbar && hamburger) {
    // 点击汉堡按钮切换导航
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      topbar.classList.toggle('nav-visible');
    });

    // 点击导航链接后关闭菜单
    topbar.querySelectorAll('.nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        topbar.classList.remove('nav-visible');
      });
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function (e) {
      if (!topbar.contains(e.target)) {
        topbar.classList.remove('nav-visible');
      }
    });

    // 按 Escape 键关闭菜单
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        topbar.classList.remove('nav-visible');
      }
    });
  }

  addMobileBottomNav();
});

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
  if (!topbar || topbar.dataset.enhanced === 'true') return;

  var nav = topbar.querySelector('.nav');
  if (!nav) return;

  topbar.dataset.enhanced = 'true';

  var currentPage = getCurrentPage();
  var topicsActive = ['composition.html', 'knowledge-map.html', 'pinyin.html', 'grammar.html', 'vocabulary.html'].indexOf(currentPage) !== -1;
  var gradesActive = ['grade1.html', 'grade2.html', 'grade3.html', 'grade4.html', 'grade5.html', 'grade6.html'].indexOf(currentPage) !== -1;

  nav.innerHTML = [
    navLink('index.html', '总览', currentPage === 'index.html'),
    navGroup('年级切换', gradesActive, [
      navLink('grade1.html', '一年级', currentPage === 'grade1.html'),
      navLink('grade2.html', '二年级', currentPage === 'grade2.html'),
      navLink('grade3.html', '三年级', currentPage === 'grade3.html'),
      navLink('grade4.html', '四年级', currentPage === 'grade4.html'),
      navLink('grade5.html', '五年级', currentPage === 'grade5.html'),
      navLink('grade6.html', '六年级', currentPage === 'grade6.html')
    ]),
    navGroup('专题切换', topicsActive, [
      navLink('composition.html', '作文专题', currentPage === 'composition.html'),
      navLink('knowledge-map.html', '知识总控', currentPage === 'knowledge-map.html'),
      navLink('pinyin.html', '拼音学习', currentPage === 'pinyin.html'),
      navLink('grammar.html', '语法知识', currentPage === 'grammar.html'),
      navLink('vocabulary.html', '词语学习', currentPage === 'vocabulary.html')
    ]),
    navLink('agent.html', 'AI Agent', currentPage === 'agent.html'),
    navLink('practice.html', '练习计划', currentPage === 'practice.html'),
  ].join('');
}

function navLink(href, label, active) {
  return '<a class="' + (active ? 'active' : '') + '" href="' + href + '">' + label + '</a>';
}

function navGroup(label, active, links) {
  return [
    '<div class="nav-group ', active ? 'active' : '', '">',
    '<button class="nav-group-button" type="button" aria-haspopup="true" aria-expanded="false">', label, '</button>',
    '<div class="nav-menu">', links.join(''), '</div>',
    '</div>'
  ].join('');
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
        group.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    });
  });

  topbar.querySelectorAll('.nav-menu a').forEach(function (link) {
    link.addEventListener('click', closeGroups);
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-group')) {
      closeGroups();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeGroups();
    }
  });
}

function addViewSwitcher(topbar) {
  if (!topbar || topbar.querySelector('.view-switcher')) return;

  var switcher = document.createElement('div');
  switcher.className = 'view-switcher';
  switcher.setAttribute('aria-label', '页面视图切换');
  switcher.innerHTML = [
    '<button type="button" data-view-mode="auto" title="自动适配屏幕">自动</button>',
    '<button type="button" data-view-mode="mobile" title="按手机页面查看">手机</button>',
    '<button type="button" data-view-mode="desktop" title="按电脑页面查看">电脑</button>'
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
  var topicPages = [
    'knowledge-map.html',
    'pinyin.html',
    'grammar.html',
    'vocabulary.html',
    'grade1.html',
    'grade2.html',
    'grade3.html',
    'grade4.html',
    'grade5.html',
    'grade6.html'
  ];

  var items = [
    {
      href: 'index.html',
      label: '首页',
      active: currentPage === 'index.html',
      icon: '<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/>'
    },
    {
      href: 'agent.html',
      label: 'AI',
      active: currentPage === 'agent.html',
      icon: '<path d="M12 3v18"/><path d="M5 10h14"/><path d="M6 17h12"/>'
    },
    {
      href: 'knowledge-map.html',
      label: '专题',
      active: topicPages.indexOf(currentPage) !== -1 || currentPage === 'composition.html',
      icon: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 1-2-1.5z"/>'
    },
    {
      href: 'practice.html',
      label: '练习',
      active: currentPage === 'practice.html',
      icon: '<path d="M9 11l2 2 4-5"/><path d="M5 4h14v16H5z"/>'
    }
  ];

  var nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  nav.setAttribute('aria-label', '手机底部导航');

  nav.innerHTML = [
    '<div class="mobile-bottom-nav-inner">',
    items.map(function (item) {
      return [
        '<a href="', item.href, '" class="', item.active ? 'active' : '', '">',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">',
        item.icon,
        '</svg>',
        '<span>', item.label, '</span>',
        '</a>'
      ].join('');
    }).join(''),
    '</div>'
  ].join('');

  document.body.appendChild(nav);
  bindBottomNavSizing(nav);
}

function bindBottomNavSizing(nav) {
  if (!nav || nav.dataset.sized === 'true') return;
  if (nav.classList.contains('agent-bottom-nav')) return;

  nav.dataset.sized = 'true';

  function applySize() {
    var inner = nav.querySelector('.mobile-bottom-nav-inner, .agent-bottom-nav-inner');
    var itemCount = inner ? inner.querySelectorAll('a').length : 0;
    var layoutWidths = [
      window.visualViewport && window.visualViewport.width,
      document.documentElement && document.documentElement.clientWidth,
      window.innerWidth
    ].filter(function (value) {
      return Number(value) > 0;
    });
    var viewportWidth = layoutWidths.length ? Math.min.apply(null, layoutWidths) : 390;
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
