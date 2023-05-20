// https://github.com/alamshertiwana/to-do-list-pwa/blob/master/index.html
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js";

// FCM config
const firebaseConfig = {
  apiKey: "AIzaSyBPfK1YFA54QJQQoza0BT50_0JOogFHdaA",
  authDomain: "test-6fdb8.firebaseapp.com",
  projectId: "test-6fdb8",
  storageBucket: "test-6fdb8.appspot.com",
  messagingSenderId: "945142036196",
  appId: "1:945142036196:web:ae6bd9c120f6b8c53a1ef1",
  measurementId: "G-SNYKK2G41G",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

window.addEventListener("load", async (e) => {
  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker
        .register("./serviceWorker.js")
        .then((swRegistration) => {
          console.log("SW registered");
          subscribeToPushNotifications(swRegistration);
        });
    } catch (error) {
      console.log("SW failed", error);
    }
  }
});

const subscribeToPushNotifications = (swRegistration) => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notifications allowed");
      getToken(messaging, {
        vapidKey: "",
        serviceWorkerRegistration: swRegistration,
      }).then((token) => sendSubscriptionIDToServer(token));
    }
  });
};
const handlePushNotificationsInForeground = () => {
  onMessage(messaging, (payload) => {
    const notification = JSON.parse(payload.data.notification);
    const notificationTitle = notification.title;
    const notificationOptions = {
      body: notification.body,
    };
    //Show the notification :)
    return new Notification(notificationTitle, notificationOptions);
  });
};

function sendSubscriptionIDToServer(subscription) {
  fetch("https://pwabackendv3.onrender.com/subscribers", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscriptionid: subscription }),
  });
  handlePushNotificationsInForeground();
}
