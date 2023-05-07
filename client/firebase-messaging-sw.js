// NO MOVER ARCHIVO, ES IMPORTANTE PARA FIREBASE. HAY UNA FORMA PARA MOVERLO PERO NO CACHÉ XD

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
