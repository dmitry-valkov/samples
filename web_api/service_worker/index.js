const SW_PATH = './worker.js';

if ('serviceWorker' in navigator) {
    alert('Service Worker is support :)');

    window.addEventListener('load', function () {
        navigator.serviceWorker.register(SW_PATH)
            .then(function (registration) {
                alert(`ServiceWorker registration successful with scope: ${registration.scope}`);
            })
            .catch(function () {
                alert('ServiceWorker registration failed');
            });
    })
} else {
    alert('Service Worker not supported :c');
}
