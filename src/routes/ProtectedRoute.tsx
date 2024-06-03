import { Navigate, Outlet } from "react-router";
import { useRecoilValue } from "recoil";
import { authUser } from "@/store";

export const NonLoginProtectedRoute = () => {
  const authUserState = useRecoilValue(authUser);
  return !authUserState.accountId ? (
    <Outlet />
  ) : (
    <Navigate
      to={"/post"}
      replace
    />
  );
};

export const LoginProtectedRoute = () => {
  const authUserState = useRecoilValue(authUser);
  return authUserState.accountId ? (
    <Outlet />
  ) : (
    <Navigate
      to={"/login"}
      replace
    />
  );
}
