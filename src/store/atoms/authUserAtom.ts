import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

import getStorageData from "@/utils/getStorageData";

const { isSaved } = getStorageData("persistedIsLoginPersist", ["isLoginPersistValue"], "sessionStorage") || ""

const storage = typeof window !== "undefined"
? isSaved 
? window.localStorage
  : window.sessionStorage
: undefined;

const { persistAtom } = recoilPersist({
  key: "persistedAuthUser",
  storage: storage,
});

interface AuthUser {
  accountId: string;
}

export const authUser = atom<AuthUser>({
  key: "authUser",
  default: {
    accountId: "",
  },
  effects_UNSTABLE: [persistAtom],
});
