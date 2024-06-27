import { useState } from "react";

import logoutService from "@/services/logoutService";

import { appAuth, appFireStore, timestamp } from "../firebase/config";
import { onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import generateKeywordCombinations from "@/utils/generateKeywordCombinations";

import { UsersType } from "@/types/users.type";

interface SignUpResponse {
  error: string | null,
	isPending: boolean;
	signUp: (signUpData: SignUpParams) => void;
	isSuccess: boolean
}

interface SignUpParams {
	accountEmail: string;
	accountPassword: string;
	accountName: string;
}

const useSignUp = (): SignUpResponse => {

  const [error, setError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	const signUp = async (signUpData: SignUpParams) => {
    setError(null);
    setIsPending(true);

		const {accountEmail, accountPassword, accountName } = signUpData;

		const createUser = async () => {
			try {
				const userCredential = await createUserWithEmailAndPassword(
					appAuth,
					accountEmail,
					accountPassword
				)
				console.log("회원가입에 성공했습니다", userCredential);
				return userCredential.user.uid;
			} catch (error) {
				setError("message" in error && error.message)
				console.error("회원가입에 실패했습니다:", error);
				throw error
			} finally {
				setIsPending(false)
			}
		}

		const createDocument = (uid: string) => {
			const newUserDocument: UsersType = {
				accountId: uid,
				accountEmail: accountEmail,
				accountName: accountName,
				accountImage: "",
				accountNameKeywords: generateKeywordCombinations(accountName),
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
			};

			const unsubscribe = onAuthStateChanged(appAuth, async (user) => {
				try {
					if (user) {
						const createdAt = timestamp.fromDate(new Date());
						const docRef = doc(appFireStore, "users", user.uid);
						await setDoc(docRef, {
							...newUserDocument,
							authorizationId: user.uid,
							createdAt
						});
						console.log("users 컬렉션에 문서를 생성했습니다", docRef);
						setIsSuccess(true)
						unsubscribe();
						logoutService()
					} else {
						console.error("토큰이 존재하지 않습니다");
					}
				} catch (error) {
					console.error("권한이 없거나 부족합니다:", error);
					throw error
				} 
			});
		};
		
		const uid = await createUser()
		uid && createDocument(uid)
	}

	return { error, isPending, signUp, isSuccess };
};

export default useSignUp;