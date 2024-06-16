import { getToken } from "firebase/messaging";
import { messaging } from "@/firebase/config";

import useModalStack from "@/hooks/useModalStack";

import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import getAccountId from "./getAccountId";

const NotificationPermission = async () => {

  const accountId = getAccountId()

  const { openModal } = useModalStack()
  const { updateField } = useFirestoreUpdate("users")
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
    });
    openModal("Toast", {message: "알림을 활성하였습니다."})
    updateField(accountId, { deviceToken: token})
  } else if (permission === "denied") {
    openModal("Toast", {message: "알림을 비활성화하였습니다."})
    updateField(accountId, { deviceToken: "" })
  }
}

export default NotificationPermission;

// export function registerServiceWorker() {
//   navigator.serviceWorker
//     .register("firebase-messaging-sw.js")
//     .then(function (registration) {
//       console.log("Service Worker 등록 성공:", registration);
//     })
//     .catch(function (error) {
//       console.log("Service Worker 등록 실패:", error);
//     });
// }

// import { getToken } from "firebase/messaging";
// import { sendTokenToServer } from "./api";
// import { messaging } from "@/firebase/config";
// // import { registerServiceWorker } from "./registerServiceWorker";

// export async function handleAllowNotification() {
//     registerServiceWorker(); // 나중에 설명
//     try {
//         const permission = await Notification.requestPermission();

//         if (permission === "granted") {
//             const token = await getToken(messaging, {
//                 vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
//             });
//             if (token) {
//                 sendTokenToServer(token);// (토큰을 서버로 전송하는 로직)
//             } else {
//                 alert(
//                     "토큰 등록이 불가능 합니다. 생성하려면 권한을 허용해주세요"
//                 );
//             }
//         } else if (permission === "denied") {
//             alert(
//                 "web push 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요"
//             );
//         }
//     } catch (error) {
//         console.error("푸시 토큰 가져오는 중에 에러 발생", error);
//     }
// }