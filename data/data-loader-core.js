/**
 * 语文成长地图 - 核心数据加载器（轻量级）
 * 只包含首屏必需的最小功能集
 */
(function() {
  'use strict';

  var DATA_BASE = './data/';
  var cache = {};

  function loadData(name) {
    if (cache[name]) return Promise.resolve(cache[name]);
    
    return fetch(DATA_BASE + name + '.json')
      .then(function(response) {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(function(data) {
        cache[name] = data;
        return data;
      })
      .catch(function(err) {
        console.warn('Failed to load data:', name, err);
        return null;
      });
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