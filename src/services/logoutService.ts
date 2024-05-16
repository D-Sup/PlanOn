import { appAuth } from "../firebase/config";
import { signOut } from "firebase/auth";

const logoutService = async () => {
  signOut(appAuth).then(() => {
    localStorage.removeItem("localPersistedAuthUser");
    sessionStorage.removeItem("sessionPersistedAuthUser");
    console.log("로그아웃 했습니다.");
  }).catch((error) => {
    console.error("로그아웃에 실패했습니다.", error)
    throw error
  });
}

export default logoutService