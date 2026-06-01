// 性能优化器
window.PerformanceOptimizer = (function() {
  const lazyLoadImages = [];
  const deferredScripts = [];

  // 初始化延迟加载
  function initLazyLoad() {
    // 找到所有需要延迟加载的图片
    document.querySelectorAll('img[data-src]').forEach(img => {
      lazyLoadImages.push({
        element: img,
        loaded: false
      });
    });

    // 创建 IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            
            // 标记为已加载
            const item = lazyLoadImages.find(i => i.element === img);
            if (item) item.loaded = true;
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px',
      threshold: 0.1
    });

    // 观察所有图片
    lazyLoadImages.forEach(item => {
      observer.observe(item.element);
    });
  }

  // 延迟加载脚本
  function loadScriptDeferred(url, callback) {
    deferredScripts.push({ url, callback, loaded: false });
    
    // 在页面加载完成后加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        loadScript(url, callback);
      });
    } else {
      // 使用 requestIdleCallback 在空闲时加载
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          loadScript(url, callback);
        });
      } else {
        // 降级方案
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(() => {
            loadScript(url, callback);
          });
        } else {
          setTimeout(() => {
            loadScript(url, callback);
          }, 0);
        }
      }
    }
  }

  // 实际加载脚本
  function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.defer = true;
    
    if (callback) {
      script.onload = callback;
      script.onerror = () => {
        console.error('加载脚本失败:', url);
      };
    }
    
    document.head.appendChild(script);
  }

  // 拆分长页面
  function splitLongPage(maxHeight = 2000) {
    const sections = document.querySelectorAll('section');
    let currentHeight = 0;
    let chunkIndex = 0;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      currentHeight += rect.height;

      if (currentHeight > maxHeight) {
        // 添加分页标记
        section.setAttribute('data-page-chunk', chunkIndex);
        currentHeight = rect.height;
        chunkIndex++;
      } else {
        section.setAttribute('data-page-chunk', chunkIndex);
      }
    });

    // 添加分页导航
    addPageNavigation(chunkIndex + 1);
  }

  // 添加分页导航
  function addPageNavigation(totalChunks) {
    if (totalChunks <= 1) return;

    const nav = document.createElement('nav');
    nav.className = 'page-chunk-nav';
    nav.innerHTML = `
      <div class="chunk-nav-inner">
        ${Array.from({ length: totalChunks }, (_, i) => `
          <button class="chunk-nav-btn ${i === 0 ? 'active' : ''}" 
                  data-chunk="${i}" 
                  onclick="PerformanceOptimizer.scrollToChunk(${i})">
            ${i + 1}
          </button>
        `).join('')}
      </div>
    `;

    document.body.appendChild(nav);
  }

  // 滚动到指定块
  function scrollToChunk(chunkIndex) {
    const section = document.querySelector(`section[data-page-chunk="${chunkIndex}"]`);
    if (section) {
      smoothScroll(section.offsetTop);
    }
  }

  // 平滑滚动
  function smoothScroll(targetY, duration = 500) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, startY + diff * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // 监听滚动位置
  function setupScrollListener() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // 更新滚动位置
  function updateScrollPosition() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // 更新分页导航状态
    document.querySelectorAll('section').forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const chunkBtn = document.querySelector(`.chunk-nav-btn[data-chunk="${section.getAttribute('data-page-chunk')}"]`);
      
      if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
        chunkBtn?.classList.add('active');
      } else {
        chunkBtn?.classList.remove('active');
      }
    });

    // 显示/隐藏回到顶部按钮
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      backToTop.style.display = scrollY > 300 ? 'flex' : 'none';
    }
  }

  // 添加回到顶部按钮
  function addBackToTopButton() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', '回到顶部');
    btn.onclick = () => smoothScroll(0);
    
    document.body.appendChild(btn);
    
    // 默认隐藏
    btn.style.display = 'none';
  }

  // 优化字体加载
  function optimizeFontLoading() {
    // 预加载关键字体
    const fonts = [
      { family: 'Microsoft YaHei', src: 'local("Microsoft YaHei")' },
      { family: 'PingFang SC', src: 'local("PingFang SC")' }
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.src;
      link.as = 'font';
      document.head.appendChild(link);
    });
  }

  // 优化CSS加载
  function optimizeCSS() {
    // 内联关键CSS
    const criticalCSS = `
      .topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 80; }
      body { padding-top: calc(var(--topbar-offset) + var(--safe-top)); }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  // 初始化所有优化
  function init() {
    initLazyLoad();
    setupScrollListener();
    addBackToTopButton();
    optimizeFontLoading();
    optimizeCSS();
    
    // 延迟执行页面拆分
    setTimeout(() => {
      splitLongPage();
    }, 100);
  }

  return {
    init,
    loadScriptDeferred,
    smoothScroll,
    scrollToChunk,
    addBackToTopButton
  };
})();
