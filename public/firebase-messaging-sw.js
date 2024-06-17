/* eslint-disable no-undef */
importScripts(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

self.addEventListener("install", function () {
    self.skipWaiting();
});

self.addEventListener("activate", function () {
    console.log("fcm service worker가 실행되었습니다.");
});

const firebaseConfig = {
    apiKey: import.meta.env.REACT_APP_API_KEY,
    authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN,
    projectId: import.meta.env.REACT_APP_PROJECT_ID,
    storageBucket: import.meta.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.REACT_APP_APP_ID,
    measurementId: import.meta.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

firebase.messaging();
// const messaging = firebase.messaging();
// messaging.onBackgroundMessage((payload) => {
// const notificationTitle = payload.notification.title;
// console.log("payload", payload);
// const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
// };

// self.registration.showNotification(notificationTitle, notificationOptions);
// });