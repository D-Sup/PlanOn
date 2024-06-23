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
    apiKey: "AIzaSyCUUkBDxrW2lf1ekCrw9G1cqnSNKx7U44c",
    authDomain: "project-95c1b.firebaseapp.com",
    projectId: "project-95c1b",
    storageBucket: "project-95c1b.appspot.com",
    messagingSenderId: "53370133796",
    appId: "1:53370133796:web:e6826f92d13bb830ff67b1",
    measurementId: "G-BZZS5H0BCS",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        data: {
            url: payload.data.action || "https://plan-on.vercel.app"
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const homeUrl = "https://plan-on.vercel.app";
    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.openWindow(homeUrl).then((windowClient) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    windowClient.navigate(targetUrl);
                    resolve();
                }, 500);
            });
        })
    );
});



// const messaging = firebase.messaging();
// messaging.onBackgroundMessage((payload) => {
//     const notificationTitle = payload.notification.title;
//     console.log("payload", payload);
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.image,
//         data: {
//             url: "https://plan-on.vercel.app/profile/slAeoXqXoae5x7UAWBUjZUULcnm2"
//             // url: payload?.data?.openUrl,// This should contain the URL you want to open
//         },
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener("notificationclick", function (event) {
//     const url = "https://plan-on.vercel.app/profile/slAeoXqXoae5x7UAWBUjZUULcnm2";
//     event.notification.close();
//     event.waitUntil(clients.openWindow(url));
// });