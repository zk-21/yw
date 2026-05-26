// 搜索增强器
window.SearchEnhancer = (function() {
  let searchIndex = null;
  let searchHistory = [];

  // 加载搜索索引
  async function loadSearchIndex() {
    if (searchIndex) return searchIndex;
    
    try {
      const response = await fetch('data/search-index.json');
      searchIndex = await response.json();
      return searchIndex;
    } catch (e) {
      console.error('加载搜索索引失败:', e);
      return null;
    }
  }

  // 加载搜索历史
  function loadSearchHistory() {
    try {
      const saved = localStorage.getItem('searchHistory');
      if (saved) {
        searchHistory = JSON.parse(saved);
      }
    } catch (e) {
      console.error('加载搜索历史失败:', e);
    }
  }

  // 保存搜索历史
  function saveSearchHistory() {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (e) {
      console.error('保存搜索历史失败:', e);
    }
  }

  // 添加搜索记录
  function addSearchHistory(query) {
    // 移除重复记录
    searchHistory = searchHistory.filter(q => q !== query);
    // 添加到开头
    searchHistory.unshift(query);
    // 限制最多10条
    searchHistory = searchHistory.slice(0, 10);
    saveSearchHistory();
  }

  // 获取搜索历史
  function getSearchHistory() {
    return searchHistory;
  }

  // 清除搜索历史
  function clearSearchHistory() {
    searchHistory = [];
    saveSearchHistory();
  }

  // 获取搜索建议
  async function getSuggestions(query, limit = 5) {
    const index = await loadSearchIndex();
    if (!index || !query.trim()) return [];

    const suggestions = [];
    const queryLower = query.toLowerCase();

    // 从索引中查找匹配
    if (index.entries) {
      index.entries.forEach(entry => {
        const title = entry.title.toLowerCase();
        const keywords = entry.keywords ? entry.keywords.join(' ').toLowerCase() : '';
        
        if (title.includes(queryLower) || keywords.includes(queryLower)) {
          suggestions.push({
            title: entry.title,
            type: entry.type,
            grade: entry.grade,
            url: entry.url
          });
        }
      });
    }

    // 按匹配度排序
    suggestions.sort((a, b) => {
      const aMatch = a.title.toLowerCase().indexOf(queryLower);
      const bMatch = b.title.toLowerCase().indexOf(queryLower);
      return aMatch - bMatch;
    });

    return suggestions.slice(0, limit);
  }

  // 执行搜索
  async function search(query, options = {}) {
    const index = await loadSearchIndex();
    if (!index || !query.trim()) return [];

    const {
      grade = null,
      type = null,
      sortBy = 'relevance',
      limit = 20
    } = options;

    const queryLower = query.toLowerCase();
    const results = [];

    if (index.entries) {
      index.entries.forEach(entry => {
        // 匹配查询
        let match = false;
        let score = 0;

        // 标题匹配
        if (entry.title.toLowerCase().includes(queryLower)) {
          match = true;
          score += 10;
        }

        // 关键词匹配
        if (entry.keywords) {
          entry.keywords.forEach(keyword => {
            if (keyword.toLowerCase().includes(queryLower)) {
              match = true;
              score += 5;
            }
          });
        }

        // 描述匹配
        if (entry.description && entry.description.toLowerCase().includes(queryLower)) {
          match = true;
          score += 3;
        }

        // 年级过滤
        if (grade && entry.grade !== grade) {
          match = false;
        }

        // 类型过滤
        if (type && entry.type !== type) {
          match = false;
        }

        if (match) {
          results.push({
            ...entry,
            score
          });
        }
      });
    }

    // 排序
    if (sortBy === 'relevance') {
      results.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'grade') {
      results.sort((a, b) => {
        const gradeOrder = { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6 };
        return (gradeOrder[a.grade] || 0) - (gradeOrder[b.grade] || 0);
      });
    } else if (sortBy === 'type') {
      results.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
    }

    // 添加搜索记录
    addSearchHistory(query);

    return results.slice(0, limit);
  }

  // 获取搜索统计
  function getSearchStats() {
    return {
      totalSearches: searchHistory.length,
      recentSearches: searchHistory.slice(0, 5)
    };
  }

  // 初始化
  loadSearchHistory();

  return {
    search,
    getSuggestions,
    getSearchHistory,
    clearSearchHistory,
    getSearchStats
  };
})();