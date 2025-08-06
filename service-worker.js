// Define a cache name for the app assets
const CACHE_NAME = 'nutritrack-cache-v1';

// List all the assets you want to cache
const urlsToCache = [
  '/Food-Tracker/', // The root of your project page
  '/Food-Tracker/index.html',
  '/Food-Tracker/manifest.json',
  '/Food-Tracker/service-worker.js',
  // Add paths to other assets like CSS, JS, and image files if they are not inline or from CDN
  // Example for icons (ensure these paths are correct relative to your repo root):
  '/Food-Tracker/images/icon-72x72.png',
  '/Food-Tracker/images/icon-96x96.png',
  '/Food-Tracker/images/icon-128x128.png',
  '/Food-Tracker/images/icon-144x144.png',
  '/Food-Tracker/images/icon-192x192.png',
  '/Food-Tracker/images/icon-512x512.png',
  // Add any other external CSS/JS files you might be using that aren't CDN
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
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
      .catch(error => {
        console.error('Failed to cache during install:', error);
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
      .catch(error => {
        console.error('Fetch failed:', error);
        // You could return a fallback page here for offline users
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
