// 交互体验增强器
window.InteractionEnhancer = (function() {
  // 初始化折叠/展开功能
  function initCollapsible() {
    // 为所有带 data-collapsible 属性的元素添加折叠功能
    document.querySelectorAll('[data-collapsible]').forEach(container => {
      const trigger = container.querySelector('[data-trigger]') || createTrigger(container);
      const content = container.querySelector('[data-content]');
      
      if (!content) return;

      // 设置初始状态
      const isOpen = container.getAttribute('data-collapsible') === 'open';
      content.style.maxHeight = isOpen ? content.scrollHeight + 'px' : '0';
      content.style.overflow = 'hidden';
      
      // 添加动画过渡
      content.style.transition = 'max-height 0.3s ease-out';
      
      // 添加触发点击事件
      trigger.addEventListener('click', () => toggleCollapse(container));

      // 添加视觉指示器
      addCollapseIndicator(trigger, isOpen);
    });
  }

  // 创建触发器
  function createTrigger(container) {
    const trigger = document.createElement('button');
    trigger.className = 'collapse-trigger';
    trigger.setAttribute('data-trigger', '');
    
    // 获取标题
    const title = container.querySelector('h2, h3, h4')?.textContent || '点击展开';
    trigger.innerHTML = `<span>${title}</span>`;
    
    // 在内容前插入触发器
    const content = container.querySelector('[data-content]');
    if (content) {
      content.parentNode.insertBefore(trigger, content);
    }
    
    return trigger;
  }

  // 添加折叠指示器
  function addCollapseIndicator(trigger, isOpen) {
    const indicator = document.createElement('span');
    indicator.className = 'collapse-indicator';
    indicator.textContent = isOpen ? '▼' : '▶';
    trigger.appendChild(indicator);
  }

  // 切换折叠状态
  function toggleCollapse(container) {
    const content = container.querySelector('[data-content]');
    const trigger = container.querySelector('[data-trigger]');
    const indicator = trigger?.querySelector('.collapse-indicator');
    
    if (!content) return;

    const isOpen = container.getAttribute('data-collapsible') === 'open';
    
    if (isOpen) {
      // 折叠
      content.style.maxHeight = '0';
      container.setAttribute('data-collapsible', 'closed');
      indicator.textContent = '▶';
    } else {
      // 展开
      content.style.maxHeight = content.scrollHeight + 'px';
      container.setAttribute('data-collapsible', 'open');
      indicator.textContent = '▼';
    }
  }

  // 初始化平滑滚动导航
  function initSmoothScroll() {
    // 为所有锚点链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // 跳过空锚点和外部链接
        if (href === '#' || href.startsWith('#/')) return;

        const targetId = href.substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          e.preventDefault();
          smoothScrollTo(target);
        }
      });
    });
  }

  // 平滑滚动到目标元素
  function smoothScrollTo(target, offset = 100) {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.scrollY;
    const distance = targetPosition + startPosition - offset;
    const duration = 500;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, startPosition + distance * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  // 初始化目录锚点导航
  function initTableOfContents() {
    const tocContainer = document.getElementById('table-of-contents');
    if (!tocContainer) return;

    // 收集所有标题
    const headings = document.querySelectorAll('h2, h3');
    const tocItems = [];

    headings.forEach((heading, index) => {
      // 为标题添加ID
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      tocItems.push({
        id: heading.id,
        text: heading.textContent,
        level: heading.tagName === 'H2' ? 1 : 2
      });
    });

    // 渲染目录
    renderToc(tocContainer, tocItems);

    // 监听滚动，高亮当前章节
    setupTocHighlight(headings);
  }

  // 渲染目录
  function renderToc(container, items) {
    let html = '<nav class="toc-nav">';
    html += '<h3 class="toc-title">目录</h3>';
    html += '<ul class="toc-list">';
    
    items.forEach(item => {
      const indent = item.level === 2 ? 'toc-indent' : '';
      html += `<li class="${indent}">
        <a href="#${item.id}" class="toc-link">${item.text}</a>
      </li>`;
    });
    
    html += '</ul></nav>';
    container.innerHTML = html;
  }

  // 设置目录高亮
  function setupTocHighlight(headings) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateTocHighlight(headings);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // 更新目录高亮
  function updateTocHighlight(headings) {
    const scrollPosition = window.scrollY + 150;

    headings.forEach((heading, index) => {
      const link = document.querySelector(`.toc-link[href="#${heading.id}"]`);
      if (!link) return;

      const headingTop = heading.offsetTop;
      const nextHeading = headings[index + 1];
      const headingBottom = nextHeading ? nextHeading.offsetTop : document.body.scrollHeight;

      if (scrollPosition >= headingTop && scrollPosition < headingBottom) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // 添加悬停效果
  function addHoverEffects() {
    // 为卡片添加悬停效果
    document.querySelectorAll('.card, .study-block, .route-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      });

      // 添加过渡效果
      card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    });
  }

  // 添加数字滚动动画
  function animateNumbers() {
    document.querySelectorAll('[data-animate-number]').forEach(el => {
      const target = parseInt(el.getAttribute('data-animate-number'));
      const duration = 1000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeProgress);
        
        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      // 当元素进入视口时开始动画
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      });

      observer.observe(el);
    });
  }

  // 初始化所有交互增强
  function init() {
    initCollapsible();
    initSmoothScroll();
    initTableOfContents();
    addHoverEffects();
    animateNumbers();
  }

  return {
    init,
    initCollapsible,
    initSmoothScroll,
    initTableOfContents,
    smoothScrollTo
  };
})();