import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const sessionStorage = typeof window !== "undefined" ? window.sessionStorage : undefined

const {persistAtom} = recoilPersist({
  key: "persistedAuthUser",
  storage: sessionStorage,
})

interface AuthUser {
  accountId: string
}

export const authUser = atom<AuthUser>({
  key: "authUser",
  default: {
    accountId: ""
  },
  effects_UNSTABLE: [persistAtom],
});

