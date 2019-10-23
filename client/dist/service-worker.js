importScripts("/precache-manifest.e75507b4f81772f2b9627d63f372d625.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");


/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// install new service worker when ok, then reload page
self.addEventListener('message', msg => {
    if (msg.data.action == 'skipWaiting') {
        self.skipWaiting()
    }
})