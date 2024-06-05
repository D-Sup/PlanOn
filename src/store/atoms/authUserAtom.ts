import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const sessionStorage = typeof window !== "undefined" ? window.sessionStorage : undefined;
const localStorage = typeof window !== "undefined" ? window.localStorage : undefined;

const { persistAtom: sessionPersistAtom } = recoilPersist({
  key: "sessionPersistedAuthUser",
  storage: sessionStorage,
});

const { persistAtom: localPersistAtom } = recoilPersist({
  key: "localPersistedAuthUser",
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
  effects_UNSTABLE: [sessionPersistAtom, localPersistAtom],
});
