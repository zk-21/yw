/**
 * 语文成长地图 - 全局资料库加载器 (非 ES Module 版本)
 * 适用于所有使用 <script> 标签的 HTML 页面
 * 加载后通过 window.DataLib 访问所有 API
 * 
 * 使用方式：
 *   <script src="data/data-loader-global.js"></script>
 *   <script>
 *     DataLib.load('grammar').then(data => { ... });
 *     DataLib.renderGrammarSection('grade3', container);
 *     DataLib.search('比喻').then(results => { ... });
 *   </script>
 */
(function() {
  'use strict';

  var DATA_BASE = './data/';
  var cache = {};
  var DATA_VERSION = (function() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].getAttribute('src') || '';
      if (src.indexOf('data-loader-global.js') !== -1) {
        var match = src.match(/[?&]v=([^&]+)/);
        if (match) return match[1];
      }
    }
    return 'dev';
  })();
  var STORAGE_PREFIX = 'datalib_' + DATA_VERSION + '_';
  var STORAGE_TTL = 24 * 60 * 60 * 1000; // 24小时

  function _storageKey(name) { return STORAGE_PREFIX + name; }

  function _storageGet(name) {
    try {
      var raw = localStorage.getItem(_storageKey(name));
      if (!raw) return null;
      var entry = JSON.parse(raw);
      if (Date.now() - entry._t > STORAGE_TTL) { localStorage.removeItem(_storageKey(name)); return null; }
      return entry._d;
    } catch(e) { return null; }
  }

  function _storageSet(name, data) {
    try { localStorage.setItem(_storageKey(name), JSON.stringify({ _d: data, _t: Date.now() })); } catch(e) {}
  }

  // ============ 核心加载 API ============

  function loadData(name) {
    if (cache[name]) return Promise.resolve(cache[name]);
    
    // 尝试 localStorage 缓存
    var stored = _storageGet(name);
    if (stored) {
      cache[name] = stored;
      return Promise.resolve(stored);
    }

    var url = DATA_BASE + name + '.json?v=' + encodeURIComponent(DATA_VERSION);
    return fetch(url)
      .then(function(resp) {
        if (!resp.ok) throw new Error('加载失败: ' + url + ' (' + resp.status + ')');
        return resp.json();
      })
      .then(function(data) {
        cache[name] = data;
        _storageSet(name, data);
        return data;
      })
      .catch(function(err) {
        console.error('资料库加载失败: ' + name, err);
        return null;
      });
  }

  function preloadAll(names) {
    return Promise.all(names.map(function(n) {
      return loadData(n).then(function(data) { return [n, data]; });
    })).then(function(results) {
      var obj = {};
      results.forEach(function(r) { obj[r[0]] = r[1]; });
      return obj;
    });
  }

  function queryData(dbName, path) {
    return loadData(dbName).then(function(data) {
      if (!data) return null;
      var keys = path.split('.');
      var result = data;
      for (var i = 0; i < keys.length; i++) {
        if (result == null) return null;
        result = result[keys[i]];
      }
      return result;
    });
  }

  // ============ 搜索 API ============

  function search(dbName, keyword) {
    return loadData(dbName).then(function(data) {
      if (!data) return [];
      var results = [];
      (function deepSearch(obj, path) {
        if (Array.isArray(obj)) {
          obj.forEach(function(item, i) { deepSearch(item, path + '[' + i + ']'); });
        } else if (typeof obj === 'object' && obj !== null) {
          Object.entries(obj).forEach(function(entry) {
            deepSearch(entry[1], path + '.' + entry[0]);
          });
        } else if (typeof obj === 'string' && obj.indexOf(keyword) !== -1) {
          results.push({ path: path, value: obj });
        }
      })(data, '');
      return results;
    });
  }

  function fuzzySearch(keyword, databases) {
    var dbs = databases || ['grammar', 'vocabulary', 'literary-knowledge', 'common-mistakes', 'model-essays', 'exercises', 'grades'];
    return Promise.all(dbs.map(function(db) {
      return search(db, keyword).then(function(results) {
        return results.map(function(r) { r.database = db; return r; });
      });
    })).then(function(all) {
      // 兼容旧浏览器（不用 flat()）
      var merged = [];
      all.forEach(function(arr) { merged = merged.concat(arr); });
      return merged;
    });
  }

  // 使用预生成的搜索索引进行搜索（更快更准）
  function searchIndex(keyword, options) {
    var opts = options || {};
    var filterType = opts.type || null;
    var filterGrade = opts.grade || null;
    var typeKeywords = {
      grammar: '语法 知识',
      vocabulary: '词汇 词语',
      literary: '文学 常识',
      mistake: '错题 常见错误 易错',
      essay: '作文 写作 范文 方法',
      exercise: '题库 练习 习题'
    };

    function getSearchText(item) {
      return [
        item.title,
        item.summary,
        item.content,
        item.category,
        item.source,
        typeKeywords[item.type] || item.type,
        item.difficulty,
        (item.abilities || []).join(' '),
        (item.keywords || []).join(' ')
      ].filter(Boolean).join(' ').toLowerCase();
    }

    function parseGradeRange(text) {
      var raw = String(text || '');
      var rangeMatch = raw.match(/([1-6])\s*(?:-|—|~|至|到)\s*([1-6])\s*年?级?/);
      if (rangeMatch) {
        return {
          min: Math.min(parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10)),
          max: Math.max(parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10))
        };
      }
      return null;
    }

    function matchGrade(item, gradeValue) {
      if (!gradeValue || gradeValue === 'all') return true;
      var target = parseInt(gradeValue, 10);
      if (!target) return true;

      var minGrade = parseInt(item.minGrade, 10);
      var maxGrade = parseInt(item.maxGrade, 10);
      if (minGrade && maxGrade) return target >= minGrade && target <= maxGrade;

      var range = parseGradeRange(item.gradeRange) || parseGradeRange(item.category);
      if (!range && item.content) {
        var applicable = String(item.content).match(/适用年级["']?\s*[:：]\s*["']?\s*([1-6]\s*(?:-|—|~|至|到)\s*[1-6]\s*年级|[1-6]\s*年级)/);
        range = applicable ? parseGradeRange(applicable[1]) : null;
      }
      if (range) return target >= range.min && target <= range.max;

      var grade = parseInt(item.grade, 10);
      if (!grade) return true;
      return grade === target;
    }
    
    return loadData('search-index').then(function(index) {
      if (!index || !index.items) return [];
      
      var keywords = keyword.toLowerCase().split(/\s+/).filter(function(k) { return k.length > 0; });
      
      var results = index.items.filter(function(item) {
        var content = getSearchText(item);
        
        // 关键词匹配（所有关键词都要出现）
        var matchAll = keywords.every(function(k) { return content.indexOf(k) >= 0; });
        if (!matchAll) return false;
        
        // 类型过滤
        if (filterType && item.type !== filterType) return false;
        
        // 年级过滤
        if (!matchGrade(item, filterGrade)) return false;
        
        return true;
      });
      
      // 排序：标题匹配优先，然后按年级排序
      results.sort(function(a, b) {
        var aTitleMatch = a.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ? 0 : 1;
        var bTitleMatch = b.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ? 0 : 1;
        if (aTitleMatch !== bTitleMatch) return aTitleMatch - bTitleMatch;
        return a.grade - b.grade;
      });
      
      return results;
    });
  }

  // ============ 便捷查询 API ============

  function getTeachingTip(category, key) {
    return loadData(category).then(function(data) {
      if (!data) return null;
      function findTip(obj) {
        for (var k in obj) {
          if (!obj.hasOwnProperty(k)) continue;
          if (k.indexOf('口诀') !== -1 || k.indexOf('教学') !== -1) {
            if (key && obj[k] && obj[k][key]) return obj[k][key];
            if (!key) return obj[k];
          }
          if (typeof obj[k] === 'object' && obj[k] !== null) {
            var result = findTip(obj[k]);
            if (result) return result;
          }
        }
        return null;
      }
      return findTip(data);
    });
  }

  function getByGrade(dbName, grade) {
    return loadData(dbName).then(function(data) {
      if (!data) return [];
      var results = [];
      (function collect(obj, path) {
        if (Array.isArray(obj)) {
          obj.forEach(function(item, i) {
            if (item.年级 === grade || item.适用年级 === grade) {
              results.push(Object.assign({}, item, { _path: path }));
            }
            collect(item, path + '[' + i + ']');
          });
        } else if (typeof obj === 'object' && obj !== null) {
          Object.entries(obj).forEach(function(entry) {
            collect(entry[1], path + '.' + entry[0]);
          });
        }
      })(data, '');
      return results;
    });
  }

  // ============ 渲染辅助函数 ============

  /**
   * 渲染语法知识点卡片
   * @param {string} grade - 年级名, 如 'grade3'
   * @param {HTMLElement} container - 目标容器
   */
  function renderGrammarByGrade(grade, container) {
    if (!container) return;
    var gradeNum = parseInt(grade.replace('grade', ''), 10);
    if (!gradeNum) return;

    loadData('grammar').then(function(data) {
      if (!data) {
        container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">资料加载中...</p>';
        return;
      }

      var html = '';
      
      // 标点符号
      var allPunctuation = [];
      if (data['标点符号']) {
        ['基础标点', '进阶标点', '高级标点'].forEach(function(cat) {
          if (data['标点符号'][cat]) {
            data['标点符号'][cat].forEach(function(item) {
              if (item.年级 <= gradeNum) allPunctuation.push(item);
            });
          }
        });
      }
      if (allPunctuation.length > 0) {
        html += '<div class="grammar-card"><h3>🔤 标点符号</h3>';
        allPunctuation.forEach(function(item) {
          html += '<p><strong>' + item.符号 + ' ' + item.名称 + '：</strong>' + item.规则 + '</p>';
          if (item.正例) html += '<div class="example-box"><strong>例子：</strong>' + item.正例 + '</div>';
        });
        html += '</div>';
      }

      // 词性
      if (data['词性']) {
        var allCiXing = [];
        if (data['词性']['实词']) {
          data['词性']['实词'].forEach(function(item) {
            if (item.适用年级 <= gradeNum) allCiXing.push(item);
          });
        }
        if (data['词性']['虚词']) {
          data['词性']['虚词'].forEach(function(item) {
            if (item.适用年级 <= gradeNum) allCiXing.push(item);
          });
        }
        if (allCiXing.length > 0) {
          html += '<div class="grammar-card"><h3>🔤 词性知识</h3>';
          allCiXing.forEach(function(item) {
            html += '<p><strong>' + item.名称 + '：</strong>' + item.定义 + '</p>';
            html += '<div class="example-box"><strong>例子：</strong>' + (item.例子 ? item.例子.join('、') : '') + '</div>';
          });
          if (data['词性']['教学口诀']) {
            html += '<div class="tip">💡 ' + data['词性']['教学口诀']['三字鉴定法'] + '</div>';
          }
          html += '</div>';
        }
      }

      // 修辞手法
      if (data['修辞手法'] && data['修辞手法']['基础修辞']) {
        var applicableRhetoric = data['修辞手法']['基础修辞'].filter(function(r) { return r.年级 <= gradeNum; });
        if (applicableRhetoric.length > 0) {
          html += '<div class="grammar-card"><h3>🎯 修辞手法</h3>';
          applicableRhetoric.forEach(function(r) {
            html += '<p><strong>' + r.名称 + '：</strong>' + r.定义 + '</p>';
            html += '<div class="example-box"><strong>例子：</strong>' + (r.正例 || '') + '</div>';
          });
          if (data['修辞手法']['三层答题法']) {
            html += '<details style="margin-top:10px;"><summary style="cursor:pointer;color:#667eea;font-weight:bold;">📐 修辞三层答题法</summary>';
            html += '<p style="font-size:13px;margin:6px 0;">第一层：' + data['修辞手法']['三层答题法']['第一层'] + '</p>';
            html += '<p style="font-size:13px;margin:6px 0;">第二层：' + data['修辞手法']['三层答题法']['第二层'] + '</p>';
            html += '<p style="font-size:13px;margin:6px 0;">第三层：' + data['修辞手法']['三层答题法']['第三层'] + '</p>';
            html += '<div class="example-box">✅ ' + data['修辞手法']['三层答题法']['满分示例'] + '</div>';
            html += '</details>';
          }
          html += '</div>';
        }
      }

      // 关联词
      if (data['关联词'] && data['关联词']['分类']) {
        var applicableConnectors = data['关联词']['分类'].filter(function(c) { return c.年级 <= gradeNum; });
        if (applicableConnectors.length > 0) {
          html += '<div class="grammar-card"><h3>🔗 关联词</h3>';
          applicableConnectors.forEach(function(c) {
            html += '<p><strong>' + c.关系 + '：</strong>' + c.关联词.join(' / ') + '</p>';
            if (c.例句) html += '<div class="example-box">' + c.例句 + '</div>';
          });
          html += '</div>';
        }
      }

      // 病句类型
      if (data['病句修改'] && data['病句修改']['常见类型']) {
        var applicableBingju = data['病句修改']['常见类型'].filter(function(b) { return b.年级 <= gradeNum; });
        if (applicableBingju.length > 0) {
          html += '<div class="grammar-card"><h3>📋 病句类型</h3>';
          applicableBingju.forEach(function(b) {
            html += '<p><strong>' + b.病因 + '：</strong>' + b.说明 + '</p>';
            html += '<div class="example-box">❌ ' + b.病句 + '<br>✅ ' + b.修改 + '</div>';
          });
          if (data['病句修改']['修改铁律']) {
            html += '<div class="tip">🔧 ' + data['病句修改']['修改铁律'] + '</div>';
          }
          html += '</div>';
        }
      }

      // 句型变换
      if (data['句型变换']) {
        var allJuxing = [];
        if (data['句型变换']['基础变换']) allJuxing = allJuxing.concat(data['句型变换']['基础变换']);
        if (data['句型变换']['进阶变换']) allJuxing = allJuxing.concat(data['句型变换']['进阶变换']);
        var applicableJuxing = allJuxing.filter(function(s) { return s.年级 <= gradeNum; });
        if (applicableJuxing.length > 0) {
          html += '<div class="grammar-card"><h3>🔄 句型变换</h3>';
          applicableJuxing.forEach(function(s) {
            html += '<p><strong>' + s.类型 + '：</strong>' + (s.格式 || s.定义 || s.口诀 || s.方法 || '') + '</p>';
            html += '<div class="example-box"><strong>例子：</strong>' + (s.正例 || '') + '</div>';
          });
          if (data['句型变换']['缩句铁律']) {
            html += '<div class="tip">✂️ ' + data['句型变换']['缩句铁律'] + '</div>';
          }
          if (data['句型变换']['扩句铁律']) {
            html += '<div class="tip">📝 ' + data['句型变换']['扩句铁律'] + '</div>';
          }
          html += '</div>';
        }
      }

      // 学习口诀汇总（从多个位置收集）
      var allTips = [];
      if (data['词性'] && data['词性']['教学口诀']) {
        Object.entries(data['词性']['教学口诀']).forEach(function(entry) { allTips.push(entry[0] + '：' + entry[1]); });
      }
      if (data['标点符号'] && data['标点符号']['教学口诀']) {
        Object.entries(data['标点符号']['教学口诀']).forEach(function(entry) { allTips.push(entry[0] + '：' + entry[1]); });
      }
      if (data['标点符号'] && data['标点符号']['小升初失分点']) {
        data['标点符号']['小升初失分点'].forEach(function(t) { allTips.push(t); });
      }
      if (allTips.length > 0) {
        html += '<div class="grammar-card"><h3>📌 学习口诀</h3>';
        allTips.forEach(function(t) {
          html += '<div class="tip" style="margin-bottom:8px;">💡 ' + t + '</div>';
        });
        html += '</div>';
      }

      container.innerHTML = html || '<p style="color:#999; text-align:center; padding:20px;">暂无该年级的语法资料</p>';
    });
  }

  /**
   * 渲染词汇卡片 - 成语 / 同义词 / 反义词
   */
  function renderVocabularySection(category, container, limit) {
    if (!container) return;
    loadData('vocabulary').then(function(data) {
      if (!data) return;
      var html = '';
      var items = data[category];
      if (!items) return;

      // 多音字特殊处理
      if (category === '多音字' && Array.isArray(items)) {
        var displayItems = limit ? items.slice(0, limit) : items;
        html += '<div class="responsive-table"><table><thead><tr><th>字</th><th>读音1</th><th>读音2</th></tr></thead><tbody>';
        displayItems.forEach(function(item) {
          html += '<tr><td style="font-size:24px;font-weight:bold;">' + item.字 + '</td>';
          html += '<td>' + item.读音1 + '</td><td>' + item.读音2 + '</td></tr>';
        });
        html += '</tbody></table></div>';

      // 反义词是对象（单字/双字子分类）
      } else if (category === '反义词' && typeof items === 'object' && !Array.isArray(items)) {
        Object.entries(items).forEach(function(entry) {
          html += '<h4 style="color:#667eea; margin:12px 0 8px;">' + entry[0] + '反义词</h4>';
          entry[1].forEach(function(item) {
            html += '<div class="vocab-chip" style="display:inline-block; background:#fff3e0; padding:6px 12px; margin:4px; border-radius:20px; font-size:14px;">';
            html += item.词A + ' ↔ ' + item.词B;
            html += '</div>';
          });
        });

      // 词语形式（ABB式/AABB式，纯字符串数组）
      } else if (category === '词语形式' && typeof items === 'object' && !Array.isArray(items)) {
        Object.entries(items).forEach(function(entry) {
          html += '<h4 style="color:#667eea; margin:12px 0 8px;">' + entry[0] + '</h4>';
          entry[1].forEach(function(item) {
            var word = typeof item === 'string' ? item : (item.词语 || '');
            html += '<div class="vocab-chip" style="display:inline-block; background:#e8f5e9; padding:6px 12px; margin:4px; border-radius:20px; font-size:14px;">' + word + '</div>';
          });
        });

      // 普通数组
      } else if (Array.isArray(items)) {
        var displayItems = limit ? items.slice(0, limit) : items;
        displayItems.forEach(function(item) {
          if (item.成语) {
            html += '<div class="vocab-chip" style="display:inline-block; background:#f0f4ff; padding:6px 12px; margin:4px; border-radius:20px; font-size:14px;">';
            html += '<strong>' + item.成语 + '</strong>';
            if (item.拼音) html += ' <small style="color:#888;">' + item.拼音 + '</small>';
            if (item.释义) html += ' — ' + item.释义;
            html += '</div>';
          } else if (item.词语) {
            html += '<div class="vocab-chip" style="display:inline-block; background:#eef8f2; padding:6px 12px; margin:4px; border-radius:20px; font-size:14px;">';
            html += '<strong>' + item.词语 + '</strong>';
            if (item.拼音) html += ' <small style="color:#888;">' + item.拼音 + '</small>';
            if (item.释义) html += ' — ' + item.释义;
            if (item.例句) html += '<br><small style="color:#666;">例：' + item.例句 + '</small>';
            html += '</div>';
          } else if (item.词A && item.词B) {
            html += '<div class="vocab-chip" style="display:inline-block; background:#fff3e0; padding:6px 12px; margin:4px; border-radius:20px; font-size:14px;">';
            html += item.词A + ' ↔ ' + item.词B;
            html += '</div>';
          }
        });

      // 对象（如成语分类）
      } else if (typeof items === 'object') {
        Object.entries(items).forEach(function(entry) {
          var catName = entry[0];
          var catItems = entry[1];
          if (!Array.isArray(catItems)) return;
          html += '<h4 style="color:#667eea; margin:12px 0 8px;">' + catName + '</h4>';
          catItems.forEach(function(item) {
            var word = item.成语 || item.词语 || item.字 || '';
            html += '<div class="vocab-chip" style="display:inline-block; background:#f0f4ff; padding:6px 12px; margin:4px; border-radius:20px; font-size:14px;">';
            html += '<strong>' + word + '</strong>';
            if (item.拼音) html += ' <small style="color:#888;">' + item.拼音 + '</small>';
            if (item.释义) html += ' — ' + item.释义;
            if (item.例句) html += '<br><small style="color:#666;">例：' + item.例句 + '</small>';
            html += '</div>';
          });
        });
      }

      // 教学口诀
      var tipKey = category + '教学口诀';
      if (data[tipKey]) {
        html += '<div class="tip" style="margin-top:12px;">💡 ' + data[tipKey] + '</div>';
      }

      container.innerHTML = html;
    });
  }

  /**
   * 渲染文学常识时间轴
   */
  function renderLiteraryTimeline(container) {
    if (!container) return;
    loadData('literary-knowledge').then(function(data) {
      if (!data) return;
      var timeline = data['文学史脉络'];
      if (!timeline || !timeline.朝代) return;

      var html = '<div class="timeline">';
      timeline.朝代.forEach(function(dynasty) {
        html += '<div class="timeline-item" style="background:white; border-radius:12px; padding:16px; margin-bottom:14px; box-shadow:0 2px 10px rgba(0,0,0,0.06); border-left:4px solid #667eea;">';
        html += '<h4 style="color:#667eea; margin:0 0 8px;">' + dynasty.朝代 + ' <small style="color:#888;">' + dynasty.时间 + '</small></h4>';
        html += '<p style="font-size:13px; color:#555; margin:0 0 6px;">' + dynasty.特点 + '</p>';
        html += '<p style="font-size:12px; color:#888;"><strong>代表作家：</strong>' + dynasty.代表作家.join('、') + '</p>';
        html += '<p style="font-size:12px; color:#888;"><strong>代表作品：</strong>' + dynasty.代表作品.join('、') + '</p>';
        html += '</div>';
      });
      html += '</div>';
      container.innerHTML = html;
    });
  }

  /**
   * 渲染常见错误列表
   */
  function renderCommonMistakes(container, grade) {
    if (!container) return;
    loadData('common-mistakes').then(function(data) {
      if (!data || !data.错误分类) return;
      var html = '';
      data.错误分类.forEach(function(errType) {
        // 如果有年级过滤
        if (grade) {
          var range = errType['年级范围'];
          if (range && range !== '1-6') {
            var parts = range.split('-');
            var g = parseInt(grade, 10);
            if (g < parseInt(parts[0], 10) || g > parseInt(parts[1], 10)) return;
          }
        }
        html += '<div class="grammar-card" style="margin-bottom:12px;">';
        html += '<h4 style="color:#e65100;">⚠️ ' + errType.类别 + ' <small style="color:#888; font-weight:normal;">年级' + errType['年级范围'] + '</small></h4>';
        html += '<p style="font-size:13px; color:#555;">' + errType.说明 + '</p>';
        if (errType.典型错误) {
          html += '<div class="responsive-table" style="margin-top:8px;"><table style="font-size:12px;"><thead><tr><th>错误</th><th>正确/改善</th><th>原因/表现</th></tr></thead><tbody>';
          errType.典型错误.slice(0, 5).forEach(function(e) {
            html += '<tr><td style="color:#e65100;">' + (e.错误 || e.错误示例 || '') + '</td>';
            html += '<td style="color:#2e7d32;">' + (e.正确 || e.正确句式 || e.正确示例 || e.正确规则 || e.改善 || '') + '</td>';
            html += '<td>' + (e.原因 || e.说明 || e.表现 || e.例子 || '') + '</td></tr>';
          });
          html += '</tbody></table></div>';
        }
        if (errType.纠正策略) {
          html += '<div class="tip">💡 ' + errType.纠正策略 + '</div>';
        }
        html += '</div>';
      });
      container.innerHTML = html;
    });
  }

  /**
   * 渲染作文类型参考
   */
  function renderEssayTypes(container, showMethods) {
    if (!container) return;
    loadData('model-essays').then(function(data) {
      if (!data) return;
      var html = '';

      if (data.作文类型) {
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;">';
        data.作文类型.forEach(function(type) {
          html += '<div class="grammar-card" style="margin-bottom:0;">';
          html += '<h4>✏️ ' + type.类型 + '</h4>';
          html += '<p style="font-size:13px;color:#666;margin:0 0 8px;">' + type.说明 + '</p>';

          var elements3 = type['3-4年级要素'];
          if (elements3) {
            html += '<p style="font-size:12px;color:#888;"><strong>3-4年级：</strong>' + elements3.join(' → ') + '</p>';
          }
          var elements5 = type['5-6年级要素'];
          if (elements5) {
            html += '<p style="font-size:12px;color:#888;"><strong>5-6年级：</strong>' + elements5.join(' → ') + '</p>';
          }
          if (type.要素 && !elements3 && !elements5) {
            html += '<p style="font-size:12px;color:#888;">' + (Array.isArray(type.要素) ? type.要素.join(' → ') : type.要素) + '</p>';
          }
          if (type.常见问题) {
            html += '<div style="margin-top:6px;">';
            type.常见问题.slice(0, 2).forEach(function(p) {
              html += '<p style="font-size:11px;color:#c62828;margin:2px 0;">⚠️ ' + p + '</p>';
            });
            html += '</div>';
          }
          html += '</div>';
        });
        html += '</div>';
      }

      if (showMethods && data.写作通用方法) {
        html += '<div class="grammar-card" style="margin-top:16px;"><h4>📝 写作通用方法</h4>';
        data.写作通用方法.forEach(function(method) {
          var methodBody = method.说明 || method.description || method.内容 || method.content || '';
          if (Array.isArray(methodBody)) methodBody = methodBody.join(' → ');
          html += '<p style="margin:8px 0;"><strong>' + (method.名称 || method.name || '') + '：</strong>' + methodBody + '</p>';
        });
        html += '</div>';
      }

      var scoreRows = data['20分制评分标准'];
      if (!scoreRows && data.评分标准 && data.评分标准['20分制']) {
        scoreRows = Object.keys(data.评分标准['20分制']).map(function(level) {
          return { 维度: level, 分值: '', 标准: data.评分标准['20分制'][level] };
        });
      }
      if (scoreRows) {
        html += '<div class="grammar-card" style="margin-top:16px;"><h4>📊 20分制作文评分标准</h4>';
        html += '<div class="responsive-table"><table style="font-size:12px;"><thead><tr><th>维度</th><th>分值</th><th>评分标准</th></tr></thead><tbody>';
        scoreRows.forEach(function(c) {
          html += '<tr><td>' + c.维度 + '</td><td>' + (c.分值 ? c.分值 + '分' : '-') + '</td><td>' + c.标准 + '</td></tr>';
        });
        html += '</tbody></table></div></div>';
      }

      container.innerHTML = html;
    });
  }

  /**
   * 渲染资料库状态概览
   */
  function renderDataOverview(container) {
    if (!container) return;
    var dbs = [
      { name: 'grammar', label: '语法知识', icon: '📚' },
      { name: 'vocabulary', label: '词语学习', icon: '📝' },
      { name: 'exercises', label: '练习题库', icon: '✏️' },
      { name: 'literary-knowledge', label: '文学常识', icon: '📖' },
      { name: 'common-mistakes', label: '常见错误', icon: '⚠️' },
      { name: 'model-essays', label: '范文方法', icon: '🏆' },
      { name: 'grades', label: '年级元数据', icon: '🎯' }
    ];

    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">';
    dbs.forEach(function(db) {
      html += '<div class="data-card" style="background:white;border-radius:12px;padding:16px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.06);cursor:pointer;transition:all 0.2s;" onclick="DataLib.showDataPreview(\'' + db.name + '\')">';
      html += '<div style="font-size:32px;margin-bottom:8px;">' + db.icon + '</div>';
      html += '<strong style="color:#333;">' + db.label + '</strong>';
      html += '<div style="font-size:12px;color:#999;margin-top:4px;" id="stat-' + db.name + '">加载中...</div>';
      html += '</div>';

      // 异步加载统计
      loadData(db.name).then(function(data) {
        var statEl = document.getElementById('stat-' + db.name);
        if (!statEl || !data) return;
        var count = 0;
        var meta = data._meta;
        try {
          count = JSON.stringify(data).length;
        } catch(e) {}
        var sizeKB = (count / 1024).toFixed(1);
        var desc = meta ? meta.description : '';
        statEl.textContent = sizeKB + ' KB';
        statEl.title = desc;
      });
    });
    html += '</div>';
    container.innerHTML = html;
  }

  /**
   * 显示单个资料库的预览
   */
  function showDataPreview(dbName) {
    loadData(dbName).then(function(data) {
      if (!data) return;
      var modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
      modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

      var content = document.createElement('div');
      content.style.cssText = 'background:white;border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;';
      
      var meta = data._meta || {};
      var labelMap = {
        'grammar': '语法知识',
        'vocabulary': '词语学习',
        'exercises': '练习题库',
        'literary-knowledge': '文学常识',
        'common-mistakes': '常见错误',
        'model-essays': '范文方法',
        'grades': '年级元数据'
      };

      var topKeys = Object.keys(data).filter(function(k) { return k !== '_meta'; }).slice(0, 10);
      var contentPreview = topKeys.map(function(k) {
        var val = data[k];
        if (Array.isArray(val)) return '<span style="background:#f0f4ff;padding:2px 8px;border-radius:12px;margin:2px;display:inline-block;font-size:12px;">' + k + ' (' + val.length + '条)</span>';
        if (typeof val === 'object' && val !== null) return '<span style="background:#fff3e0;padding:2px 8px;border-radius:12px;margin:2px;display:inline-block;font-size:12px;">' + k + ' (' + Object.keys(val).length + '项)</span>';
        return '';
      }).join(' ');

      content.innerHTML = '<h3 style="margin:0 0 8px;">📦 ' + labelMap[dbName] + '</h3>' +
        '<p style="color:#888;font-size:13px;margin:0 0 12px;">' + (meta.description || '') + '</p>' +
        '<p style="font-size:12px;color:#999;">版本: ' + (meta.version || '1.0') + ' | 更新: ' + (meta.lastUpdated || '') + '</p>' +
        '<div style="margin:12px 0;">' + contentPreview + '</div>' +
        '<button style="margin-top:12px;padding:8px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;" onclick="this.closest(\'div\').parentElement.remove()">关闭</button>';
      
      modal.appendChild(content);
      document.body.appendChild(modal);
    });
  }

  // ============ 年级数据驱动渲染（基于 grades.json）============

  /**
   * 加载年级元数据（带缓存）
   */
  function loadGrades() {
    return loadData('grades');
  }

  /**
   * 渲染年级英雄区（page-head）
   * @param {string|number} gradeId - '1'~'6'
   * @param {HTMLElement} container
   * @param {object} overrides - 可选覆盖字段
   */
  function renderGradeHero(gradeId, container, overrides) {
    if (!container) return;
    loadGrades().then(function(data) {
      if (!data || !data[gradeId]) return;
      var g = data[gradeId];
      var cls = 'grade-' + (gradeId === '1' ? 'one' : gradeId === '2' ? 'two' : gradeId === '3' ? 'three' : gradeId === '4' ? 'four' : gradeId === '5' ? 'five' : 'six');
      var eyebrow = (overrides && overrides.eyebrow) || g.eyebrow || '';
      var title = (overrides && overrides.heroTitle) || g.heroTitle || '';
      var desc = (overrides && overrides.heroDesc) || g.heroDesc || '';
      container.className = 'page-head ' + cls;
      container.innerHTML =
        '<p class="eyebrow">' + eyebrow + '</p>' +
        '<h1>' + title + '</h1>' +
        (desc ? '<p>' + desc + '</p>' : '');
    });
  }

  /**
   * 渲染课标能力对照表
   */
  function renderGradeCurriculum(gradeId, container) {
    if (!container) return;
    loadGrades().then(function(data) {
      if (!data || !data[gradeId] || !data[gradeId].curriculum) return;
      var cur = data[gradeId].curriculum;
      var html = '<div class="table-card"><h2>课标能力对照表</h2><div class="responsive-table"><table>';
      html += '<thead><tr>';
      (cur.headers || ['课标维度','本页对应内容','达标证据','拔尖表现']).forEach(function(h) {
        html += '<th>' + h + '</th>';
      });
      html += '</tr></thead><tbody>';
      cur.rows.forEach(function(row) {
        html += '<tr><td>' + row.dimension + '</td><td>' + row.content + '</td><td>' + row.standard + '</td><td>' + row.advanced + '</td></tr>';
      });
      html += '</tbody></table></div></div>';
      container.innerHTML = html;
    });
  }

  /**
   * 渲染教材单元映射矩阵
   */
  function renderGradeUnitMatrix(gradeId, container) {
    if (!container) return;
    loadGrades().then(function(data) {
      if (!data || !data[gradeId] || !data[gradeId].unitCoverage) return;
      var matrix = data[gradeId].unitCoverage;
      var rows = matrix.rows || [];
      if (!rows.length) return;

      var html = '<div class="table-card"><h2>' + (matrix.title || '教材单元映射') + '</h2>';
      if (matrix.textbookVersion) {
        html += '<p style="color:#333;font-weight:600;margin-top:-4px;margin-bottom:6px;">教材版本：' + matrix.textbookVersion + '</p>';
      }
      if (matrix.note) html += '<p style="color:#666;margin-top:0;">' + matrix.note + '</p>';
      html += '<div class="responsive-table"><table><thead><tr>';
      (matrix.headers || ['学期', '单元 / 代表课文', '核心能力', '典型题型', '常见错因']).forEach(function(h) {
        html += '<th>' + h + '</th>';
      });
      html += '</tr></thead><tbody>';
      rows.forEach(function(row) {
        var lessonText = row.lesson ? '<div style="font-size:12px;color:#666;margin-top:4px;">' + row.lesson + '</div>' : '';
        var unitCell = row.unit || row.direction || '';
        if (row.theme) {
          unitCell += '<div style="font-size:12px;color:#666;margin-top:4px;">主题：' + row.theme + '</div>';
        }
        html += '<tr>' +
          '<td>' + (row.semester || row.term || '') + '</td>' +
          '<td>' + unitCell + lessonText + '</td>' +
          '<td>' + (row.focus || row.words || '') + '</td>' +
          '<td>' + (row.questionTypes || row.reading || '') + '</td>' +
          '<td>' + (row.commonMistakes || row.writing || row.practice || '') + '</td>' +
        '</tr>';
      });
      html += '</tbody></table></div></div>';
      container.innerHTML = html;
    });
  }

  /**
   * 渲染最容易掉分区 + 补救入口
   */
  function renderGradeMistakes(gradeId, container) {
    if (!container) return;
    loadGrades().then(function(data) {
      if (!data || !data[gradeId]) return;
      var g = data[gradeId];
      var html = '<div class="content-grid">';

      // 掉分区
      html += '<article class="study-block"><h2>本年级最容易掉分的 ' + (g.easyMistakes ? g.easyMistakes.length : '3') + ' 件事</h2><ul class="level-list">';
      (g.easyMistakes || []).forEach(function(item) {
        html += '<li>' + item + '</li>';
      });
      html += '</ul></article>';

      // 补救入口
      html += '<article class="study-block accent"><h2>补救入口</h2><ul class="level-list">';
      (g.remedies || []).forEach(function(item) {
        html += '<li>' + item + '</li>';
      });
      html += '</ul></article>';

      html += '</div>';
      container.innerHTML = html;
    });
  }

  /**
   * 渲染训练闭环卡片（自测 + 训练 + 评价）
   */
  function renderGradeLoop(gradeId, container) {
    if (!container) return;
    loadGrades().then(function(data) {
      if (!data || !data[gradeId]) return;
      var g = data[gradeId];
      var html = '<div class="loop-grid">';

      // 自测
      html += '<article class="loop-card"><h3>5分钟入门自测</h3><ul>';
      (g.selfTest || []).forEach(function(item) {
        html += '<li>' + item + '</li>';
      });
      html += '</ul></article>';

      // 训练
      html += '<article class="loop-card"><h3>三层训练安排</h3><ul>';
      var tiers = g.trainingTiers || {};
      Object.keys(tiers).forEach(function(k) {
        html += '<li><strong>' + k + '：</strong>' + tiers[k] + '</li>';
      });
      html += '</ul></article>';

      // 评价
      html += '<article class="loop-card"><h3>评价复盘量表</h3><div class="score-line">';
      var ev = g.evaluation || {};
      Object.keys(ev).forEach(function(k) {
        html += '<p><strong>' + k + '：</strong>' + ev[k] + '</p>';
      });
      html += '</div></article>';

      html += '</div>';
      container.innerHTML = html;
    });
  }

  /**
   * 批量渲染年级标准模块（hero+curriculum+mistakes+loop）
   * 页面只需提供空的容器 DOM，一次调用完成渲染
   */
  function renderGradePage(gradeId, containers) {
    if (containers.hero)       renderGradeHero(gradeId, containers.hero);
    if (containers.curriculum)  renderGradeCurriculum(gradeId, containers.curriculum);
    if (containers.unitMatrix)  renderGradeUnitMatrix(gradeId, containers.unitMatrix);
    if (containers.mistakes)    renderGradeMistakes(gradeId, containers.mistakes);
    if (containers.loop)        renderGradeLoop(gradeId, containers.loop);
  }

  /**
   * 通用模板渲染器：根据模板 ID + 数据生成 HTML
   * 支持模板: 'curriculum-table', 'mistake-list', 'loop-cards'
   */
  function renderTemplate(templateId, data, container) {
    if (!container) return;
    var html = '';

    switch (templateId) {
      case 'curriculum-table':
        if (!data || !data.rows) break;
        html = '<div class="table-card"><h2>' + (data.title || '课标能力对照表') + '</h2><div class="responsive-table"><table>';
        html += '<thead><tr>';
        (data.headers || []).forEach(function(h) { html += '<th>' + h + '</th>'; });
        html += '</tr></thead><tbody>';
        data.rows.forEach(function(row) {
          html += '<tr><td>' + row.dimension + '</td><td>' + row.content + '</td><td>' + row.standard + '</td><td>' + row.advanced + '</td></tr>';
        });
        html += '</tbody></table></div></div>';
        break;

      case 'mistake-list':
        if (!data) break;
        html = '<div class="content-grid">';
        html += '<article class="study-block"><h2>' + (data.title || '最容易掉分') + '</h2><ul class="level-list">';
        (data.items || []).forEach(function(item) { html += '<li>' + item + '</li>'; });
        html += '</ul></article>';
        if (data.remedies) {
          html += '<article class="study-block accent"><h2>补救入口</h2><ul class="level-list">';
          data.remedies.forEach(function(item) { html += '<li>' + item + '</li>'; });
          html += '</ul></article>';
        }
        html += '</div>';
        break;

      case 'loop-cards':
        if (!data) break;
        html = '<div class="loop-grid">';
        html += '<article class="loop-card"><h3>' + (data.selfTestTitle || '5分钟入门自测') + '</h3><ul>';
        (data.selfTest || []).forEach(function(item) { html += '<li>' + item + '</li>'; });
        html += '</ul></article>';
        html += '<article class="loop-card"><h3>' + (data.trainingTitle || '三层训练安排') + '</h3><ul>';
        var tiers = data.trainingTiers || {};
        Object.keys(tiers).forEach(function(k) { html += '<li><strong>' + k + '：</strong>' + tiers[k] + '</li>'; });
        html += '</ul></article>';
        html += '<article class="loop-card"><h3>' + (data.evalTitle || '评价复盘量表') + '</h3><div class="score-line">';
        var ev = data.evaluation || {};
        Object.keys(ev).forEach(function(k) { html += '<p><strong>' + k + '：</strong>' + ev[k] + '</p>'; });
        html += '</div></article>';
        html += '</div>';
        break;
    }

    container.innerHTML = html;
  }

  // ============ 暴露全局 API ============
  window.DataLib = {
    // 核心加载
    load: loadData,
    preloadAll: preloadAll,
    query: queryData,
    
    // 搜索
    search: search,
    fuzzySearch: fuzzySearch,
    searchIndex: searchIndex,  // 使用预生成索引的快速搜索
    
    // 便捷查询
    getTeachingTip: getTeachingTip,
    getByGrade: getByGrade,
    
    // 经典渲染
    renderGrammarByGrade: renderGrammarByGrade,
    renderVocabularySection: renderVocabularySection,
    renderLiteraryTimeline: renderLiteraryTimeline,
    renderCommonMistakes: renderCommonMistakes,
    renderEssayTypes: renderEssayTypes,
    renderDataOverview: renderDataOverview,
    showDataPreview: showDataPreview,

    // 年级数据驱动渲染（新）
    loadGrades: loadGrades,
    renderGradeHero: renderGradeHero,
    renderGradeCurriculum: renderGradeCurriculum,
    renderGradeUnitMatrix: renderGradeUnitMatrix,
    renderGradeMistakes: renderGradeMistakes,
    renderGradeLoop: renderGradeLoop,
    renderGradePage: renderGradePage,
    renderTemplate: renderTemplate
  };

  console.log('📦 资料库加载器已就绪 (全局模式) - DataLib API 可用');
})();
