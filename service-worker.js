// 语文成长地图 Service Worker
// 缓存策略：
//   HTML       — Network-first（始终获取最新页面内容）
//   CSS/JS     — Cache-first（带版本号 ?v=N，更新时自动生效）
//   JSON/图片/字体 — Cache-first
//   非同源请求  — 不缓存（跳过 CDN、API 等外部请求）
//   非 200 响应 — 不缓存
// 版本管理：保留上一版本以供回滚

const CACHE_VERSION = 115; // 修改此数字即可刷新全部缓存
const CACHE_NAME = `diandian-v${CACHE_VERSION}`;
const MAX_CACHES_TO_KEEP = 2; // 保留最新的2个版本

// ── 缓存判断 ──────────────────────────────────────────────
function shouldCache(url) {
  const p = url.pathname;
  // 只处理同源 GET 请求
  if (url.origin !== self.location.origin) return false;
  // 排除 Service Worker 自身
  if (p.endsWith('service-worker.js')) return false;
  // 排除 Node modules 和临时文件
  if (p.startsWith('/node_modules/') || p.includes('/_')) return false;

  return true;
}

function isNavigationOrHTML(request, url) {
  return (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/' ||
    url.pathname.endsWith('/')
  );
}

function isCacheFirst(request) {
  const d = request.destination;
  return (
    d === 'style' ||
    d === 'script' ||
    d === 'image' ||
    d === 'font' ||
    d === 'manifest' ||
    d === 'worker'
  );
}

// ── 版本管理工具函数 ──────────────────────────────────────
function getVersionFromCacheName(cacheName) {
  const match = cacheName.match(/diandian-v(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

async function getAvailableVersions() {
  const keys = await caches.keys();
  return keys
    .filter(k => k.startsWith('diandian-v'))
    .map(k => ({ name: k, version: getVersionFromCacheName(k) }))
    .sort((a, b) => b.version - a.version);
}

// ── Install：预缓存关键静态资源 ──────────────────────────
const PRECACHE = [
  './index.html',
  './agent.html',
  './report.html',
  './404.html',
  './extra-topics.html',
  './oral-communication.html',
  './application-writing.html',
  './integrated-learning.html',
  './narrative-reading.html',
  './non-continuous-text.html',
  './expository-reading.html',
  './classical-reading.html',
  './literary.html',
  './modern-poetry.html',
  './book-reading.html',
  './styles.css',
  './nav.js',
  './index-home-core.js',
  './index-home-role.js',
  './table-responsive.js',
  './data/data-loader-global.js',
  './data/data-loader-core.js',
  './manifest.json',
  './favicon.ico',
  './apple-touch-icon.png',
  './agent-icon.svg',
  './agent-icon-512.png',
  './page-toc.js',
  './data/grades.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE).catch((err) => {
        // 个别文件加载失败不影响安装
        console.warn('[SW] pre-cache partial failure:', err.message);
      }))
      .then(() => self.skipWaiting())
  );
});

// ── Activate：智能清理旧缓存（保留上一版本） ──────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    getAvailableVersions()
      .then((versions) => {
        // 只保留最新的 MAX_CACHES_TO_KEEP 个版本
        const toDelete = versions.slice(MAX_CACHES_TO_KEEP);
        return Promise.all(
          toDelete.map(v => caches.delete(v.name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// ── 版本信息查询 ──────────────────────────────────────────
async function getVersionInfo() {
  const versions = await getAvailableVersions();
  return {
    currentVersion: CACHE_VERSION,
    availableVersions: versions,
    hasRollbackOption: versions.length > 1
  };
}

// ── 强制刷新缓存 ──────────────────────────────────────────
async function forceRefreshCache() {
  // 删除所有缓存，强制重新加载
  const keys = await caches.keys();
  await Promise.all(
    keys.filter(k => k.startsWith('diandian-v')).map(k => caches.delete(k))
  );
  // 立即重新安装
  return caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE));
}

// ── 回滚到上一版本 ────────────────────────────────────────
async function rollbackToPreviousVersion() {
  const versions = await getAvailableVersions();
  if (versions.length < 2) {
    throw new Error('没有可回滚的历史版本');
  }
  
  const previousVersion = versions[1];
  const currentCache = await caches.open(CACHE_NAME);
  
  // 从历史版本复制所有资源到当前版本
  const previousCache = await caches.open(previousVersion.name);
  const requests = await previousCache.keys();
  
  await Promise.all(
    requests.map(req => 
      previousCache.match(req).then(res => {
        if (res) return currentCache.put(req, res);
      })
    )
  );
  
  return { rolledBackTo: previousVersion.version };
}

// ── 消息通信处理 ──────────────────────────────────────────
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION_INFO':
      getVersionInfo().then(info => {
        event.ports[0]?.postMessage({ type: 'VERSION_INFO', data: info });
      });
      break;
      
    case 'FORCE_REFRESH':
      forceRefreshCache().then(() => {
        event.ports[0]?.postMessage({ type: 'REFRESH_COMPLETE' });
        self.skipWaiting();
      }).catch(err => {
        event.ports[0]?.postMessage({ type: 'REFRESH_ERROR', error: err.message });
      });
      break;
      
    case 'ROLLBACK':
      rollbackToPreviousVersion().then(result => {
        event.ports[0]?.postMessage({ type: 'ROLLBACK_COMPLETE', data: result });
        self.skipWaiting();
      }).catch(err => {
        event.ports[0]?.postMessage({ type: 'ROLLBACK_ERROR', error: err.message });
      });
      break;
      
    case 'CLEAR_CACHE':
      caches.keys().then(keys => {
        Promise.all(keys.map(k => caches.delete(k))).then(() => {
          event.ports[0]?.postMessage({ type: 'CACHE_CLEARED' });
        });
      });
      break;
  }
});

// ── Fetch：分层缓存策略 ──────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 只处理 GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 跳过外部域名
  if (!shouldCache(url)) return;

  // 跳过 chrome-extension 等非 http 协议
  if (!url.protocol.startsWith('http')) return;

  // ── HTML：Network-first ──
  if (isNavigationOrHTML(request, url)) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // 离线回退到缓存
          const cached = await caches.match(request);
          return cached || caches.match('./404.html');
        }
      })()
    );
    return;
  }

  // ── CSS / JS / 图片 / 字体 / JSON：Cache-first ──
  if (isCacheFirst(request) || url.pathname.match(/\.(json|xml|svg|ico|png|jpg|webp|woff2?|ttf)$/i)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // 非关键资源，静默失败
          return new Response('', { status: 503 });
        }
      })()
    );
    return;
  }

  // ── 其他同源资源：Stale-while-revalidate ──
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      const fetchPromise = (async () => {
        try {
          const response = await fetch(request);
          if (response && response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
          }
          return response;
        } catch (_) { return null; }
      })();

      return cached || (await fetchPromise) || new Response('', { status: 503 });
    })()
  );
});

// ── 调试日志 ──────────────────────────────────────────────
console.log(`[SW] Version ${CACHE_VERSION} loaded`);
