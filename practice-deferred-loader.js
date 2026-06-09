(function () {
  'use strict';

  var MODULES = [
    {
      key: 'practicePageContent',
      src: 'practice-page-content.js?v=78',
      triggerIds: ['flow-pack-library', 'templates'],
      hashPrefixes: ['#pack-', '#writing-grade-'],
      hashValues: ['#templates']
    },
    {
      key: 'threeStageTraining',
      src: 'practice-three-stage.js?v=80',
      triggerIds: ['three-stage-training'],
      hashValues: ['#three-stage-training']
    },
    {
      key: 'templateDrill',
      src: 'practice-template-drill.js?v=80',
      triggerIds: ['template-practice'],
      hashValues: ['#template-practice']
    },
    {
      key: 'guidedChat',
      src: 'practice-guided-chat.js?v=80',
      triggerIds: ['guided-practice-section'],
      hashValues: ['#guided-practice-section']
    }
  ];

  var loaded = {};
  var pending = {};

  function getModuleByKey(key) {
    return MODULES.find(function (item) {
      return item.key === key;
    }) || null;
  }

  function matchesHash(module, hash) {
    if (!module || !hash) return false;

    if (Array.isArray(module.hashValues) && module.hashValues.indexOf(hash) >= 0) {
      return true;
    }

    if (Array.isArray(module.hashPrefixes)) {
      return module.hashPrefixes.some(function (prefix) {
        return hash.indexOf(prefix) === 0;
      });
    }

    return false;
  }

  function findModuleForHash(hash) {
    return MODULES.find(function (module) {
      return matchesHash(module, hash);
    }) || null;
  }

  function getHashTargetId(hash) {
    return String(hash || '').replace(/^#/, '');
  }

  function scrollToHashTarget(hash) {
    var targetId = getHashTargetId(hash);
    if (!targetId) return;

    var target = document.getElementById(targetId);
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setLocationHash(hash) {
    if (!hash) return;
    if (window.history && typeof window.history.replaceState === 'function') {
      window.history.replaceState(null, '', hash);
    } else {
      window.location.hash = hash;
    }
  }

  function loadModule(module) {
    if (!module) return Promise.resolve();
    if (loaded[module.key]) return Promise.resolve();
    if (pending[module.key]) return pending[module.key];

    pending[module.key] = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = module.src;
      script.async = true;
      script.onload = function () {
        loaded[module.key] = true;
        delete pending[module.key];
        resolve();
      };
      script.onerror = function () {
        delete pending[module.key];
        reject(new Error('Failed to load ' + module.src));
      };
      document.body.appendChild(script);
    });

    return pending[module.key];
  }

  function observeModule(module, observer) {
    module.triggerIds.forEach(function (id) {
      var target = document.getElementById(id);
      if (!target) return;

      observer.observe(target);
      target.addEventListener('pointerdown', function () {
        loadModule(module).catch(function () {});
      }, { once: true });
      target.addEventListener('focusin', function () {
        loadModule(module).catch(function () {});
      }, { once: true });
    });
  }

  function initObserver() {
    if (!('IntersectionObserver' in window)) {
      var idleLoad = window.requestIdleCallback || function (callback) {
        window.setTimeout(callback, 250);
      };

      idleLoad(function () {
        MODULES.forEach(function (module) {
          loadModule(module).catch(function () {});
        });
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var module = MODULES.find(function (item) {
          return item.triggerIds.indexOf(entry.target.id) >= 0;
        });

        if (!module) return;

        observer.unobserve(entry.target);
        loadModule(module).catch(function () {});
      });
    }, {
      rootMargin: '500px 0px',
      threshold: 0.01
    });

    MODULES.forEach(function (module) {
      observeModule(module, observer);
    });
  }

  function initHashSupport() {
    function loadFromHash(hash, shouldScroll) {
      var module = findModuleForHash(hash);
      if (!module) return;

      loadModule(module).then(function () {
        if (!shouldScroll) return;
        setLocationHash(hash);
        window.setTimeout(function () {
          scrollToHashTarget(hash);
        }, 0);
      }).catch(function () {});
    }

    if (window.location.hash) {
      loadFromHash(window.location.hash, true);
    }

    window.addEventListener('hashchange', function () {
      loadFromHash(window.location.hash, true);
    });

    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute('href');
      var module = findModuleForHash(hash);
      if (!module || loaded[module.key]) return;

      event.preventDefault();
      loadFromHash(hash, true);
    }, true);
  }

  function init() {
    initObserver();
    initHashSupport();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
