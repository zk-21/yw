(function () {
  'use strict';

  window.__searchPageExternalLoaded = true;

  var currentFilter = 'all';
  var currentGrade = 'all';
  var RECENT_KEY = 'searchRecent';
  var MAX_RECENT = 8;
  var fallbackIndexPromise = null;
  var activeSearchToken = 0;

  var RELATED_TERMS = {
    '比喻': ['修辞', '拟人', '排比', '夸张'],
    '李白': ['唐诗', '杜甫', '静夜思', '望庐山瀑布'],
    '病句': ['修改病句', '语病', '搭配不当', '语法'],
    '成语': ['四字词语', '典故', '寓言', '成语故事'],
    '修辞': ['比喻', '拟人', '排比', '夸张', '反问'],
    '唐诗': ['李白', '杜甫', '古诗', '绝句'],
    '标点': ['逗号', '句号', '引号', '分号'],
    '缩句': ['扩句', '缩句练习', '句子成分'],
    '四大名著': ['西游记', '三国演义', '水浒传', '红楼梦'],
    '读后感': ['读书笔记', '心得体会', '写作方法'],
    '近义词': ['反义词', '同义词', '词语辨析'],
    '拼音': ['声母', '韵母', '整体认读', '声调'],
    '作文': ['写作', '范文', '写人', '记事', '写景'],
    '阅读': ['阅读理解', '概括', '赏析', '中心思想']
  };

  var ALL_QUICK_TERMS = Object.keys(RELATED_TERMS);

  function escapeHTML(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadFallbackIndex() {
    if (fallbackIndexPromise) return fallbackIndexPromise;

    fallbackIndexPromise = fetch('data/search-index.json')
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to load search index: ' + response.status);
        return response.json();
      })
      .then(function (index) {
        if (!index || !Array.isArray(index.items)) throw new Error('Invalid search index payload');
        return index;
      })
      .catch(function (error) {
        fallbackIndexPromise = null;
        throw error;
      });

    return fallbackIndexPromise;
  }

  function createSearchClient() {
    var worker = null;
    var requestId = 0;
    var pending = {};
    var workerSupported = typeof Worker !== 'undefined';

    function settlePending(id, error, payload) {
      var entry = pending[id];
      if (!entry) return;
      delete pending[id];
      if (error) entry.reject(error);
      else entry.resolve(payload);
    }

    function teardownWorker() {
      if (worker) {
        worker.terminate();
        worker = null;
      }
      Object.keys(pending).forEach(function (id) {
        settlePending(id, new Error('Search worker terminated'));
      });
    }

    function ensureWorker() {
      if (!workerSupported) return null;
      if (worker) return worker;

      try {
        worker = new Worker('search-worker.js');
        worker.addEventListener('message', function (event) {
          var data = event.data || {};
          var payload = data.payload || {};
          var id = payload.requestId;

          if (data.type === 'search:done') {
            settlePending(id, null, payload.results || []);
            return;
          }

          if (data.type === 'warmup:done') {
            settlePending(id, null, true);
            return;
          }

          if (data.type === 'search:error' || data.type === 'warmup:error') {
            settlePending(id, new Error(payload.error || 'Search worker failed'));
          }
        });
        worker.addEventListener('error', function () {
          workerSupported = false;
          teardownWorker();
        });
        return worker;
      } catch (error) {
        workerSupported = false;
        teardownWorker();
        return null;
      }
    }

    function request(type, payload) {
      var instance = ensureWorker();
      if (!instance) return Promise.reject(new Error('Search worker unavailable'));

      requestId += 1;
      var id = requestId;

      return new Promise(function (resolve, reject) {
        pending[id] = { resolve: resolve, reject: reject };
        instance.postMessage({
          type: type,
          requestId: id,
          keyword: payload && payload.keyword,
          options: payload && payload.options
        });
      });
    }

    function fallbackSearch(keyword, options) {
      return loadFallbackIndex().then(function (index) {
        if (!window.SearchEngine || typeof window.SearchEngine.searchIndexData !== 'function') {
          throw new Error('SearchEngine unavailable');
        }
        return window.SearchEngine.searchIndexData(index.items, keyword, options);
      });
    }

    return {
      warmup: function () {
        if (ensureWorker()) {
          return request('warmup', {}).catch(function () {
            return loadFallbackIndex().then(function () {});
          });
        }
        return loadFallbackIndex().then(function () {});
      },
      search: function (keyword, options) {
        if (ensureWorker()) {
          return request('search', {
            keyword: keyword,
            options: options
          }).catch(function () {
            return fallbackSearch(keyword, options);
          });
        }
        return fallbackSearch(keyword, options);
      }
    };
  }

  var searchClient = createSearchClient();

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function warmSearchIndex() {
    searchClient.warmup().catch(function () {});
  }

  function getRecentSearches() {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch (error) {
      return [];
    }
  }

  function saveRecentSearch(keyword) {
    var recent = getRecentSearches().filter(function (item) {
      return item !== keyword;
    });
    recent.unshift(keyword);
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    renderRecentSearches();
  }

  function renderRecentSearches() {
    var container = document.getElementById('recentSearches');
    var tagsEl = document.getElementById('recentTags');
    var recent = getRecentSearches();

    if (recent.length === 0) {
      container.classList.remove('visible');
      tagsEl.innerHTML = '';
      return;
    }

    container.classList.add('visible');
    tagsEl.innerHTML = recent.map(function (kw) {
      return '<span class="recent-tag" data-kw="' + escapeHTML(kw) + '">' + escapeHTML(kw) + '</span>';
    }).join('');
  }

  function getTypeLabel(type) {
    var labels = {
      grammar: '语法知识',
      vocabulary: '词语学习',
      literary: '文学常识',
      mistake: '常见错误',
      essay: '作文方法',
      exercise: '练习题库'
    };
    return labels[type] || type;
  }

  function getGradeLabel(grade) {
    if (!grade || grade === 0 || grade === '0') return '通用';
    return grade + '年级';
  }

  function getItemGradeLabel(item) {
    return item.gradeRange || getGradeLabel(item.grade);
  }

  function getDifficultyLabel(difficulty) {
    var labels = {
      basic: '基础',
      improve: '提高',
      advanced: '拔尖',
      exam: '小升初'
    };
    return labels[difficulty] || difficulty || '';
  }

  function getSummaryText(item) {
    var summaryText = item.summary || item.content || item.title || '';
    summaryText = String(summaryText)
      .replace(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g, ' ')
      .replace(/[{}\[\]"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!summaryText || summaryText === item.title) {
      summaryText = String(item.content || item.title || '')
        .replace(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g, ' ')
        .replace(/[{}\[\]"]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    return (summaryText || String(item.title || '')).substring(0, 150);
  }

  function withSearchParam(url, keyword) {
    if (!keyword) return url;
    var parts = url.split('#');
    var base = parts[0];
    var hash = parts[1] ? '#' + parts[1] : '';
    var joiner = base.indexOf('?') >= 0 ? '&' : '?';
    return base + joiner + 'q=' + encodeURIComponent(keyword) + hash;
  }

  function getResultHref(item, keyword) {
    var source = item.source || '';
    var typePageMap = {
      grammar: 'grammar.html',
      vocabulary: 'vocabulary.html',
      literary: 'literary.html#data-library',
      mistake: 'practice.html#diagnosis',
      essay: 'composition.html',
      exercise: 'practice.html'
    };

    if (item.type === 'literary') {
      var category = item.category || '';
      if (category.indexOf('必背古诗词') >= 0) return withSearchParam('literary.html#must-know', keyword);
      if (category.indexOf('必读名著') >= 0 || item.title === '四大名著') return withSearchParam('literary.html#must-know', keyword);
      if (category.indexOf('典故') >= 0) return withSearchParam('literary.html#memory-frames', keyword);
      if (category.indexOf('体裁') >= 0) return withSearchParam('literary.html#genre-table', keyword);
      if (category.indexOf('中国古代文学') >= 0 || category.indexOf('中国现当代文学') >= 0 || category.indexOf('外国文学') >= 0) {
        return withSearchParam('literary.html#timeline', keyword);
      }
      return withSearchParam('literary.html#data-library', keyword);
    }

    if (source === 'literary-knowledge.json') return withSearchParam('literary.html#data-library', keyword);
    if (source === 'grammar.json') return 'grammar.html';
    if (source === 'vocabulary.json') return 'vocabulary.html';
    if (source === 'common-mistakes.json') return 'practice.html#diagnosis';
    if (source === 'model-essays.json') return 'composition.html';
    if (source === 'exercises.json') return 'practice.html';
    return typePageMap[item.type] || 'knowledge-map.html';
  }

  function getSuggestions(keyword) {
    var suggestions = [];
    var related = RELATED_TERMS[keyword];
    if (related) {
      related.forEach(function (item) {
        suggestions.push(item);
      });
    }

    ALL_QUICK_TERMS.forEach(function (term) {
      if (term !== keyword && term.indexOf(keyword) >= 0 && suggestions.indexOf(term) < 0) {
        suggestions.push(term);
      }
    });

    if (suggestions.length < 3) {
      ['修辞手法', '修改病句', '成语故事', '古诗', '阅读理解'].forEach(function (term) {
        if (term !== keyword && suggestions.indexOf(term) < 0) suggestions.push(term);
      });
    }

    return suggestions.slice(0, 6);
  }

  function highlightText(text, keyword) {
    var escaped = escapeHTML(text);
    var safeKeyword = escapeHTML(keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp('(' + safeKeyword + ')', 'gi'), '<mark>$1</mark>');
  }

  function renderEmptyResults(keyword) {
    var resultsEl = document.getElementById('results');
    var suggestions = getSuggestions(keyword);
    var suggestHtml = '';

    if (suggestions.length > 0) {
      suggestHtml = '<div class="suggested-search"><p>试试这些相关内容：</p>' +
        suggestions.map(function (item) {
          return '<span class="suggested-tag" data-kw="' + escapeHTML(item) + '">' + escapeHTML(item) + '</span>';
        }).join('') +
        '</div>';
    }

    resultsEl.innerHTML = '<div class="result-empty"><div class="icon">🔍</div><p>没有找到“' + escapeHTML(keyword) + '”相关内容</p><p style="font-size:12px;color:#bbb;">试试调整年级筛选或换一个关键词。</p>' + suggestHtml + '</div>';
  }

  function renderResults(keyword, allResults) {
    var resultsEl = document.getElementById('results');

    if (!allResults || allResults.length === 0) {
      renderEmptyResults(keyword);
      return;
    }

    var grouped = {};
    allResults.forEach(function (item) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item);
    });

    var gradeLabel = currentGrade === 'all' ? '' : ' · ' + currentGrade + '年级';
    var html = '<p style="color:#888;font-size:13px;text-align:center;margin-bottom:16px;">找到 <strong>' + allResults.length + '</strong> 条与“<strong>' + escapeHTML(keyword) + '</strong>”相关的结果' + gradeLabel + '</p>';

    Object.keys(grouped).forEach(function (type) {
      var items = grouped[type];
      html += '<div class="result-db-label">' + getTypeLabel(type) + '<span class="result-count">' + items.length + '条</span></div>';
      items.slice(0, 20).forEach(function (item) {
        var summaryText = getSummaryText(item);
        var metaParts = [getItemGradeLabel(item), item.category, getDifficultyLabel(item.difficulty)].filter(Boolean);
        var href = getResultHref(item, keyword);
        html += '<a class="result-item" href="' + escapeHTML(href) + '">' +
          '<div><strong>' + highlightText(item.title, keyword) + '</strong></div>' +
          '<div>' + highlightText(summaryText, keyword) + '</div>' +
          '<div class="result-path">' + escapeHTML(metaParts.join(' · ')) + ' · ' + escapeHTML(item.source || '') + '</div>' +
          '</a>';
      });
      if (items.length > 20) {
        html += '<p style="color:#999;font-size:12px;text-align:center;">还有 ' + (items.length - 20) + ' 条结果未展开</p>';
      }
    });

    resultsEl.innerHTML = html;
  }

  function setLoadingState(isLoading) {
    var resultsEl = document.getElementById('results');
    var searchBtn = document.getElementById('searchBtn');
    searchBtn.disabled = isLoading;
    searchBtn.textContent = isLoading ? '搜索中...' : '搜索';
    if (isLoading) {
      resultsEl.innerHTML = '<div class="loading-spinner">正在搜索六大资料库...</div>';
    }
  }

  function doSearch() {
    var keyword = document.getElementById('searchInput').value.trim();
    if (!keyword) return;

    var token = activeSearchToken + 1;
    activeSearchToken = token;
    var options = {
      type: currentFilter === 'all' ? null : currentFilter,
      grade: currentGrade
    };

    setLoadingState(true);

    searchClient.search(keyword, options).then(function (results) {
      if (token !== activeSearchToken) return;
      setLoadingState(false);
      saveRecentSearch(keyword);
      renderResults(keyword, results);
    }).catch(function (error) {
      if (token !== activeSearchToken) return;
      setLoadingState(false);
      document.getElementById('results').innerHTML = '<div class="result-empty"><div class="icon">⚠️</div><p>搜索出错，请稍后再试</p></div>';
      console.error(error);
    });
  }

  document.getElementById('recentTags').addEventListener('click', function (event) {
    var tag = event.target.closest('.recent-tag');
    if (!tag || !tag.dataset.kw) return;
    document.getElementById('searchInput').value = tag.dataset.kw;
    doSearch();
  });

  document.getElementById('clearRecent').addEventListener('click', function () {
    localStorage.removeItem(RECENT_KEY);
    renderRecentSearches();
  });

  document.getElementById('filterBar').addEventListener('click', function (event) {
    var chip = event.target.closest('.filter-chip');
    if (!chip) return;
    document.querySelectorAll('.filter-chip').forEach(function (item) {
      item.classList.remove('active');
    });
    chip.classList.add('active');
    currentFilter = chip.dataset.type;
    if (document.getElementById('searchInput').value.trim()) doSearch();
  });

  document.getElementById('gradeFilterBar').addEventListener('click', function (event) {
    var chip = event.target.closest('.grade-filter-chip');
    if (!chip) return;
    document.querySelectorAll('.grade-filter-chip').forEach(function (item) {
      item.classList.remove('active');
    });
    chip.classList.add('active');
    currentGrade = chip.dataset.grade;
    if (document.getElementById('searchInput').value.trim()) doSearch();
  });

  document.getElementById('searchInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') doSearch();
    if (event.key === 'Escape') {
      this.value = '';
      this.focus();
    }
  });

  document.getElementById('searchInput').addEventListener('focus', warmSearchIndex, { once: true });

  document.addEventListener('keydown', function (event) {
    if (
      event.key === '/' &&
      document.activeElement !== document.getElementById('searchInput') &&
      event.target.tagName !== 'INPUT' &&
      event.target.tagName !== 'TEXTAREA'
    ) {
      event.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });

  document.querySelector('.quick-link-grid').addEventListener('click', function (event) {
    var btn = event.target.closest('.quick-link');
    if (!btn || !btn.dataset.keyword) return;
    document.getElementById('searchInput').value = btn.dataset.keyword;
    doSearch();
  });

  document.querySelectorAll('.quick-link-pack').forEach(function (pack) {
    pack.addEventListener('click', function (event) {
      var btn = event.target.closest('.pack-chip');
      if (!btn || !btn.dataset.keyword) return;
      document.getElementById('searchInput').value = btn.dataset.keyword;
      doSearch();
    });
  });

  document.getElementById('results').addEventListener('click', function (event) {
    var suggested = event.target.closest('.suggested-tag');
    if (!suggested || !suggested.dataset.kw) return;
    document.getElementById('searchInput').value = suggested.dataset.kw;
    doSearch();
  });

  document.getElementById('searchBtn').addEventListener('click', doSearch);

  renderRecentSearches();

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(function () {
      warmSearchIndex();
    }, { timeout: 1500 });
  } else {
    setTimeout(function () {
      warmSearchIndex();
    }, 1200);
  }

  var initialQuery = getQueryParam('q').trim();
  if (initialQuery) {
    document.getElementById('searchInput').value = initialQuery;
    doSearch();
  }
})();
