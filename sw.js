/* Офлайн: на площадке связи может не быть, а приложение должно открываться.
   Свежую страницу берём из сети, когда она есть, и кладём в кэш; нет сети —
   отдаём последнюю сохранённую копию. Данные проекта тут ни при чём: они
   живут в localStorage устройства, кэш хранит только сам файл приложения.
   Имя кэша меняется с каждой сборкой — прошлая версия подчищается сама. */
const CACHE = 'ez-crm-45552e94b5';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
