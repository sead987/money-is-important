const CACHE_NAME = 'toolbox-v1';
const ASSETS = [
  './',
  './index.html',
  './color.html',
  './pass.html',
  './qr.html',
  './unit.html',
  './shared/style.css',
  './shared/app.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
