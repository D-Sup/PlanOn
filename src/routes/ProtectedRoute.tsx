import { Outlet } from "react-router";
import { useRecoilValue } from "recoil";
import { authUser } from "@/store";
import { useNavigate } from "react-router-dom";

export const NonLoginProtectedRoute = () => {
  const authUserState = useRecoilValue(authUser);
  const navigate = useNavigate()
  if (!authUserState.accountId) {
    return <Outlet />;
  } else {
    setTimeout(() => {
      navigate("/post", { state: { direction: "fade" } });
    }, 100)
    return null;
  }
};

export const LoginProtectedRoute = () => {
  const authUserState = useRecoilValue(authUser);
  const navigate = useNavigate()
  if (authUserState.accountId) {
    return <Outlet />;
  } else {
    setTimeout(() => {
      navigate("/login", { state: { direction: "fade" } });
    }, 100)
    return null;
  }
}
