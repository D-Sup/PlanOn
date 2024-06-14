import { atom } from "recoil";
import { DocumentData } from "firebase/firestore";

interface PaginationValueType {
  currentCategory: "all-posts" | "following-posts" | "like-posts" | "tag-posts",
  allPosts : {
    lastVisible: DocumentData | null,
    isDataEnd: boolean
  }
  followingPosts: {
    lastVisible: DocumentData | null,
    isDataEnd: boolean
  }
  likePosts: {
    lastVisible: DocumentData | null,
    isDataEnd: boolean
  },
  tagPosts: {
    lastVisible: DocumentData | null,
    isDataEnd: boolean,
  }
}

export const paginationValueDefault: PaginationValueType = {
  currentCategory: "all-posts",
  allPosts : {
    lastVisible: null,
    isDataEnd: false
  },
  followingPosts: {
    lastVisible: null,
    isDataEnd: false
  },
  likePosts: {
    lastVisible: null,
    isDataEnd: false
  },
  tagPosts: {
    lastVisible: null,
    isDataEnd: false,
  }
};

export const paginationValue = atom<PaginationValueType>({
  key: "paginationValue",
  default: paginationValueDefault,
});