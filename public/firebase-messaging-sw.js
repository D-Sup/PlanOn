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
    measurementId: "G-BZZS5H0BCS"
};

firebase.initializeApp(firebaseConfig);

function checkLoginState() {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

checkLoginState().then(isLoggedIn => {
    if (isLoggedIn) {
        firebase.messaging();
        console.log("사용자가 로그인 상태입니다. FCM 초기화 완료.");
    } else {
        console.log("사용자가 로그아웃 상태입니다. FCM 초기화 생략.");
    }
});
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