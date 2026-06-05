(function (global) {
  'use strict';

  var TYPE_KEYWORDS = {
    grammar: '语法 知识',
    vocabulary: '词汇 词语',
    literary: '文学 常识',
    mistake: '错题 常见错误 易错',
    essay: '作文 写作 范文 方法',
    exercise: '题库 练习 习题'
  };

  var preparedIndexCache = typeof WeakMap === 'function' ? new WeakMap() : null;

  function normalizeText(value) {
    return String(value || '').toLowerCase();
  }

  function buildSearchText(item) {
    return [
      item && item.title,
      item && item.summary,
      item && item.content,
      item && item.category,
      item && item.source,
      TYPE_KEYWORDS[item && item.type] || (item && item.type),
      item && item.difficulty,
      item && item.abilities && item.abilities.join(' '),
      item && item.keywords && item.keywords.join(' ')
    ].filter(Boolean).join(' ').toLowerCase();
  }

  function buildTokenSourceText(item) {
    return [
      item && item.title,
      item && item.category,
      TYPE_KEYWORDS[item && item.type] || (item && item.type),
      item && item.source,
      item && item.keywords && item.keywords.join(' '),
      item && item.abilities && item.abilities.join(' ')
    ].filter(Boolean).join(' ').toLowerCase();
  }

  function collectIndexTokens(text) {
    var normalized = normalizeText(text);
    var segments = normalized.split(/[^0-9a-z\u4e00-\u9fa5]+/).filter(Boolean);
    var seen = {};
    var tokens = [];

    segments.forEach(function (segment) {
      if (!segment) return;

      if (segment.length > 1) {
        if (!seen[segment]) {
          seen[segment] = true;
          tokens.push(segment);
        }
      }

      if (/^[\u4e00-\u9fa5]+$/.test(segment) && segment.length > 1) {
        for (var i = 0; i < segment.length - 1; i++) {
          var gram = segment.slice(i, i + 2);
          if (!seen[gram]) {
            seen[gram] = true;
            tokens.push(gram);
          }
        }
      }
    });

    return tokens;
  }

  function getQueryTokens(keyword) {
    var normalized = normalizeText(keyword).trim();
    if (!normalized || normalized.length < 2) return [];
    return collectIndexTokens(normalized);
  }

  function intersectArrays(left, right) {
    var results = [];
    var i = 0;
    var j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] === right[j]) {
        results.push(left[i]);
        i += 1;
        j += 1;
      } else if (left[i] < right[j]) {
        i += 1;
      } else {
        j += 1;
      }
    }

    return results;
  }

  function buildPreparedIndex(items) {
    if (!Array.isArray(items)) {
      return {
        records: [],
        tokenMap: {}
      };
    }

    if (preparedIndexCache && preparedIndexCache.has(items)) {
      return preparedIndexCache.get(items);
    }

    var tokenMap = {};
    var records = items.map(function (item, index) {
      var searchText = buildSearchText(item);
      var tokenSource = buildTokenSourceText(item);
      var tokens = collectIndexTokens(tokenSource);

      tokens.forEach(function (token) {
        if (!tokenMap[token]) tokenMap[token] = [];
        tokenMap[token].push(index);
      });

      return {
        item: item,
        searchText: searchText,
        titleText: normalizeText(item && item.title),
        scoreGrade: item && item.grade ? item.grade : 0
      };
    });

    var prepared = {
      records: records,
      tokenMap: tokenMap
    };

    if (preparedIndexCache) {
      preparedIndexCache.set(items, prepared);
    }

    return prepared;
  }

  function parseGradeRange(text) {
    var raw = String(text || '');
    var rangeMatch = raw.match(/([1-6])\s*(?:-|—|~|至|到)\s*([1-6])\s*年级/);
    if (rangeMatch) {
      return {
        min: Math.min(parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10)),
        max: Math.max(parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10))
      };
    }

    var singleMatch = raw.match(/([1-6])\s*年级/);
    if (singleMatch) {
      var value = parseInt(singleMatch[1], 10);
      return { min: value, max: value };
    }

    return null;
  }

  function matchGrade(item, gradeValue) {
    if (!gradeValue || gradeValue === 'all') return true;

    var target = parseInt(gradeValue, 10);
    if (!target) return true;

    var minGrade = parseInt(item && item.minGrade, 10);
    var maxGrade = parseInt(item && item.maxGrade, 10);
    if (minGrade && maxGrade) return target >= minGrade && target <= maxGrade;

    var range = parseGradeRange(item && item.gradeRange) || parseGradeRange(item && item.category);
    if (!range && item && item.content) {
      var applicable = String(item.content).match(/适用年级["']?\s*[:：]?\s*["']?\s*([1-6]\s*(?:-|—|~|至|到)\s*[1-6]\s*年级|[1-6]\s*年级)/);
      range = applicable ? parseGradeRange(applicable[1]) : null;
    }
    if (range) return target >= range.min && target <= range.max;

    var grade = parseInt(item && item.grade, 10);
    return !grade || grade === target;
  }

  function getKeywords(keyword) {
    return normalizeText(keyword).trim().split(/\s+/).filter(function (item) {
      return item.length > 0;
    });
  }

  function computeRelevance(item, keywordText) {
    var title = normalizeText(item && item.title);
    var summary = normalizeText(item && item.summary);
    var category = normalizeText(item && item.category);
    var source = normalizeText(item && item.source);
    var keywords = Array.isArray(item && item.keywords) ? item.keywords.join(' ').toLowerCase() : '';
    var abilities = Array.isArray(item && item.abilities) ? item.abilities.join(' ').toLowerCase() : '';

    var score = 0;
    if (title.indexOf(keywordText) >= 0) score += 40;
    if (keywords.indexOf(keywordText) >= 0) score += 20;
    if (summary.indexOf(keywordText) >= 0) score += 12;
    if (category.indexOf(keywordText) >= 0) score += 8;
    if (abilities.indexOf(keywordText) >= 0) score += 6;
    if (source.indexOf(keywordText) >= 0) score += 2;
    return score;
  }

  function searchIndexData(items, keyword, options) {
    var preparedIndex = buildPreparedIndex(items);
    var opts = options || {};
    var filterType = opts.type || null;
    var filterGrade = opts.grade || null;
    var keywordText = normalizeText(keyword).trim();
    var keywords = getKeywords(keywordText);

    if (!keywords.length) return [];

    var candidateIndexes = null;
    keywords.forEach(function (part) {
      var tokens = getQueryTokens(part);
      if (!tokens.length) return;

      var partIndexes = null;
      tokens.forEach(function (token) {
        var tokenHits = preparedIndex.tokenMap[token];
        if (!tokenHits || !tokenHits.length) {
          partIndexes = [];
          return;
        }
        partIndexes = partIndexes ? intersectArrays(partIndexes, tokenHits) : tokenHits.slice();
      });

      if (!partIndexes) return;
      candidateIndexes = candidateIndexes ? intersectArrays(candidateIndexes, partIndexes) : partIndexes;
    });

    var records = candidateIndexes ? candidateIndexes.map(function (index) {
      return preparedIndex.records[index];
    }) : preparedIndex.records;

    return records.filter(function (record) {
      var item = record.item;
      var content = record.searchText;
      var matchAll = keywords.every(function (part) {
        return content.indexOf(part) >= 0;
      });
      if (!matchAll) return false;
      if (filterType && item.type !== filterType) return false;
      if (!matchGrade(item, filterGrade)) return false;
      return true;
    }).map(function (record) {
      return {
        item: record.item,
        score: computeRelevance(record.item, keywordText),
        titleText: record.titleText,
        scoreGrade: record.scoreGrade
      };
    }).sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;

      var aTitleMatch = a.titleText.indexOf(keywordText) >= 0 ? 0 : 1;
      var bTitleMatch = b.titleText.indexOf(keywordText) >= 0 ? 0 : 1;
      if (aTitleMatch !== bTitleMatch) return aTitleMatch - bTitleMatch;

      return (a.scoreGrade || 0) - (b.scoreGrade || 0);
    }).map(function (entry) {
      return entry.item;
    });
  }

  global.SearchEngine = {
    buildSearchText: buildSearchText,
    buildPreparedIndex: buildPreparedIndex,
    parseGradeRange: parseGradeRange,
    matchGrade: matchGrade,
    searchIndexData: searchIndexData
  };
})(typeof self !== 'undefined' ? self : window);
