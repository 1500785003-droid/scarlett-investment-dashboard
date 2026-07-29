// 投资看板 Service Worker - 支持离线访问
const CACHE_NAME = 'investment-dashboard-v1';
const ASSETS = [
  './',
  './dashboard.html',
  './wealth-dashboard.html',
  './data.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// 安装 - 缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {
        // 部分资源缓存失败不影响安装
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// 激活 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求 - 网络优先，失败回退到缓存
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 只缓存同源请求
  if (url.origin !== location.origin) return;
  
  // HTML 文件：网络优先，失败用缓存
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 更新缓存
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match('./dashboard.html');
          });
        })
    );
    return;
  }
  
  // 静态资源：缓存优先，后台更新
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          // 更新缓存
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
