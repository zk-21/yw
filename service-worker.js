const CACHE_NAME = 'diandian-agent-v51';
const STATIC_ASSETS = [
  './',
  './index.html',
  './agent.html',
  './agent.js',
  './styles.css',
  './nav.js',
  './composition.html',
  './composition-ai.js',
  './practice.html',
  './practice.js',
  './pinyin.html',
  './grammar.html',
  './knowledge-map.html',
  './vocabulary.html',
  './grade1.html',
  './grade2.html',
  './grade3.html',
  './grade4.html',
  './grade5.html',
  './grade6.html',
  './table-responsive.js',
  './agent-icon.svg',
  './agent-icon-512.png',
  './apple-touch-icon.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  if (url.hostname.includes('deepseek.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => (
      cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
    ))
  );
});
