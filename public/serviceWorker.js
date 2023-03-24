/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'),
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  }),
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

//https://gist.github.com/notwaldorf/7740d4249272fb7a2d509b3ea4240658
const CACHE_NAME = 'opencoach-tf';
// Location of all the shards, i.e. all the files next to your model.json file.
const MODEL_PREFIX = 'https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/thunder/4';
const NUM_SHARDS = 3;
// Make sure your shards match this naming scheme (you might not have an extension, for example)
const SHARDS_NAMING_SCHEME = (i) => `${MODEL_PREFIX}/group1-shard${i}of${NUM_SHARDS}.bin`;

self.addEventListener('install', e => {
  e.waitUntil(
    (async function() {
      const cache = await caches.open(CACHE_NAME);
      const resources = [];
      
      resources.push(`${MODEL_PREFIX}/model.json`);
      for (let i = 1; i <= NUM_SHARDS; i++) {
        resources.push(SHARDS_NAMING_SCHEME(i))
      }
  
      // If you have other local files you want to cache, like your index.html or style.css,
      // push them onto the resources array before the next line.
      
      await Promise.all([cache.addAll(resources)]);
    })()
  );
});

self.addEventListener('fetch', e => {
  // Fix the trailing slash.
  let request = e.request;
  if(request.url.endsWith('/')) {
    request = new Request(request.url + 'index.html', e);
  }

  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        console.log('Cached', e.request.url);
        return response;
      } else {
        console.log('Not cached, fetching', e.request.url);
        return fetch(e.request);
      }
      // Or this, if you don't want the console logs for debugging.
      // return response || fetch(e.request);
    })
  );
});
