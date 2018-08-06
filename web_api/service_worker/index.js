const SW_PATH = './worker.js';

if ('serviceWorker' in navigator) {
    console.info('Service Worker is support :)');

    window.addEventListener('load', function () {
        navigator.serviceWorker.register(SW_PATH)
            .then(function (registration) {
                console.info(`ServiceWorker registration successful with scope: ${registration.scope}`);
            })
            .catch(function () {
                console.info('ServiceWorker registration failed');
            });
    })
} else {
    alert('Service Worker not supported :c');
}
