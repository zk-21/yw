(function() {
  'use strict';

  var hasLoadedTools = false;

  function getCurrentVersion() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].getAttribute('src') || '';
      if (src.indexOf('practice-exercise-loader.js') !== -1) {
        var match = src.match(/[?&]v=([^&]+)/);
        if (match) return match[1];
      }
    }
    return 'dev';
  }

  function loadExerciseTools() {
    if (hasLoadedTools) return;
    hasLoadedTools = true;

    var script = document.createElement('script');
    script.src = 'practice-exercise-tools.js?v=' + encodeURIComponent(getCurrentVersion());
    script.async = true;
    script.onerror = function() {
      var container = document.getElementById('exercises-index-container');
      if (container) {
        container.innerHTML = '<p style="color:#c62828;text-align:center;padding:20px;grid-column:1/-1;">题库工具加载失败，请刷新重试。</p>';
      }
    };
    document.body.appendChild(script);
  }

  function observeExerciseSection() {
    var target = document.getElementById('exercises-index-container');
    if (!target || !('IntersectionObserver' in window)) {
      loadExerciseTools();
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        loadExerciseTools();
      });
    }, {
      rootMargin: '400px 0px',
      threshold: 0.01
    });

    observer.observe(target);
  }

  window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing-training-sheet');
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeExerciseSection);
  } else {
    observeExerciseSection();
  }
})();
