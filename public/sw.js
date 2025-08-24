// Empty service worker to prevent 404 errors
self.addEventListener('install', function(event) {
  console.log('ProofVault service worker installed');
});

self.addEventListener('activate', function(event) {
  console.log('ProofVault service worker activated');
});

self.addEventListener('fetch', function(event) {
  // For now, just pass through all requests
  return;
});
