var cacheName = 'spicefitnessV1';

var filesToCache = [
    './',
    './index.html',
	'./js/vendor/modernizr-2.8.3.min.js',
	'./js/vendor/jquery-1.12.0.min.js',
	'./js/bootstrap.min.js',
	'./js/jquery.nivo.slider.pack.js',
	'./js/owl.carousel.min.js',
	'./js/ajax-mail.js',
	'./js/jquery.magnific-popup.js',
	'./js/jquery.counterup.min.js',
	'./js/waypoints.min.js',
	'./js/plugins.js',
	'./js/main.js',
	'./js/toast.js',
	'./js/offline.js',
	'./js/notification.js',
	'./js/app.js',
	'./css/bootstrap.min.css',
	'./css/core.css',
	'./style.css',
	'./css/responsive.css',
	'./images/apple-touch-icon.png',
	'./images/logo/logo2.png',
	'./images/about/1.jpg',
	'./images/gallery/1a.jpg',
	'./images/blog/1.jpg',
	'./images/blog/2.jpg',
	'./images/feature/1.png',
	'./images/feature/2.png',
	'./images/feature/3.png',
	'./images/slider/slider1.jpg',
	'./images/slider/slider2.jpg',
	'./images/slider/slider3.jpg'
	
    
];

// Install Service Worker
self.addEventListener('install', function(event) {

    console.log('Service Worker: Installing....');

    event.waitUntil(

        // Open the Cache
        caches.open(cacheName).then(function(cache) {
            console.log('Service Worker: Caching App Shell at the moment......');

            // Add Files to the Cache
            return cache.addAll(filesToCache);
        })
    );
});


// Fired when the Service Worker starts up
self.addEventListener('activate', function(event) {

    console.log('Service Worker: Activating....');

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(key) {
                if( key !== cacheName) {
                    console.log('Service Worker: Removing Old Cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function(event) {

    console.log('Service Worker: Fetch', event.request.url);

    console.log("Url", event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request) ;
        })
    );
});

self.addEventListener('push', function(event) {

		console.info('Event: Push');
			var pushData;

		  if (event.data) {
			pushData = event.data.text();
		  } else {
			pushData = 'Push message no payload';
		  }
  var title = 'SpiceFitness';

  var body = {
    'body': 'Click to see the latest Offers',
    'tag': 'pwa',
    'icon': './images/48x48.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, body)
  );
});


self.addEventListener('notificationclick', function(event) {

  var url = './index.html';

  event.notification.close(); //Close the notification

  // Open the app and navigate to latest.html after clicking the notification
  event.waitUntil(
    clients.openWindow(url)
  );

});
