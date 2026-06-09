(function () {
  'use strict';

  var SECTION_ID = 'ai-tutor';
  var AI_SCRIPT_SRC = 'composition-ai.js';
  var RUN_BUTTON_ID = 'run-ai-tutor';
  var LOADING_MESSAGE = '正在加载 AI 辅导模块...';
  var LOAD_ERROR_MESSAGE = 'AI 辅导模块加载失败，请检查网络后重试。';

  var loaded = false;
  var pending = null;

  function getStatusNode() {
    return document.getElementById('ai-status');
  }

  function setStatus(message, isError) {
    var status = getStatusNode();
    if (!status) return;
    status.textContent = message || '';
    status.classList.toggle('error', Boolean(isError));
  }

  function loadAIScript() {
    if (loaded) return Promise.resolve();
    if (pending) return pending;

    pending = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-composition-ai-script="true"]');
      if (existing && existing.dataset.loaded === 'true') {
        loaded = true;
        pending = null;
        resolve();
        return;
      }

      var script = existing || document.createElement('script');
      script.src = AI_SCRIPT_SRC;
      script.async = true;
      script.dataset.compositionAiScript = 'true';

      script.onload = function () {
        script.dataset.loaded = 'true';
        loaded = true;
        pending = null;
        resolve();
      };

      script.onerror = function () {
        pending = null;
        reject(new Error('Failed to load composition-ai.js'));
      };

      if (!existing) {
        document.body.appendChild(script);
      }
    });

    return pending;
  }

  function prewarm() {
    loadAIScript().catch(function () {});
  }

  function watchIntent(section) {
    if (!section) return;

    section.addEventListener('pointerdown', prewarm, { once: true, passive: true });
    section.addEventListener('focusin', prewarm, { once: true });
    section.addEventListener('mouseenter', prewarm, { once: true });
  }

  function watchVisibility(section) {
    if (!section || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        prewarm();
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.05
    });

    observer.observe(section);
  }

  function watchHash() {
    function shouldLoadForHash(hash) {
      return hash === '#ai-tutor';
    }

    if (shouldLoadForHash(window.location.hash)) {
      prewarm();
    }

    window.addEventListener('hashchange', function () {
      if (shouldLoadForHash(window.location.hash)) {
        prewarm();
      }
    });

    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href="#ai-tutor"]');
      if (link) {
        prewarm();
      }
    }, true);
  }

  function watchRunButton(button) {
    if (!button) return;

    // Re-dispatch the first run click after the AI script is ready.
    button.addEventListener('click', function (event) {
      if (loaded) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      setStatus(LOADING_MESSAGE, false);

      loadAIScript().then(function () {
        window.setTimeout(function () {
          if (getStatusNode() && getStatusNode().textContent === LOADING_MESSAGE) {
            setStatus('', false);
          }
          button.click();
        }, 0);
      }).catch(function () {
        setStatus(LOAD_ERROR_MESSAGE, true);
      });
    }, true);
  }

  function init() {
    var section = document.getElementById(SECTION_ID);
    if (!section) return;

    watchIntent(section);
    watchVisibility(section);
    watchHash();
    watchRunButton(document.getElementById(RUN_BUTTON_ID));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
