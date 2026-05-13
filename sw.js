const CACHE_NAME = 'ki-jambi-v1';
const URLS_TO_CACHE = [
  '/Jadwal-Sidang-Sengketa-Informasi-KI-Jambi/',
  '/Jadwal-Sidang-Sengketa-Informasi-KI-Jambi/index.html',
  '/Jadwal-Sidang-Sengketa-Informasi-KI-Jambi/icon-192.png',
  '/Jadwal-Sidang-Sengketa-Informasi-KI-Jambi/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('sheets.googleapis.com') ||
      event.request.url.includes('drive.google.com')) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
