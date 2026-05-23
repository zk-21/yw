var VIEW_MODE_STORAGE = 'diandianViewMode';

document.addEventListener('DOMContentLoaded', function () {
  var topbar = document.querySelector('.topbar');
  var hamburger = document.getElementById('hamburger-btn');
  ensureManifestLink();
  registerServiceWorker();
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

  navigator.serviceWorker.register('service-worker.js').catch(function () {
    // 安装能力不影响页面正常使用，注册失败时静默降级。
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
    '<span>用独立窗口打开，减少浏览器地址栏干扰。</span>',
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
  if (!topbar || topbar.dataset.enhanced === 'true') return;

  var nav = topbar.querySelector('.nav');
  if (!nav) return;

  topbar.dataset.enhanced = 'true';

  var currentPage = getCurrentPage();
  var topicsActive = ['composition.html', 'knowledge-map.html', 'pinyin.html', 'grammar.html', 'vocabulary.html', 'advanced.html'].indexOf(currentPage) !== -1;
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
    navGroup('专题学习', topicsActive, [
      navLink('composition.html', '作文专题', currentPage === 'composition.html'),
      navLink('knowledge-map.html', '知识总控', currentPage === 'knowledge-map.html'),
      navLink('pinyin.html', '拼音学习', currentPage === 'pinyin.html'),
      navLink('grammar.html', '语法知识', currentPage === 'grammar.html'),
      navLink('vocabulary.html', '词语学习', currentPage === 'vocabulary.html'),
      navLink('advanced.html', '尖子生拓展', currentPage === 'advanced.html')
    ]),
    navLink('agent.html', 'AI Agent', currentPage === 'agent.html'),
    navLink('practice.html', '练习计划', currentPage === 'practice.html'),
    navLink('search.html', '🔍 搜索', currentPage === 'search.html'),
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

/* ========== 面包屑导航 ========== */
function addBreadcrumbBar() {
  if (document.querySelector('.breadcrumb-bar')) return;

  var pageMapping = {
    'index.html':          { label: '首页',                parent: null,                         category: '总览' },
    'grade1.html':         { label: '一年级学习指导',       parent: 'index.html',                  category: '年级专项' },
    'grade2.html':         { label: '二年级学习指导',       parent: 'index.html',                  category: '年级专项' },
    'grade3.html':         { label: '三年级学习指导',       parent: 'index.html',                  category: '年级专项' },
    'grade4.html':         { label: '四年级学习指导',       parent: 'index.html',                  category: '年级专项' },
    'grade5.html':         { label: '五年级学习指导',       parent: 'index.html',                  category: '年级专项' },
    'grade6.html':         { label: '六年级学习指导',       parent: 'index.html',                  category: '年级专项' },
    'pinyin.html':         { label: '拼音学习',             parent: 'index.html',                  category: '专项训练' },
    'grammar.html':        { label: '语法知识',             parent: 'index.html',                  category: '专项训练' },
    'vocabulary.html':     { label: '词语学习',             parent: 'index.html',                  category: '专项训练' },
    'composition.html':    { label: '作文专题',             parent: 'index.html',                  category: '专项训练' },
    'knowledge-map.html':  { label: '知识总控',             parent: 'index.html',                  category: '专项训练' },
    'practice.html':       { label: '练习计划',             parent: 'index.html',                  category: '练习系统' },
    'agent.html':          { label: 'AI 智能助手',          parent: 'index.html',                  category: '智能工具' },
    'advanced.html':       { label: '尖子生拓展',           parent: 'index.html',                  category: '拔尖训练' }
  };

  var currentPage = getCurrentPage();
  var info = pageMapping[currentPage];

  if (!info || currentPage === 'index.html') return;

  var bar = document.createElement('div');
  bar.className = 'breadcrumb-bar';
  bar.setAttribute('aria-label', '面包屑导航');

  var parts = [];
  parts.push('<a href="index.html">🏠 首页</a>');

  if (info.parent) {
    parts.push('<span class="bc-sep">›</span>');
    parts.push('<span>' + info.category + '</span>');
  }

  parts.push('<span class="bc-sep">›</span>');
  parts.push('<span class="bc-current">' + info.label + '</span>');

  bar.innerHTML = parts.join('\n');

  var topbar = document.querySelector('.topbar');
  if (topbar && topbar.nextSibling) {
    topbar.parentNode.insertBefore(bar, topbar.nextSibling);
  } else if (topbar) {
    topbar.parentNode.appendChild(bar);
  }
}

/* ========== 回到顶部按钮 ========== */
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
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        if (window.scrollY > 500) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ========== 年级翻页导航 + 特级教师点拨 ========== */
function addPageNav() {
  if (document.querySelector('.page-nav-row')) return;

  var currentPage = getCurrentPage();
  var gradePages = ['grade1.html', 'grade2.html', 'grade3.html', 'grade4.html', 'grade5.html', 'grade6.html'];
  var topicPages = ['pinyin.html', 'grammar.html', 'vocabulary.html', 'composition.html', 'knowledge-map.html'];

  var isGradePage = gradePages.indexOf(currentPage) !== -1;
  var isTopicPage = topicPages.indexOf(currentPage) !== -1;

  var prevPage = null;
  var nextPage = null;
  var tipsText = '';

  if (isGradePage) {
    var idx = gradePages.indexOf(currentPage);
    prevPage = idx > 0 ? gradePages[idx - 1] : null;
    nextPage = idx < gradePages.length - 1 ? gradePages[idx + 1] : null;

    var gradeLabels = {
      'grade1.html': '一年级：拼音筑基，习惯引航',
      'grade2.html': '二年级：字词爬坡，写话起步',
      'grade3.html': '三年级：阅读入门，习作开窍',
      'grade4.html': '四年级：答题方法，段落写作',
      'grade5.html': '五年级：阅读深化，篇章训练',
      'grade6.html': '六年级：综合融通，小升初衔接'
    };

    var thinkingTips = [
      { label: '尖子生自问', text: '做完一道题，问自己：这道题真正在考我什么能力？我能用一句话说清楚它的规律吗？会做的题，能不能说出"为什么这样做是对的"？' },
      { label: '特级教师提醒', text: '不要追求"做完很多题"，要追求"每道题都真正想明白"。想明白一道题的思路、依据、方法和陷阱，胜过盲目刷十道题。' },
      { label: '拔尖策略', text: '高一个年级看现在：用三年级的眼光看二年级的题，你会发现当初的"难点"其实很简单。学习的本质不是"记住"，而是"理解层次的跃升"。' },
      { label: '深层学习法', text: '每次错题后，不只说"粗心了"，要说：①我读题时漏了哪个关键词？②我用了什么错误的方法？③正确的方法应该怎么想？三步缺一不可。' },
      { label: '迁移能力', text: '学完一个知识点，立刻问自己三个问题：这个方法还能用在哪些题里？换一种问法我还认得出来吗？能不能自己出一道同类题？' },
      { label: '思维进阶', text: '从"我会了"跨越到"我能教别人了"。试着给家长讲一遍这道题：先说题目考什么，再说解题步骤，最后说容易掉进什么坑。能讲清楚才算真正掌握。' },
      { label: '审题心法', text: '拿到任何题目，先圈出关键词和"题眼"，再判断这道题在考哪个知识点、要答几个层次。审题慢三秒，做题快三分——越急越容易跑偏。' },
      { label: '归纳意识', text: '今天学的内容和昨天学的有什么联系？试着画一张"知识地图"，把相似题型、同类方法串起来。孤立的记忆永远比不上结构化的理解。' },
      { label: '反思习惯', text: '做完一道难题后问自己：这道题的"陷阱"在哪里？如果我一开始没做出来，卡在了哪个环节？下次遇到同类题，我第一眼应该看什么？' }
    ];

    // Rotate tip based on a hash of the page and day
    var tipIndex = (idx + new Date().getDate()) % thinkingTips.length;
    var tip = thinkingTips[tipIndex];
    tipsText = '<div class="page-nav-center" style="max-width:500px; line-height:1.5;">' +
      '<strong style="color:#667eea;">💡 ' + tip.label + '</strong><br>' +
      '<span style="font-size:13px; color:#6b7280;">' + tip.text + '</span>' +
      '</div>';
  }

  if (isTopicPage) {
    var tIdx = topicPages.indexOf(currentPage);
    prevPage = tIdx > 0 ? topicPages[tIdx - 1] : null;
    nextPage = tIdx < topicPages.length - 1 ? topicPages[tIdx + 1] : null;

    tipsText = '<div class="page-nav-center" style="max-width:500px; line-height:1.5;">' +
      '<strong style="color:#11998e;">📖 特级教师建议</strong><br>' +
      '<span style="font-size:13px; color:#6b7280;">专题学习要"精而不泛"——每次只攻克一个薄弱点，直到能独立讲出完整思路，再换下一个。</span>' +
      '</div>';
  }

  if (!prevPage && !nextPage) return;

  var pageLabels = {
    'grade1.html': '← 一年级', 'grade2.html': '← 二年级', 'grade3.html': '← 三年级',
    'grade4.html': '← 四年级', 'grade5.html': '← 五年级', 'grade6.html': '← 六年级',
    'pinyin.html': '← 拼音学习', 'grammar.html': '← 语法知识', 'vocabulary.html': '← 词语学习',
    'composition.html': '← 作文专题', 'knowledge-map.html': '← 知识总控'
  };
  var nextLabels = {
    'grade1.html': '一年级 →', 'grade2.html': '二年级 →', 'grade3.html': '三年级 →',
    'grade4.html': '四年级 →', 'grade5.html': '五年级 →', 'grade6.html': '六年级 →',
    'pinyin.html': '拼音学习 →', 'grammar.html': '语法知识 →', 'vocabulary.html': '词语学习 →',
    'composition.html': '作文专题 →', 'knowledge-map.html': '知识总控 →'
  };

  var navRow = document.createElement('div');
  navRow.className = 'page-nav-row';
  navRow.setAttribute('aria-label', '页面导航');

  var prevBtnHTML = prevPage
    ? '<a class="page-nav-btn" href="' + prevPage + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>' + pageLabels[prevPage].replace('← ', '') + '</a>'
    : '<span class="page-nav-btn disabled"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>已是最前</span>';

  var nextBtnHTML = nextPage
    ? '<a class="page-nav-btn" href="' + nextPage + '">' + nextLabels[nextPage].replace(' →', '') + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a>'
    : '<span class="page-nav-btn disabled">已是最后<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span>';

  navRow.innerHTML = prevBtnHTML + tipsText + nextBtnHTML;

  var mainEl = document.querySelector('main');
  if (mainEl) {
    mainEl.appendChild(navRow);
  }

  // 添加特级教师每日反思面板
  addTeacherReflection(mainEl, isGradePage, isTopicPage);
}

/* ========== 特级教师每日反思面板 ========== */
function addTeacherReflection(mainEl, isGradePage, isTopicPage) {
  if (!mainEl || document.querySelector('.teacher-reflection-panel')) return;
  if (!isGradePage && !isTopicPage) return;

  var currentPage = getCurrentPage();
  var gradePages = ['grade1.html', 'grade2.html', 'grade3.html', 'grade4.html', 'grade5.html', 'grade6.html'];

  // 每日反思问题库
  var dailyQuestions = [
    { q: '今天学的内容，我能用自己的话说清楚"是什么、为什么、怎么用"吗？', hint: '试着不看书，给家人复述一遍今天学到的最重要的一个方法。' },
    { q: '今天做对的题，我是在"凭感觉"还是在"凭方法"？', hint: '挑一道做对的题，写出你做对它的"解题思路"，而不只是"答案"。' },
    { q: '有没有一道题，我换一种做法也能做出来？', hint: '尝试用不同的方法解同一道题，比较哪种方法更简单、更不容易出错。' },
    { q: '今天遇到的"坑"是什么？我下次怎么一眼识破它？', hint: '把今天出错的题简化为一句"避坑口诀"，写在本子上。' },
    { q: '如果让我出一道类似的题来考同学，我会怎么出？', hint: '能出题的人才是真懂——试试改编一道做过的题。' },
    { q: '今天的内容和昨天学的有没有关联？能不能串成一条线？', hint: '画一张小小的"知识连线图"，把最近三天学的内容串起来。' },
    { q: '学习中最让我困惑的一步是什么？我准备怎么解决它？', hint: '把困惑写下来，然后问AI、查资料或请教老师——不要带着模糊往前走。' }
  ];

  // 年级对口的"由会做到会思考"进阶指南
  var gradeUpgradeGuide = {
    'grade1.html': { title: '一年级：从"会认读"到"会发现"', text: '尖子生不止是会拼会读，还会自己发现拼音的规律。比如b-p、d-t、g-k的发音有什么共同点？试着总结你的发现，而不只是死记硬背。' },
    'grade2.html': { title: '二年级：从"会写字"到"会用字"', text: '尖子生遇到新词语时，会自己猜意思、自己组句子，而不是等着老师教。试着用今天学会的三个词语编一个小故事。' },
    'grade3.html': { title: '三年级：从"写完整"到"写生动"', text: '尖子生写作文不只是"把事说完"，而是会想：这个地方加一个动作描写会不会更生动？那个地方加一句心理感受会不会更打动人？' },
    'grade4.html': { title: '四年级：从"会答题"到"有依据"', text: '尖子生答阅读题时，每一句结论后面都能接上"因为文中说……"。从原文中找证据，而不是凭印象回答——这是真正会思考的标志。' },
    'grade5.html': { title: '五年级：从"会分析"到"有见解"', text: '尖子生读文章不止是总结段落大意，而会问自己：作者为什么要这么写？换成另一种写法会怎样？我同意作者的观点吗？为什么？' },
    'grade6.html': { title: '六年级：从"会考试"到"会学习"', text: '尖子生不是"题海战士"，而是"方法猎手"——每遇到一种新题型，就提炼一条通用方法，放进自己的"方法武器库"。到了中学，这个库就是你的核心竞争力。' }
  };

  var questionIndex = new Date().getDate() % dailyQuestions.length;
  var question = dailyQuestions[questionIndex];
  var upgrade = isGradePage ? gradeUpgradeGuide[currentPage] : null;

  var panel = document.createElement('div');
  panel.className = 'teacher-reflection-panel';

  var html = '<div class="reflection-inner">';

  // 每日反思问题
  html += '<div class="reflection-question">';
  html += '<div class="reflection-label">🏫 特级教师·每日反思</div>';
  html += '<div class="reflection-q-text">' + question.q + '</div>';
  html += '<div class="reflection-hint">💡 ' + question.hint + '</div>';
  html += '</div>';

  // 年级进阶指南
  if (upgrade) {
    html += '<div class="reflection-upgrade">';
    html += '<div class="reflection-label">🎯 由"会做题"到"会思考"</div>';
    html += '<strong style="color:#667eea; font-size:15px;">' + upgrade.title + '</strong>';
    html += '<p style="margin:8px 0 0; font-size:13px; color:#555; line-height:1.7;">' + upgrade.text + '</p>';
    html += '</div>';
  }

  // 专题页通用进阶建议
  if (isTopicPage && !isGradePage) {
    html += '<div class="reflection-upgrade">';
    html += '<div class="reflection-label">🎯 由"会做题"到"会思考"</div>';
    html += '<p style="margin:0; font-size:13px; color:#555; line-height:1.7;">专题学习不是为了"囤积知识"，而是为了<b>打通方法</b>。每学完一个小专题，问自己三个问题：这个知识点在小考的什么题型里出现？最容易出错的"坑"是什么？我有没有掌握"一看到这类题就知道怎么下手"的方法？</p>';
    html += '</div>';
  }

  html += '</div>';
  panel.innerHTML = html;
  mainEl.appendChild(panel);
}
