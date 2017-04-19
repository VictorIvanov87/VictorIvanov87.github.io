let appShellCache = 'livescoreApp-v1';
let freshDataCache = 'apiData';
let filesToCache = [
    './',
    './index.html'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(appShellCache)
        .then(cache => {
            // console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    // console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== appShellCache && key !== freshDataCache) {
                    // console.log('[ServiceWorker] Removing old cache: ', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    // console.log('[Service Worker] Fetch', e.request.url);
    let dataUrl = 'http://api.football-data.org';
    let newsUrl = 'https://newsapi.org';
    let logosUrl = 'http://upload.wikimedia.org/';

    if (e.request.url.indexOf(dataUrl) > -1) {
        e.respondWith(
            caches.open(freshDataCache).then(cache => {
                return fetch(e.request).then(response => {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } else if (e.request.url.indexOf(newsUrl) > -1) {
        e.respondWith(
            caches.open(freshDataCache).then(cache => {
                return fetch(e.request).then(response => {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } else if (e.request.url.indexOf(logosUrl) > -1) {
        e.respondWith(
            caches.open(freshDataCache).then(cache => {
                return fetch(e.request).then(response => {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            }));
    } else {
        e.respondWith(
            caches.match(e.request).then(response => response || fetch(e.request))
        );
    }
});

self.addEventListener('push', event => {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'Push Codelab';
    const options = {
        body: 'Yay it works.',
        icon: './icons/LiveScore144.png',
        badge: './icons/LiveScore48.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('localhost:3000')
    );
});
