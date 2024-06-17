import { useState } from "react";
import useFirestoreRead from "./useFirestoreRead";
import { useSetRecoilState } from "recoil";
import { authUser } from "@/store";

import { doc, setDoc } from "firebase/firestore";
import { appAuth, auth, timestamp, appFireStore } from "../firebase/config";
import { signInWithEmailAndPassword, AuthError, UserCredential, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

import logoutService from "@/services/logoutService";
import generateKeywordCombinations from "@/utils/generateKeywordCombinations";

import { UsersType } from "@/types/users.type";

interface LoginResponse {
  error: string | null,
  isLoginSuccess: boolean,
  isSignupSuccess: boolean,
  isPending: boolean,
  login: (loginFormData: LoginParams) => void
  googleLogin: () => void
  gitHubLogin: () => void
}

interface LoginParams {
  email: string;
  password: string;
}

const useLogin = (isChecked: boolean): LoginResponse => {

  const setAuthUserState = useSetRecoilState(authUser);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
	const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);
	const [isSignupSuccess, setIsSignupSuccess] = useState<boolean>(false);

  const { readDocumentSingle } = useFirestoreRead("users");

  const snsLogin = (provider : GoogleAuthProvider) => {
    signInWithPopup(auth, provider) 
      .then(async (data) => {
      const user = data.user;
      
      if (user) {
        const response = await readDocumentSingle<UsersType>(user.uid); 
        if (response.data) {
          if (response && "data" in response) { 
            const { accountId } = response.data;
            setIsLoginSuccess(true)
            setTimeout(() => setAuthUserState({accountId}), 100)
            console.log("로그인을 성공하였습니다.", data.user);
          } else {
            throw new Error("응답에 문제가 있습니다.");
          }
        } else {
          try {
            if (user) {
              const createdAt = timestamp.fromDate(new Date());
              const docRef = doc(appFireStore, "users", user.uid);
              const newUserDocument = {
                accountId: user.uid,
                accountEmail: user.email,
                accountName: user.displayName,
                accountImage: "",
                accountNameKeywords: generateKeywordCombinations(user.displayName),
                description: "",
                followers: [],
                followings: [],
                searchHistory: [],
                chats: [],
                isDarkMode: true,
                isAlert: false,
                isFirstEntry: true,
                secureNumber: "",
                selectedFilter: "all-posts",
                filterTags: [],
                selectedFont: "프리텐다드체",
                deviceToken: "",
                notificationHistory: []
              }    
              await setDoc(docRef, {
                ...newUserDocument,
                authorizationId: user.uid,
                createdAt
              });
              setIsSignupSuccess(true)
              console.log("users 컬렉션에 문서를 생성했습니다", docRef);
              logoutService()
            } else {
              console.error("토큰이 존재하지 않습니다");
            }
          } catch (error) {
            console.error("권한이 없거나 부족합니다:", error);
            throw error
            
          }
        }
      } else {
        throw new Error("로그인에 실패했습니다.");
      }
      })
      .catch((err) => {
        console.log(err);
    });
  }

  const googleLogin = () => {
    const provider = new GoogleAuthProvider(); 
    snsLogin(provider)
  }

  const gitHubLogin = () => {
    const provider = new GithubAuthProvider();
    snsLogin(provider)
  }

  const login = (loginFormData: LoginParams) => {
    setError(null);
    setIsPending(true);

    signInWithEmailAndPassword(appAuth, loginFormData.email, loginFormData.password)
      .then(async (userCredential: UserCredential) => { 
        const user = userCredential.user;
        setIsLoginSuccess(true)
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
        if (isChecked) {
          setTimeout(()=> localStorage.removeItem("localPersistedAuthUser"), 1000)
        } else {
          setTimeout(()=> sessionStorage.removeItem("sessionPersistedAuthUser"), 1000)
        }
        setIsPending(false);
      });
  };

  return { error, isLoginSuccess, isSignupSuccess, isPending, login, googleLogin, gitHubLogin };
};


export default useLogin;