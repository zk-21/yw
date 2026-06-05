self.importScripts('data/search-engine.js');

var searchIndexPromise = null;

function loadSearchIndex() {
  if (searchIndexPromise) return searchIndexPromise;

  searchIndexPromise = fetch('data/search-index.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Failed to load search index: ' + response.status);
      return response.json();
    })
    .then(function (index) {
      if (!index || !Array.isArray(index.items)) {
        throw new Error('Invalid search index payload');
      }
      return index;
    })
    .catch(function (error) {
      searchIndexPromise = null;
      throw error;
    });

  return searchIndexPromise;
}

function post(type, payload) {
  self.postMessage({
    type: type,
    payload: payload || {}
  });
}

self.addEventListener('message', function (event) {
  var data = event.data || {};
  var requestId = data.requestId;

  if (data.type === 'warmup') {
    loadSearchIndex()
      .then(function () {
        post('warmup:done', { requestId: requestId });
      })
      .catch(function (error) {
        post('warmup:error', {
          requestId: requestId,
          error: error && error.message ? error.message : String(error)
        });
      });
    return;
  }

  if (data.type === 'search') {
    loadSearchIndex()
      .then(function (index) {
        return SearchEngine.searchIndexData(index.items, data.keyword, data.options);
      })
      .then(function (results) {
        post('search:done', {
          requestId: requestId,
          results: results
        });
      })
      .catch(function (error) {
        post('search:error', {
          requestId: requestId,
          error: error && error.message ? error.message : String(error)
        });
      });
  }
});
