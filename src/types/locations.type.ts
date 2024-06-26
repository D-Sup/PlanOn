import { Timestamp } from "firebase/firestore";

export interface LocationsType {
  authorizationId?: string,
  createdAt?: Timestamp,
  tagKeywords?: string[],
  taggedPostIds?: string[],
}