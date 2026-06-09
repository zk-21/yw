const CACHE_VERSION = 111;
const CACHE_PREFIX = 'diandian-agent';
const PRECACHE = [
  './index.html',
  './search.html',
  './practice.html',
  './parent-guide.html',
  './agent.html',
  './knowledge-map.html',
  './composition.html',
  './pinyin.html',
  './grammar.html',
  './vocabulary.html',
  './grade1.html',
  './grade2.html',
  './grade3.html',
  './grade4.html',
  './grade5.html',
  './grade6.html',
  './extra-topics.html',
  './literary.html',
  './modern-poetry.html',
  './classical-reading.html',
  './narrative-reading.html',
  './expository-reading.html',
  './non-continuous-text.html',
  './book-reading.html',
  './oral-communication.html',
  './application-writing.html',
  './integrated-learning.html',
  './report.html',
  './advanced.html',
  './styles.css',
  './practice-page.css',
  './nav.js',
  './table-responsive.js',
  './search-page.js',
  './vocabulary-page.js',
  './search-worker.js',
  './practice-page-content.js',
  './practice-deferred-loader.js',
  './practice.js',
  './practice-exercise-loader.js',
  './practice-exercise-tools.js',
  './page-toc.js',
  './composition-ai-loader.js',
  './agent.js',
  './index-home-core.js',
  './index-home-role.js',
  './manifest.json',
  './agent-icon.svg',
  './apple-touch-icon.png',
  './data/search-engine.js',
  './data/search-index.json',
  './data/grades.json',
  './data/data-loader-core.js',
  './data/data-loader-global.js',
  './data/grade-page-renderer.js',
  './data/smart-wrong-notebook.js',
  './data/data-export-import.js',
  './practice-three-stage.js',
  './practice-template-drill.js',
  './practice-guided-chat.js'
];

const CACHE_NAMES = {
  precache: `${CACHE_PREFIX}-precache-v${CACHE_VERSION}`,
  pages: `${CACHE_PREFIX}-pages-v${CACHE_VERSION}`,
  assets: `${CACHE_PREFIX}-assets-v${CACHE_VERSION}`,
  data: `${CACHE_PREFIX}-data-v${CACHE_VERSION}`,
  images: `${CACHE_PREFIX}-images-v${CACHE_VERSION}`
};

const MANAGED_CACHES = Object.keys(CACHE_NAMES).map((key) => CACHE_NAMES[key]);
const CACHE_LIMITS = {
  [CACHE_NAMES.pages]: 24,
  [CACHE_NAMES.assets]: 80,
  [CACHE_NAMES.data]: 24,
  [CACHE_NAMES.images]: 48
};
const CACHE_BUST_PARAM_RE = /^(?:v|ver|version|cache|cachebust|cb|t|ts|timestamp)$/i;

function isManagedCache(name) {
  return name.indexOf(`${CACHE_PREFIX}-`) === 0;
}

function isCacheableResponse(response) {
  return response && response.ok && response.type !== 'error';
}

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isNavigationRequest(request) {
  if (request.mode === 'navigate') return true;
  const accept = request.headers.get('accept') || '';
  return accept.indexOf('text/html') >= 0;
}

function isDataRequest(url) {
  return url.pathname.indexOf('/data/') >= 0 || /\.json$/i.test(url.pathname);
}

function isStaticAssetRequest(url) {
  return /\.(?:css|js|mjs)$/i.test(url.pathname);
}

function isImageRequest(url) {
  return /\.(?:png|jpe?g|gif|webp|svg|ico)$/i.test(url.pathname);
}

function shouldNormalizeCacheKey(request, url) {
  if (!isSameOrigin(url) || !url.search) return false;

  if (isNavigationRequest(request)) {
    return true;
  }

  if (isStaticAssetRequest(url) || isImageRequest(url) || isDataRequest(url)) {
    const keys = Array.from(url.searchParams.keys());
    return keys.length > 0 && keys.every((key) => CACHE_BUST_PARAM_RE.test(key));
  }

  return false;
}

// Canonicalize same-origin cache-busted URLs so precache and runtime cache share one entry.
function getCacheKey(request) {
  const url = new URL(request.url);
  if (!shouldNormalizeCacheKey(request, url)) {
    return request;
  }
  return new Request(`${url.origin}${url.pathname}`, request);
}

async function trimCache(cacheName, maxEntries) {
  if (!maxEntries) return;
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;

  const surplus = keys.length - maxEntries;
  await Promise.all(keys.slice(0, surplus).map((key) => cache.delete(key)));
}

async function putInCache(cacheName, request, response) {
  if (!isCacheableResponse(response)) return response;
  const cache = await caches.open(cacheName);
  await cache.put(getCacheKey(request), response.clone());
  await trimCache(cacheName, CACHE_LIMITS[cacheName]);
  return response;
}

async function precacheAssets() {
  const cache = await caches.open(CACHE_NAMES.precache);
  await cache.addAll(PRECACHE);
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cacheKey = getCacheKey(request);
  const cached = await cache.match(cacheKey);
  const networkPromise = fetch(request)
    .then((response) => putInCache(cacheName, request, response))
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) return networkResponse;

  return caches.match(cacheKey);
}

async function cacheFirst(request, cacheName) {
  const cacheKey = getCacheKey(request);
  const cached = await caches.match(cacheKey);
  if (cached) return cached;

  const response = await fetch(request);
  return putInCache(cacheName, request, response);
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cacheKey = getCacheKey(request);
  try {
    const response = await fetch(request);
    await putInCache(cacheName, request, response);
    return response;
  } catch (error) {
    const cached = await caches.match(cacheKey);
    if (cached) return cached;

    if (fallbackUrl) {
      const fallback = await caches.match(fallbackUrl);
      if (fallback) return fallback;
    }

    throw error;
  }
}

async function clearManagedCaches() {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => isManagedCache(key))
      .map((key) => caches.delete(key))
  );
}

function replyMessage(port, type, data) {
  if (!port) return;
  port.postMessage({ type, data });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    precacheAssets().then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => isManagedCache(key) && MANAGED_CACHES.indexOf(key) === -1)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!isSameOrigin(url) || url.hostname.indexOf('deepseek.com') >= 0) {
    return;
  }

  if (isNavigationRequest(event.request)) {
    event.respondWith(networkFirst(event.request, CACHE_NAMES.pages, './index.html'));
    return;
  }

  if (isDataRequest(url)) {
    event.respondWith(staleWhileRevalidate(event.request, CACHE_NAMES.data));
    return;
  }

  if (isImageRequest(url)) {
    event.respondWith(cacheFirst(event.request, CACHE_NAMES.images));
    return;
  }

  if (isStaticAssetRequest(url)) {
    event.respondWith(staleWhileRevalidate(event.request, CACHE_NAMES.assets));
    return;
  }

  event.respondWith(networkFirst(event.request, CACHE_NAMES.assets));
});

self.addEventListener('message', (event) => {
  const message = event.data || {};
  const replyPort = event.ports && event.ports[0];

  if (message.type === 'GET_VERSION_INFO') {
    caches.keys().then((keys) => {
      replyMessage(replyPort, 'GET_VERSION_INFO_SUCCESS', {
        currentVersion: CACHE_VERSION,
        availableVersions: [CACHE_VERSION],
        hasRollbackOption: false,
        cacheNames: keys.filter((key) => isManagedCache(key))
      });
    }).catch((error) => {
      replyMessage(replyPort, 'GET_VERSION_INFO_ERROR', {
        error: error && error.message ? error.message : String(error)
      });
    });
    return;
  }

  if (message.type === 'FORCE_REFRESH') {
    clearManagedCaches()
      .then(() => precacheAssets())
      .then(() => {
        replyMessage(replyPort, 'FORCE_REFRESH_SUCCESS', {
          currentVersion: CACHE_VERSION
        });
      })
      .catch((error) => {
        replyMessage(replyPort, 'FORCE_REFRESH_ERROR', {
          error: error && error.message ? error.message : String(error)
        });
      });
    return;
  }

  if (message.type === 'CLEAR_CACHE') {
    clearManagedCaches()
      .then(() => {
        replyMessage(replyPort, 'CLEAR_CACHE_SUCCESS', {
          currentVersion: CACHE_VERSION
        });
      })
      .catch((error) => {
        replyMessage(replyPort, 'CLEAR_CACHE_ERROR', {
          error: error && error.message ? error.message : String(error)
        });
      });
    return;
  }

  if (message.type === 'ROLLBACK') {
    replyMessage(replyPort, 'ROLLBACK_ERROR', {
      error: '当前仅保留单版本缓存，未启用离线回滚。'
    });
    return;
  }

  if (message.type === 'SKIP_WAITING') {
    self.skipWaiting();
    replyMessage(replyPort, 'SKIP_WAITING_SUCCESS', {
      currentVersion: CACHE_VERSION
    });
  }
});
