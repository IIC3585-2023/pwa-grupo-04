// https://www.freecodecamp.org/news/397b72168040/
// https://medium.com/@jranand_io/7705bcd3d6cb

// FCM handlers
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

const app = firebase.initializeApp({
  apiKey: "AIzaSyBPfK1YFA54QJQQoza0BT50_0JOogFHdaA",
  authDomain: "test-6fdb8.firebaseapp.com",
  projectId: "test-6fdb8",
  storageBucket: "test-6fdb8.appspot.com",
  messagingSenderId: "945142036196",
  appId: "1:945142036196:web:ae6bd9c120f6b8c53a1ef1",
  measurementId: "G-SNYKK2G41G",
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
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
  "./src/swRegistration.js",
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
