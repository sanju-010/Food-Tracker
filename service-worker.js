// Define a cache name for the app assets
const CACHE_NAME = 'nutritrack-cache-v1';

// List all the assets you want to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // You would also list other assets like CSS, JS, and image files here
  // For this example, we will assume all assets are in index.html for simplicity.
  // In a real-world app, you would cache your specific files.
];

// The 'install' event is fired when the service worker is installed
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    // Open a cache and add all the files to it
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all URLs to the cache
        return cache.addAll(urlsToCache);
      })
  );
});

// The 'fetch' event is fired every time the browser requests a resource
self.addEventListener('fetch', event => {
  event.respondWith(
    // Check if the requested resource is in our cache
    caches.match(event.request)
      .then(response => {
        // If it's in the cache, return the cached version
        if (response) {
          return response;
        }
        // Otherwise, fetch the resource from the network
        return fetch(event.request);
      })
  );
});

// The 'activate' event is fired when the service worker is activated
self.addEventListener('activate', event => {
  // Clear old caches when a new service worker is activated
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete any caches that aren't in the whitelist
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
