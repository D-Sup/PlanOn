import { Timestamp } from "firebase/firestore";

export interface MessagesType {
  userId: string,
  isRead: boolean,
  id?: string,
  isLocal?: boolean
  text?: string,
  photoURL?: string[],
  createdAt?: Timestamp,
}