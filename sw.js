const filesToCache = [
  "/",
  "./index.html",
  "./restaurant.html",
  "./css/styles.css",
  "./js/dbhelper.js",
  "./js/main.js",
  "./js/restaurant_info.js",
  "./data/restaurants.json",
  "./img/1.jpg",
  "./img/2.jpg",
  "./img/3.jpg",
  "./img/4.jpg",
  "./img/5.jpg",
  "./img/6.jpg",
  "./img/7.jpg",
  "./img/8.jpg",
  "./img/9.jpg",
  "./img/10.jpg",
  "pages/offline.html",
  "pages/404.html",
  "style/main.css"
];

const staticCacheName = "pages-cache-v5";

self.addEventListener("install", event => {
  //console.log("Attempting to install service worker and cache static assets");
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", event => {
  //console.log("Activating new service worker...");

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  //console.log("Fetch event for ", event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        if (response) {
          //console.log("Found ", event.request.url, " in cache");
          return response;
        }
        // console.log("Network request for ", event.request.url);
        return fetch(event.request).then(response => {
          if (response.status === 404) {
            return caches.match("pages/404.html");
          }
          return caches.open(staticCacheName).then(cache => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
      .catch(error => {
        //console.log("Error, ", error);
        return caches.match("pages/offline.html");
      })
  );
});
