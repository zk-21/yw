/**
 * 语文成长地图 - 核心数据加载器（轻量级）
 * 只包含首屏必需的最小功能集
 */
(function() {
  'use strict';

  var DATA_BASE = './data/';
  var cache = {};
  var pendingLoads = {};
  var DATA_VERSION = (function() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].getAttribute('src') || '';
      if (src.indexOf('data-loader-core.js') !== -1) {
        var match = src.match(/[?&]v=([^&]+)/);
        if (match) return match[1];
      }
    }
    return 'dev';
  })();

  function buildDataUrl(name) {
    return DATA_BASE + name + '.json?v=' + encodeURIComponent(DATA_VERSION);
  }

  function loadData(name) {
    if (cache[name]) return Promise.resolve(cache[name]);
    if (pendingLoads[name]) return pendingLoads[name];

    pendingLoads[name] = fetch(buildDataUrl(name))
      .then(function(response) {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(function(data) {
        cache[name] = data;
        delete pendingLoads[name];
        return data;
      })
      .catch(function(err) {
        delete pendingLoads[name];
        console.warn('Failed to load data:', name, err);
        return null;
      });

    return pendingLoads[name];
  }

  // 安全读取localStorage
  function safeParse(key, defaultValue) {
    try {
      var val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch(e) {
      return defaultValue;
    }
  }

  // 核心API
  window.DataLibCore = {
    load: loadData,
    safeParse: safeParse,
    cache: cache
  };
})();