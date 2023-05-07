const config = {
  apiKey: "AIzaSyBPfK1YFA54QJQQoza0BT50_0JOogFHdaA",
  authDomain: "test-6fdb8.firebaseapp.com",
  projectId: "test-6fdb8",
  storageBucket: "test-6fdb8.appspot.com",
  messagingSenderId: "945142036196",
  appId: "1:945142036196:web:ae6bd9c120f6b8c53a1ef1",
  measurementId: "G-SNYKK2G41G",
};

firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging
  .requestPermission()
  .then(() => {
    console.log("Notifications allowed");
    const token = messaging.getToken();
    return token;
  })
  .then((token) => {
    sendSubscriptionIDToServer(token);
    console.log("Sending token to api: ", token);
  })
  .catch((err) => {
    console.log("No permission to send push", err);
  });

messaging.onMessage((payload) => {
  console.log("hola");
  const notification = JSON.parse(payload.data.notification);
  const notificationTitle = notification.title;
  const notificationOptions = {
    body: notification.body,
  };
  //Show the notification :)
  return new Notification(notificationTitle, notificationOptions);
});

function sendSubscriptionIDToServer(subscription) {
  fetch("https://pwaapiv2.onrender.com/subscribers", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscriptionid: subscription }),
  });
}
