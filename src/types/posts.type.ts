import { Timestamp } from "firebase/firestore";

export interface PostsType {
  authorizationId: string,
  private: boolean,
  createdAt: Timestamp,
  images: string[],
  content: string,
  likedUsers: string[],
  comments: CommentsType[],
  hashtags: string[],
  usertags: string[]
  scheduleId: string
}

export interface CommentsType {
  id: string,
  content?: string,
  createdAt?: Timestamp | Date,
  likedUsers: string[],
  userId?: string
}