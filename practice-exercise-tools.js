// 渲染题库索引与解析质量分级样例
    
(function(){
      var exerciseAllItems = [];
      var exerciseFilteredItems = [];
      var exerciseRenderLimit = 0;
      var exerciseDetailItemsMap = Object.create(null);
      var exercisesIndexPromise = null;
      var exerciseSearchRenderTimer = null;
      var selectedExerciseIds = new Set();
      var EXERCISE_INITIAL_RENDER_COUNT = 24;
      var EXERCISE_RENDER_STEP = 24;
      var EXERCISE_SEARCH_DEBOUNCE_MS = 160;
      var exerciseFilters = {
        keyword: '',
        grade: 'all',
        type: 'all',
        error: 'all',
        quality: 'all',
        printable: 'all'
      };
      var errorPackMeta = {
        R1: { title: 'R1 概括主干', desc: '概括照抄、漏人物事件结果。重点练“对象 + 事情 + 结果/特点”。' },
        R2: { title: 'R2 原文依据', desc: '人物、原因、情感题缺少材料依据。重点练“结论 + 原文依据 + 分析”。' },
        R3: { title: 'R3 赏析语言', desc: '赏析只背术语，不联系原文。重点练“手法 + 特点 + 效果”。' },
        W1: { title: 'W1 结构松散', desc: '段落或作文组织松散。重点练中心、顺序和详略。' },
        W2: { title: 'W2 细节不足', desc: '重点段太薄。重点练动作、语言、心理和变化。' },
        W3: { title: 'W3 审题扣题', desc: '作文题眼、中心、材料和点题不稳。重点练圈题眼和回扣题目。' }
      };
      function getDataVersion() {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
          var src = scripts[i].getAttribute('src') || '';
          if (
            src.indexOf('practice-exercise-tools.js') === -1 &&
            src.indexOf('practice-exercise-loader.js') === -1 &&
            src.indexOf('practice.js') === -1
          ) {
            continue;
          }
          var match = src.match(/[?&]v=([^&]+)/);
          if (match) return match[1];
        }
        return 'dev';
      }
      function isExerciseRecord(item) {
        return !!item && typeof item === 'object' && !Array.isArray(item) && (
          item.id !== undefined ||
          item.题目 ||
          item.类型 ||
          item.错因码 ||
          item.年级
        );
      }
      function getItemsFromArray(value) {
        if (!Array.isArray(value)) return null;
        return value.every(isExerciseRecord) ? value : null;
      }
      function getItemsFromObjectMap(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
        var items = Object.keys(value).map(function(key) {
          return value[key];
        });
        return items.every(isExerciseRecord) ? items : null;
      }
      function getExerciseItems(data) {
        if (!data || typeof data !== 'object') return null;
        var directItems = getItemsFromArray(data.items);
        if (directItems) return directItems;
        directItems = getItemsFromArray(data.题库);
        if (directItems) return directItems;
        directItems = getItemsFromObjectMap(data.题库);
        if (directItems) return directItems;
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
          var arrayItems = getItemsFromArray(data[keys[i]]);
          if (arrayItems) return arrayItems;
        }
        for (var j = 0; j < keys.length; j++) {
          var mappedItems = getItemsFromObjectMap(data[keys[j]]);
          if (mappedItems) return mappedItems;
        }
        return null;
      }
      function loadExercisesIndexData() {
        if (window.exercisesDataItems && Array.isArray(window.exercisesDataItems)) {
          return Promise.resolve({
            data: window.exercisesData,
            items: window.exercisesDataItems
          });
        }
        if (typeof window.loadExercisesDataset === 'function') {
          return window.loadExercisesDataset().then(function(data) {
            var items = window.exercisesDataItems || getExerciseItems(data);
            if (items) {
              window.exercisesData = data;
              window.exercisesDataItems = items;
            }
            return {
              data: data,
              items: items
            };
          });
        }
        if (exercisesIndexPromise) return exercisesIndexPromise;

        exercisesIndexPromise = fetch('data/exercises.json?v=' + encodeURIComponent(getDataVersion()))
          .then(function(response) {
            if (!response.ok) {
              throw new Error('Failed to load exercises.json (' + response.status + ')');
            }
            return response.json();
          })
          .then(function(data) {
            var items = getExerciseItems(data);
            if (items) {
              window.exercisesData = data;
              window.exercisesDataItems = items;
            }
            return { data: data, items: items };
          })
          .finally(function() {
            exercisesIndexPromise = null;
          });

        return exercisesIndexPromise;
      }
      function escapeHTML(value) {
        return String(value == null ? '' : value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/\n/g, '<br>');
      }
      function renderList(items) {
        if (!items || !items.length) return '';
        return '<ul>' + items.map(function(item) {
          return '<li>' + escapeHTML(item) + '</li>';
        }).join('') + '</ul>';
      }
      function getGapTags(item, analysis) {
        var text = [
          analysis && analysis.解题思路,
          analysis && analysis.低分示例,
          analysis && analysis.满分表达,
          item.类型,
          item.错因码
        ].concat(item.能力点 || []).join(' ');
        var tags = [];
        function add(label, desc) {
          if (!tags.some(function(tag) { return tag.label === label; })) tags.push({ label: label, desc: desc });
        }
        if (/依据|原文|证据|find_evidence|R2/.test(text)) add('缺了依据', '需要回到原文或材料，写出能证明结论的关键词句。');
        if (/分析|说明|表现|体现|作用|赏析|appreciate|R3|C1/.test(text)) add('缺了分析', '不能只给结论，要说明依据为什么能推出这个答案。');
        if (/空泛|具体|生动|细节|太短|W1|W2|表达/.test(text)) add('语言太空', '要补动作、特点、效果或具体场景，少用空话。');
        if (/题眼|中心|点题|回扣|审题|W3|organize|idea/.test(text)) add('没有回扣题目', '答案或作文要回到题眼、中心和题目要求。');
        if (/概括|主干|summarize|R1/.test(text)) add('概括不完整', '概括要保留对象、事情、结果或特点。');
        if (/数据|图表|材料|非连续|R4/.test(text)) add('缺少材料数据', '非连续文本要引用数字、比例或材料关键词。');
        if (!tags.length) add('少了得分层', '对照满分表达，找出结论、依据、分析、回扣中缺了哪一层。');
        return tags.slice(0, 4);
      }
      function renderCompare(item, analysis) {
        if (!analysis || !analysis.低分示例 || !analysis.满分表达) return '';
        var tags = getGapTags(item, analysis);
        return [
          '<div class="answer-compare">',
            '<div class="answer-compare-title">低分答案 + 错因点评 + 满分答案</div>',
            '<div class="answer-compare-grid">',
              '<div class="answer-compare-panel low"><strong>低分答案</strong><p>' + escapeHTML(analysis.低分示例) + '</p></div>',
              '<div class="answer-compare-panel critique"><strong>错因点评</strong><p>' + escapeHTML(analysis.错因点评 || '这份答案方向碰到了边，但关键依据或完整表达没有写出来。') + '</p></div>',
              '<div class="answer-compare-panel high"><strong>满分答案</strong><p>' + escapeHTML(analysis.满分表达) + '</p></div>',
            '</div>',
            '<div class="answer-gap-tags">',
              tags.map(function(tag) {
                return '<span title="' + escapeHTML(tag.desc) + '"><b>' + escapeHTML(tag.label) + '</b><em>' + escapeHTML(tag.desc) + '</em></span>';
              }).join(''),
            '</div>',
          '</div>'
        ].join('');
      }
      function getQualityLevel(item) {
        if (item && item.__exerciseQualityLevel) return item.__exerciseQualityLevel;
        var analysis = item.解析分级;
        var level;
        if (!analysis) level = { label: '基础解析', className: 'basic', desc: '只有基础答案或简要解析' };
        var fields = ['标准答案', '解题思路', '低分示例', '满分表达', '家长讲解话术', '复练任务'];
        if (!level) {
          var complete = fields.every(function(field) {
            return String(analysis[field] || '').trim().length > 0;
          }) && Array.isArray(analysis.易错点) && analysis.易错点.length > 0;
          if (!complete) level = { label: '完整解析', className: 'complete', desc: '核心解析字段已覆盖' };
          else if (item.可打印 && analysis.家长讲解话术 && analysis.复练任务) {
            level = { label: '可打印解析', className: 'printable', desc: '可直接生成线下训练单' };
          } else {
            level = { label: '可教学解析', className: 'teachable', desc: '包含低分对比、满分表达和家长话术' };
          }
        }
        if (item && typeof item === 'object') {
          item.__exerciseQualityLevel = level;
          item.__exerciseQualityKey = level.className;
        }
        return level;
      }
      function renderQualityBadge(item) {
        var level = getQualityLevel(item);
        return '<span class="analysis-quality-badge ' + level.className + '" title="' + escapeHTML(level.desc) + '">' + escapeHTML(level.label) + '</span>';
      }
      function getQualityKey(item) {
        if (item && item.__exerciseQualityKey) return item.__exerciseQualityKey;
        return getQualityLevel(item).className;
      }
      function buildExerciseSearchText(item) {
        var analysis = item.解析分级 || {};
        return [
          item.id,
          item.题目,
          item.答案,
          item.解析,
          item.类型,
          item.错因码,
          item.难度,
          item.年级,
          item.学期,
          item.来源,
          item.预计时间,
          (item.能力点 || []).join(' '),
          analysis.标准答案,
          analysis.解题思路,
          analysis.低分示例,
          analysis.错因点评,
          analysis.满分表达,
          analysis.家长讲解话术,
          analysis.复练任务
        ].join(' ').toLowerCase();
      }
      function getExerciseSearchText(item) {
        if (item && item.__exerciseSearchText) return item.__exerciseSearchText;
        var text = buildExerciseSearchText(item);
        if (item && typeof item === 'object') item.__exerciseSearchText = text;
        return text;
      }
      function getExerciseGapTags(item) {
        if (item && item.__exerciseGapTags) return item.__exerciseGapTags;
        var tags = getGapTags(item, item.解析分级 || {});
        if (item && typeof item === 'object') item.__exerciseGapTags = tags;
        return tags;
      }
      function prepareExerciseItem(item) {
        if (!item || typeof item !== 'object') return item;
        if (item.__exercisePrepared) return item;
        item.__exercisePrepared = true;
        item.__exerciseSearchText = buildExerciseSearchText(item);
        item.__exerciseNormalizedQuestion = normalizeExerciseQuestion(item.题目);
        item.__exerciseGapTags = getGapTags(item, item.解析分级 || {});
        item.__exerciseQualityLevel = getQualityLevel(item);
        item.__exerciseQualityKey = item.__exerciseQualityLevel.className;
        return item;
      }
      function prepareExerciseItems(items) {
        return items.map(function(item) {
          return prepareExerciseItem(item);
        });
      }
      function buildExerciseDetailMap(items) {
        return items.reduce(function(acc, item) {
          if (item && item.id !== undefined && item.id !== null) {
            acc[item.id] = item;
          }
          return acc;
        }, Object.create(null));
      }
      function cancelScheduledExerciseRender() {
        if (!exerciseSearchRenderTimer) return;
        clearTimeout(exerciseSearchRenderTimer);
        exerciseSearchRenderTimer = null;
      }
      function scheduleExerciseCardsRender() {
        cancelScheduledExerciseRender();
        exerciseSearchRenderTimer = setTimeout(function() {
          exerciseSearchRenderTimer = null;
          renderExerciseCards();
        }, EXERCISE_SEARCH_DEBOUNCE_MS);
      }
      function uniqueSorted(items, mapper) {
        return Array.from(new Set(items.map(mapper).filter(function(value) {
          return value !== undefined && value !== null && String(value).trim() !== '';
        }))).sort(function(a, b) {
          return String(a).localeCompare(String(b), 'zh-CN', { numeric: true });
        });
      }
      function setSelectOptions(selectId, values, labeler) {
        var select = document.getElementById(selectId);
        if (!select) return;
        var first = select.options[0] ? select.options[0].outerHTML : '<option value="all">全部</option>';
        select.innerHTML = first + values.map(function(value) {
          return '<option value="' + escapeHTML(value) + '">' + escapeHTML(labeler ? labeler(value) : value) + '</option>';
        }).join('');
      }
      function setupFilterOptions(items) {
        setSelectOptions('exerciseGradeFilter', uniqueSorted(items, function(item) { return item.年级; }), function(value) { return value + '年级'; });
        setSelectOptions('exerciseTypeFilter', uniqueSorted(items, function(item) { return item.类型; }));
        setSelectOptions('exerciseErrorFilter', uniqueSorted(items, function(item) { return item.错因码; }));
        setSelectOptions('exerciseQualityFilter', ['basic', 'complete', 'teachable', 'printable'], function(value) {
          return { basic: '基础解析', complete: '完整解析', teachable: '可教学解析', printable: '可打印解析' }[value] || value;
        });
      }
      function matchesFilters(item) {
        var keyword = exerciseFilters.keyword.trim().toLowerCase();
        if (keyword && getExerciseSearchText(item).indexOf(keyword) === -1) return false;
        if (exerciseFilters.grade !== 'all' && String(item.年级) !== exerciseFilters.grade) return false;
        if (exerciseFilters.type !== 'all' && item.类型 !== exerciseFilters.type) return false;
        if (exerciseFilters.error !== 'all' && item.错因码 !== exerciseFilters.error) return false;
        if (exerciseFilters.quality !== 'all' && getQualityKey(item) !== exerciseFilters.quality) return false;
        if (exerciseFilters.printable === 'yes' && !item.可打印) return false;
        if (exerciseFilters.printable === 'no' && item.可打印) return false;
        return true;
      }
      function updateSelectedCount() {
        var el = document.getElementById('exerciseSelectedCount');
        if (el) el.textContent = '已选 ' + selectedExerciseIds.size + ' 题';
        ['exercisePrintSelected', 'exercisePrintStudent'].forEach(function(id) {
          var printBtn = document.getElementById(id);
          if (printBtn) printBtn.disabled = selectedExerciseIds.size === 0;
        });
      }
      function syncFilterControls() {
        var map = {
          exerciseSearchInput: exerciseFilters.keyword,
          exerciseGradeFilter: exerciseFilters.grade,
          exerciseTypeFilter: exerciseFilters.type,
          exerciseErrorFilter: exerciseFilters.error,
          exerciseQualityFilter: exerciseFilters.quality,
          exercisePrintableFilter: exerciseFilters.printable
        };
        Object.keys(map).forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.value = map[id];
        });
      }
      function getSelectedExerciseItems() {
        return Array.from(selectedExerciseIds).map(function(id) {
          return exerciseDetailItemsMap[id];
        }).filter(Boolean);
      }
      function setAutoPlanHint(message) {
        var el = document.getElementById('exerciseAutoPlanHint');
        if (el) el.textContent = message || '';
      }
      function normalizeErrorCode(value) {
        var alias = {
          b1: 'B1',
          r1: 'R1',
          r2: 'R2',
          r3: 'R3',
          r4: 'R4',
          w1: 'W1',
          w2: 'W2',
          w3: 'W3',
          c1: 'C1',
          shenti: 'W3',
          xinxi: 'R2',
          gaikuo: 'R1',
          biaoda: 'C1',
          moban: 'R3'
        };
        var raw = String(value || '').trim();
        var upper = raw.toUpperCase();
        return errorPackMeta[upper] || /^B\d|R\d|W\d|C\d/.test(upper) ? upper : (alias[raw.toLowerCase()] || '');
      }
      function normalizeExerciseQuestion(value) {
        return String(value || '')
          .replace(/<[^>]*>/g, '')
          .replace(/第\d+题[:：]?/g, '')
          .replace(/[“”"‘’'《》（）()，,。.!！?？、:：;；\s]/g, '')
          .toLowerCase();
      }
      function findExerciseForWrongAnswer(item) {
        if (!item) return null;
        if (item.questionId) {
          var byId = exerciseDetailItemsMap[item.questionId];
          if (byId) return byId;
        }
        var normalized = normalizeExerciseQuestion(item.question);
        if (!normalized) return null;
        return exerciseAllItems.filter(function(exercise) {
          var target = exercise.__exerciseNormalizedQuestion || normalizeExerciseQuestion(exercise.题目);
          if (!target) return false;
          var shorter = target.length <= normalized.length ? target : normalized;
          var longer = target.length > normalized.length ? target : normalized;
          return shorter.length >= 12 ? longer.indexOf(shorter) !== -1 : target === normalized;
        })[0] || null;
      }
      function getWrongErrorStats() {
        var wrongList = [];
        try {
          wrongList = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
        } catch (error) {
          wrongList = [];
        }
        if (!Array.isArray(wrongList)) wrongList = [];
        return wrongList.reduce(function(stats, item) {
          var source = findExerciseForWrongAnswer(item);
          var code = normalizeErrorCode(source && source.错因码) || normalizeErrorCode(item.errorCode) || normalizeErrorCode(item.errorCategory);
          if (code) stats[code] = (stats[code] || 0) + 1;
          return stats;
        }, {});
      }
      function getDominantWrongCode() {
        var stats = getWrongErrorStats();
        return Object.keys(stats).sort(function(a, b) {
          return stats[b] - stats[a] || a.localeCompare(b);
        })[0] || '';
      }
      function sortAutoCandidates(items, code, picked, role) {
        var pickedIds = new Set(picked.map(function(item) { return item.id; }));
        var pickedTypes = new Set(picked.map(function(item) { return item.类型; }));
        var codeFamily = code.charAt(0);
        return items.filter(function(item) {
          return item && !pickedIds.has(item.id);
        }).map(function(item) {
          var score = 0;
          if (item.错因码 === code) score += 20;
          if (item.错因码 && item.错因码.charAt(0) === codeFamily) score += 6;
          if (role === 'variant' && !pickedTypes.has(item.类型)) score += 6;
          if (role === 'migration' && item.错因码 !== code) score += 8;
          if (role === 'migration' && (item.难度 === 'advanced' || item.难度 === 'exam')) score += 4;
          if (item.可打印) score += 2;
          if (getQualityKey(item) === 'printable') score += 1;
          return { item: item, score: score };
        }).sort(function(a, b) {
          return b.score - a.score || String(a.item.id).localeCompare(String(b.item.id));
        });
      }
      function pickAutoCandidate(candidates, picked) {
        var candidate = candidates.filter(function(entry) {
          return !picked.some(function(item) { return item.id === entry.item.id; });
        })[0];
        if (candidate) picked.push(candidate.item);
      }
      function buildAutoTrainingPlan() {
        var code = getDominantWrongCode();
        if (!code) {
          setAutoPlanHint('暂无错因记录，先完成诊断或手动勾选题目。');
          alert('暂无错因记录，先完成诊断或手动勾选题目。');
          return;
        }
        var picked = [];
        var sameCode = exerciseAllItems.filter(function(item) { return item.错因码 === code; });
        pickAutoCandidate(sortAutoCandidates(sameCode, code, picked, 'same'), picked);
        pickAutoCandidate(sortAutoCandidates(sameCode, code, picked, 'same'), picked);
        pickAutoCandidate(sortAutoCandidates(sameCode, code, picked, 'variant'), picked);
        var migrationPool = exerciseAllItems.filter(function(item) {
          return item.错因码 !== code;
        });
        pickAutoCandidate(sortAutoCandidates(migrationPool, code, picked, 'migration'), picked);
        while (picked.length < 4) {
          var fallback = sortAutoCandidates(exerciseAllItems, code, picked, 'fill')[0];
          if (!fallback) break;
          picked.push(fallback.item);
        }
        selectedExerciseIds = new Set(picked.map(function(item) { return item.id; }));
        exerciseFilters = { keyword: '', grade: 'all', type: 'all', error: 'all', quality: 'all', printable: 'all' };
        syncFilterControls();
        setAutoPlanHint('已按最高频错因 ' + code + ' 自动组卷：2道同错因题 + 1道变式题 + 1道迁移题。');
        renderExerciseCards();
      }
      function renderAnalysis(item) {
        var analysis = item.解析分级;
        if (!analysis) {
          return '<div class="quality-analysis compact"><strong>基础解析</strong><p>' + escapeHTML(item.解析 || '') + '</p></div>';
        }
        return [
          '<div class="quality-analysis">',
            renderCompare(item, analysis),
            '<div><strong>标准答案</strong><p>' + escapeHTML(analysis.标准答案 || item.答案 || '') + '</p></div>',
            '<div><strong>怎么想</strong><p>' + escapeHTML(analysis.解题思路 || item.解析 || '') + '</p></div>',
            '<div><strong>易错点</strong>' + renderList(analysis.易错点 || []) + '</div>',
            '<div><strong>错因点评</strong><p>' + escapeHTML(analysis.错因点评 || '') + '</p></div>',
            '<div><strong>家长讲解话术</strong><p>' + escapeHTML(analysis.家长讲解话术 || '') + '</p></div>',
            '<div><strong>复练任务</strong><p>' + escapeHTML(analysis.复练任务 || '') + '</p></div>',
          '</div>'
        ].join('');
      }
      function renderDetail(item) {
        var analysis = item.解析分级 || {};
        return [
          '<div class="exercise-detail-head">',
            '<div>',
              '<p class="exercise-detail-meta">' + escapeHTML(item.年级) + '年级 · ' + escapeHTML(item.类型) + ' · ' + escapeHTML(item.错因码 || '') + '</p>',
              '<h2 id="exerciseDetailTitle">' + escapeHTML(item.题目) + '</h2>',
            '</div>',
            renderQualityBadge(item),
          '</div>',
          '<div class="exercise-detail-tags">',
            (item.能力点 || []).map(function(tag) { return '<span>' + escapeHTML(tag) + '</span>'; }).join(''),
            '<span>' + escapeHTML(item.难度 || '') + '</span>',
            '<span>' + (item.可打印 ? '可打印' : '不建议打印') + '</span>',
          '</div>',
          '<section class="exercise-detail-section"><h3>题目区</h3><p>' + escapeHTML(item.题目) + '</p><div class="student-answer-lines"><span></span><span></span><span></span></div></section>',
          renderCompare(item, analysis),
          '<section class="exercise-detail-section"><h3>标准答案</h3><p>' + escapeHTML(analysis.标准答案 || item.答案 || '') + '</p></section>',
          '<section class="exercise-detail-section"><h3>解题思路</h3><p>' + escapeHTML(analysis.解题思路 || item.解析 || '') + '</p></section>',
          '<section class="exercise-detail-section"><h3>易错点</h3>' + renderList(analysis.易错点 || []) + '</section>',
          '<section class="exercise-detail-section"><h3>错因点评</h3><p>' + escapeHTML(analysis.错因点评 || '') + '</p></section>',
          '<section class="exercise-detail-section"><h3>家长讲解话术</h3><p>' + escapeHTML(analysis.家长讲解话术 || '') + '</p></section>',
          '<section class="exercise-detail-section"><h3>复练任务</h3><p>' + escapeHTML(analysis.复练任务 || '') + '</p></section>',
          '<div class="exercise-detail-actions">',
            '<button type="button" class="exercise-detail-btn primary" data-print-exercise="' + escapeHTML(item.id) + '">打印训练单</button>',
            '<button type="button" class="exercise-detail-btn" data-close-detail>关闭</button>',
          '</div>'
        ].join('');
      }
      function openExerciseDetail(item) {
        var modal = document.getElementById('exerciseDetailModal');
        var body = document.getElementById('exerciseDetailBody');
        if (!modal || !body) return;
        body.innerHTML = renderDetail(item);
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        var closeBtn = document.getElementById('exerciseDetailClose');
        if (closeBtn) closeBtn.focus();
      }
      function closeExerciseDetail() {
        var modal = document.getElementById('exerciseDetailModal');
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
      function printExerciseSheet(item) {
        var analysis = item.解析分级 || {};
        var html = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>训练单 - ' + escapeHTML(item.id || '') + '</title>';
        html += '<style>body{font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei",sans-serif;color:#111827;max-width:780px;margin:0 auto;padding:24px;line-height:1.7;}h1{font-size:22px;margin:0 0 6px;}h2{font-size:16px;margin:22px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:6px;}p{margin:0 0 8px}.meta{color:#64748b;font-size:13px;margin-bottom:18px}.box{border:1px solid #d1d5db;border-radius:8px;padding:14px;margin-bottom:14px}.lines span{display:block;height:34px;border-bottom:1px solid #cbd5e1}.answer{background:#f0fdf4}.parent{background:#fffbeb}.task{background:#eff6ff}@media print{body{padding:0}.box{break-inside:avoid}}</style></head><body>';
        html += '<h1>语文训练单</h1><p class="meta">' + escapeHTML(item.年级) + '年级 · ' + escapeHTML(item.类型) + ' · ' + escapeHTML(item.错因码 || '') + '</p>';
        html += '<div class="box"><h2>题目区</h2><p>' + escapeHTML(item.题目) + '</p></div>';
        html += '<div class="box"><h2>学生作答区</h2><div class="lines"><span></span><span></span><span></span><span></span></div></div>';
        html += '<div class="box answer"><h2>标准答案</h2><p>' + escapeHTML(analysis.标准答案 || item.答案 || '') + '</p><h2>低分答案</h2><p>' + escapeHTML(analysis.低分示例 || '') + '</p><h2>错因点评</h2><p>' + escapeHTML(analysis.错因点评 || '') + '</p><h2>满分表达</h2><p>' + escapeHTML(analysis.满分表达 || '') + '</p></div>';
        html += '<div class="box parent"><h2>家长讲解话术</h2><p>' + escapeHTML(analysis.家长讲解话术 || '') + '</p></div>';
        html += '<div class="box task"><h2>复练任务</h2><p>' + escapeHTML(analysis.复练任务 || '') + '</p></div>';
        html += '</body></html>';
        var w = window.open('', '_blank', 'width=900,height=700');
        if (!w) return;
        w.document.write(html);
        w.document.close();
        setTimeout(function() { w.print(); }, 300);
      }
      function renderPrintableExercise(item, index, version) {
        var analysis = item.解析分级 || {};
        if (version === 'student') {
          return [
            '<section class="sheet-item student-sheet-item">',
              '<h2>' + (index + 1) + '. ' + escapeHTML(item.题目) + '</h2>',
              '<div class="box"><h3>学生作答区</h3><div class="lines student-lines"><span></span><span></span><span></span><span></span><span></span></div></div>',
            '</section>'
          ].join('');
        }
        var compare = '';
        if (analysis.低分示例 || analysis.满分表达) {
          compare = '<div class="box compare"><h3>低分答案 + 错因点评 + 满分答案</h3><p><strong>低分：</strong>' + escapeHTML(analysis.低分示例 || '') + '</p><p><strong>点评：</strong>' + escapeHTML(analysis.错因点评 || '') + '</p><p><strong>满分：</strong>' + escapeHTML(analysis.满分表达 || item.答案 || '') + '</p></div>';
        }
        return [
          '<section class="sheet-item">',
            '<h2>' + (index + 1) + '. ' + escapeHTML(item.题目) + '</h2>',
            '<p class="sheet-meta">' + escapeHTML(item.年级) + '年级 · ' + escapeHTML(item.类型) + ' · ' + escapeHTML(item.错因码 || '') + '</p>',
            '<div class="box"><h3>学生作答区</h3><div class="lines"><span></span><span></span><span></span><span></span></div></div>',
            compare,
            '<div class="box answer"><h3>标准答案</h3><p>' + escapeHTML(analysis.标准答案 || item.答案 || '') + '</p><h3>错因点评</h3><p>' + escapeHTML(analysis.错因点评 || '') + '</p><h3>满分表达</h3><p>' + escapeHTML(analysis.满分表达 || '') + '</p></div>',
            '<div class="box parent"><h3>家长讲解话术</h3><p>' + escapeHTML(analysis.家长讲解话术 || '') + '</p></div>',
            '<div class="box task"><h3>复练任务</h3><p>' + escapeHTML(analysis.复练任务 || '') + '</p></div>',
          '</section>'
        ].join('');
      }
      function printExerciseBatch(items, title, version) {
        if (!items || !items.length) {
          alert('请先选择要打印的题目');
          return;
        }
        var mode = version === 'student' ? 'student' : 'parent';
        var versionLabel = mode === 'student' ? '学生版' : '家长版';
        var sheetTitle = title || '今日训练单';
        var html = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>' + escapeHTML(sheetTitle + ' - ' + versionLabel) + '</title>';
        html += '<style>body{font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei",sans-serif;color:#111827;max-width:820px;margin:0 auto;padding:24px;line-height:1.7;}h1{font-size:24px;margin:0 0 8px;}h2{font-size:17px;margin:0 0 4px;}h3{font-size:14px;margin:0 0 8px;color:#334155}.meta,.sheet-meta{color:#64748b;font-size:13px;margin:0 0 14px}.sheet-item{border-top:2px solid #4f46e5;padding-top:18px;margin-top:22px;break-inside:avoid}.student-sheet-item{min-height:210px}.box{border:1px solid #d1d5db;border-radius:8px;padding:12px;margin:10px 0}.lines span{display:block;height:32px;border-bottom:1px solid #cbd5e1}.student-lines span{height:42px}.compare{background:#fff7ed}.answer{background:#f0fdf4}.parent{background:#fffbeb}.task{background:#eff6ff}@media print{body{padding:0}.sheet-item{page-break-inside:avoid}}</style></head><body>';
        html += '<h1>' + escapeHTML(sheetTitle) + '</h1><p class="meta">' + escapeHTML(versionLabel) + ' ｜ 生成时间：' + new Date().toLocaleDateString('zh-CN') + ' ｜ 共 ' + items.length + ' 题</p>';
        html += items.map(function(item, index) {
          return renderPrintableExercise(item, index, mode);
        }).join('');
        html += '</body></html>';
        var w = window.open('', '_blank', 'width=900,height=700');
        if (!w) return;
        w.document.write(html);
        w.document.close();
        setTimeout(function() { w.print(); }, 300);
      }
      function renderErrorPacks(items) {
        var container = document.getElementById('error-pack-container');
        if (!container) return;
        var summary = '<div class="error-pack-summary"><strong>错因专题训练包</strong><span>按 R1/R2/R3/W1/W2/W3 聚合代表题、低分卡点、复练任务和打印包</span></div>';
        var html = Object.keys(errorPackMeta).map(function(code) {
          var packItems = items.filter(function(item) { return item.错因码 === code; });
          var meta = errorPackMeta[code];
          var representativeItems = packItems.slice(0, 2);
          var compareItem = representativeItems.filter(function(item) {
            return item.解析分级 && (item.解析分级.低分示例 || item.解析分级.满分表达);
          })[0];
          var gapLabels = [];
          representativeItems.forEach(function(item) {
            getExerciseGapTags(item).forEach(function(tag) {
              if (gapLabels.indexOf(tag.label) === -1) gapLabels.push(tag.label);
            });
          });
          var firstPractice = representativeItems.map(function(item) {
            return item.解析分级 && item.解析分级.复练任务;
          }).filter(Boolean)[0] || '先完成代表题，再打印专题包做同类复练。';
          var disabled = packItems.length ? '' : ' disabled';
          return [
            '<article class="error-pack-card">',
              '<div class="error-pack-head"><strong>' + escapeHTML(meta.title) + '</strong><span>' + packItems.length + '题</span></div>',
              '<p>' + escapeHTML(meta.desc) + '</p>',
              '<div class="error-pack-section"><b>代表题</b>',
                representativeItems.length ? representativeItems.map(function(item) {
                  return '<button type="button" data-open-exercise="' + escapeHTML(item.id) + '">' + escapeHTML(item.题目) + '</button>';
                }).join('') : '<span>暂无代表题</span>',
              '</div>',
              '<div class="error-pack-section"><b>低分卡点</b><div class="error-pack-examples">',
                gapLabels.slice(0, 4).map(function(label) { return '<span>' + escapeHTML(label) + '</span>'; }).join('') || '<span>待补充</span>',
              '</div></div>',
              compareItem ? '<div class="error-pack-section"><b>低分对比</b><div class="error-pack-compare"><p><strong>低分：</strong>' + escapeHTML(compareItem.解析分级.低分示例 || '') + '</p><p><strong>点评：</strong>' + escapeHTML(compareItem.解析分级.错因点评 || '') + '</p><p><strong>满分：</strong>' + escapeHTML(compareItem.解析分级.满分表达 || compareItem.答案 || '') + '</p></div></div>' : '',
              '<div class="error-pack-section"><b>复练任务</b><p>' + escapeHTML(firstPractice) + '</p>',
              '</div>',
              '<div class="quality-card-actions">',
                '<button type="button" class="exercise-detail-btn primary" data-pack-filter="' + code + '"' + disabled + '>查看专题</button>',
                '<button type="button" class="exercise-detail-btn" data-print-pack="' + code + '"' + disabled + '>打印训练包</button>',
              '</div>',
            '</article>'
          ].join('');
        }).join('');
        container.innerHTML = summary + html;
      }

      function renderExerciseQualityIndex() {
        var container = document.getElementById('exercises-index-container');
        if (!container) return;
        loadExercisesIndexData().then(function(result) {
          var items = result && result.items;
          if (!items || !Array.isArray(items)) {
            container.innerHTML = '<p style="color:#c62828;text-align:center;padding:20px;grid-column:1/-1;">题库加载失败，请刷新重试。</p>';
            return;
          }
          exerciseAllItems = prepareExerciseItems(items);
          exerciseDetailItemsMap = buildExerciseDetailMap(exerciseAllItems);
          window.exerciseDetailItems = exerciseDetailItemsMap;
          exerciseFilteredItems = [];
          exerciseRenderLimit = 0;
          setupFilterOptions(exerciseAllItems);
          renderErrorPacks(exerciseAllItems);
          renderExerciseCards();
        }).catch(function() {
          container.innerHTML = '<p style="color:#c62828;text-align:center;padding:20px;grid-column:1/-1;">题库加载失败，请刷新重试。</p>';
        });
      }
      function buildExerciseCardsSummary(totalCount, matchedCount, visibleCount) {
        var summary = '<div class="quality-summary exercise-results-summary">'
          + '<strong>训练包题库</strong>'
          + '<span>当前渲染 ' + visibleCount + ' / ' + matchedCount + ' 题</span>';
        if (matchedCount !== totalCount) {
          summary += '<span>筛选命中 ' + matchedCount + ' / ' + totalCount + ' 题</span>';
        } else {
          summary += '<span>题库共 ' + totalCount + ' 题</span>';
        }
        summary += '<span>勾选后可加入训练包，并批量打印训练单</span></div>';
        return summary;
      }
      function renderExerciseCard(item) {
        var gapTags = getExerciseGapTags(item);
        var checked = selectedExerciseIds.has(item.id) ? ' checked' : '';
        return [
          '<article class="quality-exercise-card">',
            '<label class="exercise-select-line"><input type="checkbox" data-select-exercise="' + escapeHTML(item.id) + '"' + checked + '> 加入训练包</label>',
            '<div class="quality-card-head">',
              '<span>' + escapeHTML(item.年级) + '年级 · ' + escapeHTML(item.类型) + '</span>',
              '<span>' + escapeHTML(item.错因码) + ' · ' + escapeHTML(item.难度) + '</span>',
            '</div>',
            '<h3>' + escapeHTML(item.题目) + '</h3>',
            '<div class="analysis-quality-row">' + renderQualityBadge(item) + '</div>',
            '<div class="quality-tags">',
              (item.能力点 || []).map(function(tag) { return '<span>' + escapeHTML(tag) + '</span>'; }).join(''),
            '</div>',
            '<div class="quality-gap-preview">' + gapTags.map(function(tag) { return '<span>' + escapeHTML(tag.label) + '</span>'; }).join('') + '</div>',
            '<div class="quality-card-actions">',
              '<button type="button" class="exercise-detail-btn primary" data-open-exercise="' + escapeHTML(item.id) + '">查看详情</button>',
              '<button type="button" class="exercise-detail-btn" data-print-exercise="' + escapeHTML(item.id) + '">打印训练单</button>',
            '</div>',
          '</article>'
        ].join('');
      }
      function renderExerciseCards(options) {
        options = options || {};
        var container = document.getElementById('exercises-index-container');
        if (!container) return;
        if (options.preserveFiltered) {
          if (typeof options.incrementCount === 'number') {
            exerciseRenderLimit += options.incrementCount;
          }
        } else {
          exerciseFilteredItems = exerciseAllItems.filter(matchesFilters);
          exerciseRenderLimit = EXERCISE_INITIAL_RENDER_COUNT;
        }
        var filteredItems = exerciseFilteredItems;
        var visibleCount = Math.min(filteredItems.length, exerciseRenderLimit);
        var remainingCount = Math.max(filteredItems.length - visibleCount, 0);
        var html = buildExerciseCardsSummary(exerciseAllItems.length, filteredItems.length, visibleCount);
        if (!filteredItems.length) {
          html += '<p class="exercise-results-empty">没有匹配的题目</p>';
        } else {
          html += filteredItems.slice(0, visibleCount).map(renderExerciseCard).join('');
          if (remainingCount > 0) {
            html += '<div class="exercise-results-footer"><button type="button" class="exercise-detail-btn primary exercise-load-more-btn" data-load-more-exercises>加载更多（剩余 ' + remainingCount + ' 题）</button></div>';
          }
        }
        container.innerHTML = html;
        updateSelectedCount();
      }

      document.addEventListener('click', function(event) {
        var openBtn = event.target.closest('[data-open-exercise]');
        var printBtn = event.target.closest('[data-print-exercise]');
        var printSelectedBtn = event.target.closest('#exercisePrintSelected');
        var printStudentBtn = event.target.closest('#exercisePrintStudent');
        var autoPlanBtn = event.target.closest('#exerciseBuildAutoPlan');
        var resetBtn = event.target.closest('#exerciseResetFilters');
        var packFilterBtn = event.target.closest('[data-pack-filter]');
        var printPackBtn = event.target.closest('[data-print-pack]');
        var loadMoreBtn = event.target.closest('[data-load-more-exercises]');
        var closeBtn = event.target.closest('[data-close-detail], #exerciseDetailClose');
        var modal = document.getElementById('exerciseDetailModal');
        if (openBtn && window.exerciseDetailItems) {
          openExerciseDetail(window.exerciseDetailItems[openBtn.getAttribute('data-open-exercise')]);
        } else if (printBtn && window.exerciseDetailItems) {
          printExerciseSheet(window.exerciseDetailItems[printBtn.getAttribute('data-print-exercise')]);
        } else if (printSelectedBtn) {
          printExerciseBatch(Array.from(selectedExerciseIds).map(function(id) { return window.exerciseDetailItems[id]; }).filter(Boolean), '已选训练包');
        } else if (printStudentBtn) {
          printExerciseBatch(Array.from(selectedExerciseIds).map(function(id) { return window.exerciseDetailItems[id]; }).filter(Boolean), '已选训练包', 'student');
        } else if (autoPlanBtn) {
          cancelScheduledExerciseRender();
          buildAutoTrainingPlan();
        } else if (resetBtn) {
          cancelScheduledExerciseRender();
          exerciseFilters = { keyword: '', grade: 'all', type: 'all', error: 'all', quality: 'all', printable: 'all' };
          syncFilterControls();
          renderExerciseCards();
        } else if (packFilterBtn) {
          cancelScheduledExerciseRender();
          var code = packFilterBtn.getAttribute('data-pack-filter');
          exerciseFilters = { keyword: '', grade: 'all', type: 'all', error: code, quality: 'all', printable: 'all' };
          syncFilterControls();
          renderExerciseCards();
          var indexContainer = document.getElementById('exercises-index-container');
          if (indexContainer) indexContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (printPackBtn) {
          var packCode = printPackBtn.getAttribute('data-print-pack');
          var packItems = exerciseAllItems.filter(function(item) { return item.错因码 === packCode; });
          var packTitle = errorPackMeta[packCode] ? errorPackMeta[packCode].title : packCode;
          printExerciseBatch(packItems, packTitle + ' 专题训练包');
        } else if (loadMoreBtn) {
          cancelScheduledExerciseRender();
          renderExerciseCards({ preserveFiltered: true, incrementCount: EXERCISE_RENDER_STEP });
        } else if (closeBtn || (modal && event.target === modal)) {
          closeExerciseDetail();
        }
      });
      document.addEventListener('change', function(event) {
        var selected = event.target.closest('[data-select-exercise]');
        if (selected) {
          var id = selected.getAttribute('data-select-exercise');
          if (selected.checked) selectedExerciseIds.add(id);
          else selectedExerciseIds.delete(id);
          updateSelectedCount();
          return;
        }
        var id = event.target.id;
        if (id === 'exerciseGradeFilter') exerciseFilters.grade = event.target.value;
        else if (id === 'exerciseTypeFilter') exerciseFilters.type = event.target.value;
        else if (id === 'exerciseErrorFilter') exerciseFilters.error = event.target.value;
        else if (id === 'exerciseQualityFilter') exerciseFilters.quality = event.target.value;
        else if (id === 'exercisePrintableFilter') exerciseFilters.printable = event.target.value;
        else return;
        cancelScheduledExerciseRender();
        renderExerciseCards();
      });
      document.addEventListener('input', function(event) {
        if (event.target.id !== 'exerciseSearchInput') return;
        exerciseFilters.keyword = event.target.value;
        scheduleExerciseCardsRender();
      });
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') closeExerciseDetail();
      });

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderExerciseQualityIndex);
      } else {
        renderExerciseQualityIndex();
      }
    })();
