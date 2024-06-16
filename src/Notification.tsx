// import { useEffect } from "react";
// import { messaging } from "./firebase/config";
// import { getToken, onMessage } from "firebase/messaging";


// const Notification = () => {
//   useEffect(() => {
//     const requestPermission = async () => {
//       try {
//         const token = await getToken(messaging, { vapidKey: "BBgW5r7nb_OosMZ1ts-l7ZnQ0xIly3tAUUnu1-2l1Y_wBHqN8_4Np2oC2OtT6-lmzUb2pftZGs6191cMd4Ak4kU" });
//         if (token) {
//           console.log("Token generated:", token);
//           fetch("/save-token", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ token }),
//           });
//         } else {
//           console.log("No registration token available.");
//         }
//       } catch (err) {
//         console.error("Error getting token:", err);
//       }
//     };

//     requestPermission();
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log("Message received. ", payload);
//       // Customize notification display here
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   return <div>Notification Setup 🚀</div>;
// };

// export default Notification;



