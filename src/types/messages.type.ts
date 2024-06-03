import { Timestamp } from "firebase/firestore";

export interface MessagesType {
  id: string,
  userId: string,
  text: string,
  photoURL: string[],
  isRead: boolean,
  createdAt: Timestamp,
  isLocal: boolean
}