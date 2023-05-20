// https://www.freecodecamp.org/news/397b72168040/
// https://medium.com/@jranand_io/7705bcd3d6cb

// FCM handlers
importScripts("https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.6.2/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "945142036196",
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler((payload) => {
  const notification = JSON.parse(payload.data.notification);
  const notificationTitle = notification.title;
  const notificationOptions = {
    body: notification.body,
  };
  //Show the notification :)
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

const CACHE_NAME = "rydeen-cache-v1";

const staticAssets = [
  "./",
  "./styles.css",
  "./src/darkMode.js",
  "./src/tasks.js",
  "./src/index.js",
  "./src/modalDelete.js",
  "./assets/icon.png",
  "./assets/dots.svg",
  "./assets/plus.svg",
  "./assets/moon.svg",
  "./assets/sun.svg",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
];

self.addEventListener("install", async (event) => {
  const cache = await caches.open(CACHE_NAME);
  cache.addAll(staticAssets);
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheData(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

async function cacheData(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    console.log(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.log("error", request);
    return await cache.match(request);
  }
}
