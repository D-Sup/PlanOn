import { getToken } from "firebase/messaging";
import { messaging } from "@/firebase/config";

import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import getAccountId from "./getAccountId";

const NotificationPermission = (isUpdateToken? : boolean) => {
  const accountId = getAccountId();
  const { updateField } = useFirestoreUpdate("users");

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_VAPID_KEY,
        });
        updateField(accountId, { deviceToken: token, isAlert: true });
      } else if (permission === "denied" && !isUpdateToken) {
        updateField(accountId, { deviceToken: "off", isAlert: false });
      }
    } catch (error) {
      console.error("알림 권한 요청 중 오류 발생:", error);
    }
  };

  return { requestPermission }
}

export default NotificationPermission;