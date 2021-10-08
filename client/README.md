# lectio-lam

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
1. npm run build
2. Copy the following to dist/service-worker.js

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

3. Run 'firebase deploy --only hosting'

4. To deploy server on heroku run on functions folder:
    - git add .
    - git commit -ma "message"
    - git push heroku master
```
### Deploy on testing env
```
1. npm run build
2. Copy the following to dist/service-worker.js

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

3. Replace firebase.json site property to: sizzling-heat-354
4. Run 'firebase deploy --only hosting'

5. To deploy server on heroku run on functions folder:
    - git add .
    - git commit -am "message"
    - git push heroku master
```
### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
