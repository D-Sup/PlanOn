import { Timestamp } from "firebase/firestore";

export interface HashtagsType {
  authorizationId?: string,
  createdAt?: Timestamp,
  tagKeywords?: string[],
  taggedPostIds?: string[],
}