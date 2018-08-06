const CACHE = 'some_cache';
const SOURCE_URLS = [
    'main.css',
    'index.js',
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE)
            .then(function (cacheInstance) {
                console.log('Opened cache');

                return cacheInstance.addAll(SOURCE_URLS);
            })
            .catch(function (err) {
                console.error('Cache open failed', err);
            })
    );
});
