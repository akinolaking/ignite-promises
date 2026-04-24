// Promises Service Worker — offline-first for daily habit app
const CACHE = 'promises-v1';
const STATIC = [
  'Promises.html',
  'Auth.html',
  'Landing.html',
  'tweaks-panel.jsx',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first for navigations, cache-first for assets
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('Promises.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

// Daily reminder push notification (triggered by client)
self.addEventListener('push', e => {
  e.waitUntil(
    self.registration.showNotification('Promises', {
      body: e.data?.text() || 'Your daily check-in is waiting. One word. One promise. ✦',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'daily-checkin',
      renotify: true,
      actions: [{ action: 'checkin', title: 'Check In Now' }]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      const existing = list.find(c => c.url.includes('Promises.html'));
      if (existing) return existing.focus();
      return clients.openWindow('Promises.html');
    })
  );
});
