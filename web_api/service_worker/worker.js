const CACHE_NAME = 'some_cache';
const SOURCE_URLS = [
    'main.css',
    'index.js',
];

// create initial cache
function precache() {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(SOURCE_URLS);
    });
}

function fromCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

function updateCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}

self.addEventListener('install', function(e) {
    console.log('The service worker is being installed.');

    e.waitUntil(precache());
});

self.addEventListener('fetch', function (e) {
    console.log('The service worker is serving the asset.');

    e.respondWith(fromCache(e.request));
    e.waitUntil(updateCache(e.request));
});
