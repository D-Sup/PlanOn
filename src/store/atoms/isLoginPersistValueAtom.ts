import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const sessionStorage = typeof window !== "undefined" ? window.sessionStorage : undefined

const { persistAtom } = recoilPersist(
  {
    key: "persistedIsLoginPersist",
    storage: sessionStorage,
  }
);

export const isLoginPersistValue = atom<{isSaved: boolean}>({
  key: "isLoginPersistValue",
  default: {isSaved: false},
  effects_UNSTABLE: [persistAtom],
});