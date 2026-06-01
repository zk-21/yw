(function() {
  'use strict';

  var localCache = {};
  var pendingLoads = {};

  function getAssetVersion() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].getAttribute('src') || '';
      if (
        src.indexOf('grade-page-renderer.js') === -1 &&
        src.indexOf('data-loader-core.js') === -1
      ) {
        continue;
      }
      var match = src.match(/[?&]v=([^&]+)/);
      if (match) return match[1];
    }
    return 'dev';
  }

  function loadData(name) {
    if (window.DataLibCore && typeof window.DataLibCore.load === 'function') {
      return window.DataLibCore.load(name);
    }
    if (localCache[name]) return Promise.resolve(localCache[name]);
    if (pendingLoads[name]) return pendingLoads[name];

    pendingLoads[name] = fetch('data/' + name + '.json?v=' + encodeURIComponent(getAssetVersion()))
      .then(function(response) {
        if (!response.ok) throw new Error('Failed to load ' + name);
        return response.json();
      })
      .then(function(data) {
        localCache[name] = data;
        delete pendingLoads[name];
        return data;
      })
      .catch(function(error) {
        delete pendingLoads[name];
        console.warn('Grade page data load failed:', name, error);
        return null;
      });

    return pendingLoads[name];
  }

  function loadGrades() {
    return loadData('grades');
  }

  function loadUnitCoverage() {
    return loadData('unit-coverage');
  }

  function getDataLoadHint() {
    if (window.location && window.location.protocol === 'file:') {
      return '当前页面像是通过 file:// 直接打开的。请改用本地静态服务器访问，例如先运行 npx serve .，再打开 http://127.0.0.1:3000/grade1.html。';
    }
    return '请刷新页面重试；如果仍未显示，请检查浏览器控制台里的 JSON 加载错误。';
  }

  function renderLoadFailure(container, title) {
    if (!container) return;
    container.innerHTML =
      '<div class="table-card">' +
        '<h2>' + title + '</h2>' +
        '<p style="color:#666;margin:0;">' + getDataLoadHint() + '</p>' +
      '</div>';
  }

  function renderGradeHero(gradeId, container, overrides) {
    if (!container) return;
    loadGrades().then(function(data) {
      if (!data || !data[gradeId]) {
        container.className = 'page-head';
        container.innerHTML =
          '<p class="eyebrow">数据未加载</p>' +
          '<h1>年级页数据暂未显示</h1>' +
          '<p>' + getDataLoadHint() + '</p>';
        return;
      }

      var grade = data[gradeId];
      var cls = 'grade-' + (
        gradeId === '1' ? 'one' :
        gradeId === '2' ? 'two' :
        gradeId === '3' ? 'three' :
        gradeId === '4' ? 'four' :
        gradeId === '5' ? 'five' : 'six'
      );
      var eyebrow = (overrides && overrides.eyebrow) || grade.eyebrow || '';
      var title = (overrides && overrides.heroTitle) || grade.heroTitle || '';
      var desc = (overrides && overrides.heroDesc) || grade.heroDesc || '';
      var fallbackTitle = '小学语文' + grade.label + '学习指导';
      var fallbackDesc = '先解决当前年级最关键的能力，再进入专题和练习。';

      container.className = 'page-head ' + cls;
      container.innerHTML =
        '<p class="eyebrow">' + eyebrow + '</p>' +
        '<h1>' + (title || fallbackTitle) + '</h1>' +
        '<p>' + (desc || fallbackDesc) + '</p>';
    });
  }

  function renderGradeCurriculum(gradeId, container) {
    if (!container) return;
    loadGrades().then(function(data) {
      if (!data || !data[gradeId] || !data[gradeId].curriculum) {
        renderLoadFailure(container, '课标能力对照暂未加载');
        return;
      }

      var curriculum = data[gradeId].curriculum;
      var html = '<div class="table-card"><h2>课标能力对照表</h2><div class="responsive-table"><table>';
      html += '<thead><tr>';
      (curriculum.headers || ['课标维度', '本页对应内容', '达标证据', '拔尖表现']).forEach(function(header) {
        html += '<th>' + header + '</th>';
      });
      html += '</tr></thead><tbody>';
      curriculum.rows.forEach(function(row) {
        html += '<tr><td>' + row.dimension + '</td><td>' + row.content + '</td><td>' + row.standard + '</td><td>' + row.advanced + '</td></tr>';
      });
      html += '</tbody></table></div></div>';
      container.innerHTML = html;
    });
  }

  function renderGradeUnitMatrix(gradeId, container) {
    if (!container) return;
    Promise.all([loadGrades(), loadUnitCoverage()]).then(function(results) {
      var gradesData = results[0];
      var coverageData = results[1];
      if (!gradesData || !gradesData[gradeId] || !gradesData[gradeId].unitCoverage) {
        renderLoadFailure(container, '教材单元映射暂未加载');
        return;
      }

      var matrix = gradesData[gradeId].unitCoverage;
      var headers = matrix.headers || ['册次', '单元 / 主题', '课文重点 / 基础积累', '阅读训练', '表达 / 习作'];
      var rows = [];

      function toRow(bookName, unit) {
        var words = Array.isArray(unit['生字词']) && unit['生字词'].length
          ? ' 生字词：' + unit['生字词'].join('、')
          : '';
        return {
          semester: bookName,
          unit: unit['单元'],
          theme: unit['主题'],
          focus: (unit['课文重点'] || '') + words,
          questionTypes: unit['阅读训练'] || '',
          commonMistakes: unit['习作要求'] || ''
        };
      }

      if (coverageData && matrix.books && matrix.books.length) {
        matrix.books.forEach(function(bookName) {
          var units = coverageData[bookName];
          if (Array.isArray(units)) {
            units.forEach(function(unit) {
              rows.push(toRow(bookName, unit));
            });
          }
        });
      }

      if (!rows.length) rows = matrix.rows || [];
      if (!rows.length) {
        renderLoadFailure(container, '教材单元映射暂未加载');
        return;
      }

      function td(label, value) {
        return '<td data-label="' + label + '">' + value + '</td>';
      }

      var html = '<div class="table-card"><h2>' + (matrix.title || '教材单元映射') + '</h2>';
      if (matrix.textbookVersion) {
        html += '<p style="color:#333;font-weight:600;margin-top:-4px;margin-bottom:6px;">教材版本：' + matrix.textbookVersion + '</p>';
      }
      if (matrix.note) {
        html += '<p style="color:#666;margin-top:0;">' + matrix.note + '</p>';
      }
      if (matrix.books && matrix.books.length) {
        html += '<p style="color:#666;margin-top:0;margin-bottom:12px;">已覆盖册次：' + matrix.books.join('、') + '</p>';
      }
      html += '<div class="responsive-table"><table><thead><tr>';
      headers.forEach(function(header) {
        html += '<th>' + header + '</th>';
      });
      html += '</tr></thead><tbody>';
      rows.forEach(function(row) {
        var lessonText = row.lesson ? '<div style="font-size:12px;color:#666;margin-top:4px;">' + row.lesson + '</div>' : '';
        var unitCell = row.unit || row.direction || '';
        if (row.theme) {
          unitCell += '<div style="font-size:12px;color:#666;margin-top:4px;">主题：' + row.theme + '</div>';
        }
        html += '<tr>' +
          td(headers[0], row.semester || row.term || '') +
          td(headers[1], unitCell + lessonText) +
          td(headers[2], row.focus || row.words || '') +
          td(headers[3], row.questionTypes || row.reading || '') +
          td(headers[4], row.commonMistakes || row.writing || row.practice || '') +
        '</tr>';
      });
      html += '</tbody></table></div></div>';
      container.innerHTML = html;
    });
  }

  function renderGradeMistakes(gradeId, container) {
    if (!container) return;
    loadGrades().then(function(data) {
      if (!data || !data[gradeId]) {
        renderLoadFailure(container, '易错点与补救入口暂未加载');
        return;
      }

      var grade = data[gradeId];
      var html = '<div class="content-grid">';
      html += '<article class="study-block"><h2>本年级最容易掉分的 ' + (grade.easyMistakes ? grade.easyMistakes.length : '3') + ' 件事</h2><ul class="level-list">';
      (grade.easyMistakes || []).forEach(function(item) {
        html += '<li>' + item + '</li>';
      });
      html += '</ul></article>';

      html += '<article class="study-block accent"><h2>补救入口</h2><ul class="level-list">';
      (grade.remedies || []).forEach(function(item) {
        html += '<li>' + item + '</li>';
      });
      html += '</ul></article>';

      html += '</div>';
      container.innerHTML = html;
    });
  }

  function renderGradeLoop(gradeId, container) {
    if (!container) return;
    loadGrades().then(function(data) {
      if (!data || !data[gradeId]) {
        renderLoadFailure(container, '训练闭环暂未加载');
        return;
      }

      var grade = data[gradeId];
      var html = '<div class="loop-grid">';
      html += '<article class="loop-card"><h3>5分钟入门自测</h3><ul>';
      (grade.selfTest || []).forEach(function(item) {
        html += '<li>' + item + '</li>';
      });
      html += '</ul></article>';

      html += '<article class="loop-card"><h3>三层训练安排</h3><ul>';
      var tiers = grade.trainingTiers || {};
      Object.keys(tiers).forEach(function(key) {
        html += '<li><strong>' + key + '：</strong>' + tiers[key] + '</li>';
      });
      html += '</ul></article>';

      html += '<article class="loop-card"><h3>评价复盘量表</h3><div class="score-line">';
      var evaluation = grade.evaluation || {};
      Object.keys(evaluation).forEach(function(key) {
        html += '<p><strong>' + key + '：</strong>' + evaluation[key] + '</p>';
      });
      html += '</div></article>';

      html += '</div>';
      container.innerHTML = html;
    });
  }

  function renderGrammarByGrade(grade, container) {
    if (!container) return;
    var gradeNum = parseInt(String(grade || '').replace('grade', ''), 10);
    if (!gradeNum) return;

    loadData('grammar').then(function(data) {
      if (!data) {
        container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">资料加载中...</p>';
        return;
      }

      var html = '';

      var allPunctuation = [];
      if (data['标点符号']) {
        ['基础标点', '进阶标点', '高级标点'].forEach(function(category) {
          if (data['标点符号'][category]) {
            data['标点符号'][category].forEach(function(item) {
              if (item.年级 <= gradeNum) allPunctuation.push(item);
            });
          }
        });
      }
      if (allPunctuation.length > 0) {
        html += '<div class="grammar-card"><h3>📝 标点符号</h3>';
        allPunctuation.forEach(function(item) {
          html += '<p><strong>' + item.符号 + ' ' + item.名称 + '：</strong>' + item.规则 + '</p>';
          if (item.正例) html += '<div class="example-box"><strong>例子：</strong>' + item.正例 + '</div>';
        });
        html += '</div>';
      }

      if (data['词性']) {
        var allCiXing = [];
        ['实词', '虚词'].forEach(function(type) {
          if (data['词性'][type]) {
            data['词性'][type].forEach(function(item) {
              if (item.适用年级 <= gradeNum) allCiXing.push(item);
            });
          }
        });
        if (allCiXing.length > 0) {
          html += '<div class="grammar-card"><h3>📚 词性知识</h3>';
          allCiXing.forEach(function(item) {
            html += '<p><strong>' + item.名称 + '：</strong>' + item.定义 + '</p>';
            html += '<div class="example-box"><strong>例子：</strong>' + (item.例子 ? item.例子.join('、') : '') + '</div>';
          });
          if (data['词性']['教学口诀']) {
            var ciXingTips = Object.values(data['词性']['教学口诀']).filter(Boolean);
            if (ciXingTips.length) {
              html += '<div class="tip">💡 ' + ciXingTips[0] + '</div>';
            }
          }
          html += '</div>';
        }
      }

      if (data['修辞手法'] && data['修辞手法']['基础修辞']) {
        var rhetoricItems = data['修辞手法']['基础修辞'].filter(function(item) {
          return item.年级 <= gradeNum;
        });
        if (rhetoricItems.length > 0) {
          html += '<div class="grammar-card"><h3>🎯 修辞手法</h3>';
          rhetoricItems.forEach(function(item) {
            html += '<p><strong>' + item.名称 + '：</strong>' + item.定义 + '</p>';
            html += '<div class="example-box"><strong>例子：</strong>' + (item.正例 || '') + '</div>';
          });
          if (data['修辞手法']['三层答题法']) {
            html += '<details style="margin-top:10px;"><summary style="cursor:pointer;color:#667eea;font-weight:bold;">📖 修辞三层答题法</summary>';
            Object.entries(data['修辞手法']['三层答题法']).forEach(function(entry) {
              if (entry[0] === '满分示例') {
                html += '<div class="example-box">✅ ' + entry[1] + '</div>';
              } else {
                html += '<p style="font-size:13px;margin:6px 0;">' + entry[0] + '：' + entry[1] + '</p>';
              }
            });
            html += '</details>';
          }
          html += '</div>';
        }
      }

      if (data['关联词'] && data['关联词']['分类']) {
        var connectorItems = data['关联词']['分类'].filter(function(item) {
          return item.年级 <= gradeNum;
        });
        if (connectorItems.length > 0) {
          html += '<div class="grammar-card"><h3>🔗 关联词</h3>';
          connectorItems.forEach(function(item) {
            html += '<p><strong>' + item.关系 + '：</strong>' + item.关联词.join(' / ') + '</p>';
            if (item.例句) html += '<div class="example-box">' + item.例句 + '</div>';
          });
          html += '</div>';
        }
      }

      if (data['病句修改'] && data['病句修改']['常见类型']) {
        var sickSentenceItems = data['病句修改']['常见类型'].filter(function(item) {
          return item.年级 <= gradeNum;
        });
        if (sickSentenceItems.length > 0) {
          html += '<div class="grammar-card"><h3>🧪 病句类型</h3>';
          sickSentenceItems.forEach(function(item) {
            html += '<p><strong>' + item.病因 + '：</strong>' + item.说明 + '</p>';
            html += '<div class="example-box">❌ ' + item.病句 + '<br>✅ ' + item.修改 + '</div>';
          });
          if (data['病句修改']['修改铁律']) {
            html += '<div class="tip">🪄 ' + data['病句修改']['修改铁律'] + '</div>';
          }
          html += '</div>';
        }
      }

      if (data['句型变换']) {
        var allSentencePatterns = [];
        ['基础变换', '进阶变换'].forEach(function(type) {
          if (data['句型变换'][type]) {
            allSentencePatterns = allSentencePatterns.concat(data['句型变换'][type]);
          }
        });
        var sentencePatternItems = allSentencePatterns.filter(function(item) {
          return item.年级 <= gradeNum;
        });
        if (sentencePatternItems.length > 0) {
          html += '<div class="grammar-card"><h3>🔄 句型变换</h3>';
          sentencePatternItems.forEach(function(item) {
            html += '<p><strong>' + item.类型 + '：</strong>' + (item.格式 || item.定义 || item.口诀 || item.方法 || '') + '</p>';
            html += '<div class="example-box"><strong>例子：</strong>' + (item.正例 || '') + '</div>';
          });
          if (data['句型变换']['缩句铁律']) {
            html += '<div class="tip">✂️ ' + data['句型变换']['缩句铁律'] + '</div>';
          }
          if (data['句型变换']['扩句铁律']) {
            html += '<div class="tip">🧩 ' + data['句型变换']['扩句铁律'] + '</div>';
          }
          html += '</div>';
        }
      }

      var allTips = [];
      if (data['词性'] && data['词性']['教学口诀']) {
        Object.entries(data['词性']['教学口诀']).forEach(function(entry) {
          allTips.push(entry[0] + '：' + entry[1]);
        });
      }
      if (data['标点符号'] && data['标点符号']['教学口诀']) {
        Object.entries(data['标点符号']['教学口诀']).forEach(function(entry) {
          allTips.push(entry[0] + '：' + entry[1]);
        });
      }
      if (data['标点符号'] && data['标点符号']['小升初失分点']) {
        data['标点符号']['小升初失分点'].forEach(function(item) {
          allTips.push(item);
        });
      }
      if (allTips.length > 0) {
        html += '<div class="grammar-card"><h3>📘 学习口诀</h3>';
        allTips.forEach(function(item) {
          html += '<div class="tip" style="margin-bottom:8px;">💡 ' + item + '</div>';
        });
        html += '</div>';
      }

      container.innerHTML = html || '<p style="color:#999; text-align:center; padding:20px;">暂无该年级的语法资料</p>';
    });
  }

  function renderCommonMistakes(container, grade) {
    if (!container) return;
    loadData('common-mistakes').then(function(data) {
      if (!data || !data.错误分类) return;

      var html = '';
      data.错误分类.forEach(function(errType) {
        if (grade) {
          var range = errType['年级范围'];
          if (range && range !== '1-6') {
            var parts = range.split('-');
            var gradeNum = parseInt(grade, 10);
            if (gradeNum < parseInt(parts[0], 10) || gradeNum > parseInt(parts[1], 10)) return;
          }
        }

        html += '<div class="grammar-card" style="margin-bottom:12px;">';
        html += '<h4 style="color:#e65100;">⚠️ ' + errType.类别 + ' <small style="color:#888; font-weight:normal;">年级' + errType['年级范围'] + '</small></h4>';
        html += '<p style="font-size:13px; color:#555;">' + errType.说明 + '</p>';
        if (errType.典型错误) {
          html += '<div class="responsive-table" style="margin-top:8px;"><table style="font-size:12px;"><thead><tr><th>错误</th><th>正确/改善</th><th>原因/表现</th></tr></thead><tbody>';
          errType.典型错误.slice(0, 5).forEach(function(item) {
            html += '<tr><td style="color:#e65100;">' + (item.错误 || item.错误示例 || '') + '</td>';
            html += '<td style="color:#2e7d32;">' + (item.正确 || item.正确句式 || item.正确示例 || item.正确规则 || item.改善 || '') + '</td>';
            html += '<td>' + (item.原因 || item.说明 || item.表现 || item.例子 || '') + '</td></tr>';
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

  function renderGradePage(gradeId, containers) {
    if (containers.hero) renderGradeHero(gradeId, containers.hero);
    if (containers.curriculum) renderGradeCurriculum(gradeId, containers.curriculum);
    if (containers.unitMatrix) renderGradeUnitMatrix(gradeId, containers.unitMatrix);
    if (containers.mistakes) renderGradeMistakes(gradeId, containers.mistakes);
    if (containers.loop) renderGradeLoop(gradeId, containers.loop);
  }

  var api = {
    load: loadData,
    loadGrades: loadGrades,
    renderGradeHero: renderGradeHero,
    renderGradeCurriculum: renderGradeCurriculum,
    renderGradeUnitMatrix: renderGradeUnitMatrix,
    renderGradeMistakes: renderGradeMistakes,
    renderGradeLoop: renderGradeLoop,
    renderGradePage: renderGradePage,
    renderGrammarByGrade: renderGrammarByGrade,
    renderCommonMistakes: renderCommonMistakes
  };

  window.GradePageRenderer = api;
  window.DataLib = Object.assign(window.DataLib || {}, api);
})();
