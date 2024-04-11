import { atom } from "recoil";
import { DocumentData } from "firebase/firestore";

interface PaginationValueType {
  currentCategory: "all-posts" | "following-posts" | "like-posts" | "tag-posts" | "",
  posts : {
    lastVisible: DocumentData | null,
    isDataEnd: boolean
  }
}

export const paginationValueDefault: PaginationValueType = {
  currentCategory: "",
  posts : {
    lastVisible: null,
    isDataEnd: false
  },
};

export const paginationValue = atom<PaginationValueType>({
  key: "paginationValue",
  default: paginationValueDefault,
});