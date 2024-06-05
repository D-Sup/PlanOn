import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const localStorage = typeof window !== "undefined" ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "persistedAuthUser",
  storage: localStorage,
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
