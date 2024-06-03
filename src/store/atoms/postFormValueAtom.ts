import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType } from "@/types/users.type";
import { HashtagsType } from "@/types/hashtags.type";

const sessionStorage = typeof window !== "undefined" ? window.sessionStorage : undefined

const { persistAtom } = recoilPersist(
  {
    key: "persistedPostFormValue",
    storage: sessionStorage,
  }
);

interface PhotosType {
  checked: number[],
  file: File[],
  preview: string[],
}

export interface PostFormValueType {
  photos: PhotosType,
  scheduleId: string,
  private: boolean,
  hashtags: ReadDocumentType<HashtagsType>[],
  usertags: ReadDocumentType<UsersType>[],
  content: string
}

export const postFormValueDefault = {
  photos: {checked:[], file:[], preview:[]},
  scheduleId: "",
  private: false,
  hashtags: [],
  usertags: [],
  content: ""
};

export const postFormValue = atom<PostFormValueType>({
  key: "postFormValue",
  default: postFormValueDefault,
  effects_UNSTABLE: [persistAtom],
});