import { useState } from "react";
import useFirestoreRead from "./useFirestoreRead";
import { useSetRecoilState } from "recoil";
import { authUser } from "@/store";

import { appAuth } from "../firebase/config";
import { signInWithEmailAndPassword, AuthError, UserCredential } from "firebase/auth";

import { UsersType } from "@/types/users.type";

interface LoginResponse {
  error: string | null,
  isSuccess: boolean,
  isPending: boolean,
  login: (loginFormData: LoginParams) => void
}

interface LoginParams {
  email: string;
  password: string;
}

const useLogin = (): LoginResponse => {

  const setAuthUserState = useSetRecoilState(authUser);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { readDocumentSingle } = useFirestoreRead("users");

  const login = (loginFormData: LoginParams) => {
    setError(null);
    setIsPending(true);

    signInWithEmailAndPassword(appAuth, loginFormData.email, loginFormData.password)
      .then(async (userCredential: UserCredential) => { 
        const user = userCredential.user;
        setIsSuccess(true)
        console.log("로그인을 성공하였습니다.", user);

        if (user) {
          const response = await readDocumentSingle<UsersType>(user.uid); 
          if (response && "data" in response) { 
            const { accountId } = response.data;
            setAuthUserState({accountId});
          } else {
            throw new Error("응답에 문제가 있습니다.");
          }
        } else {
          throw new Error("로그인에 실패했습니다.");
        }
      })
      .catch((e: AuthError) => {
        setError(e.message);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return { error, isSuccess, isPending, login };
};


export default useLogin;