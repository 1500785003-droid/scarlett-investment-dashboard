// Service Worker 已禁用 - 不缓存任何内容
// 每次都从服务器获取最新数据
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  // 清理所有旧缓存
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});
// 所有请求直接走网络，不使用缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
