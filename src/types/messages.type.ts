import { Timestamp } from "firebase/firestore";

export interface MessagesType {
  userId: string,
  isRead: boolean,
  id?: string,
  isLocal?: boolean
  text?: string,
  link?: LinkType
  photoURL?: string[],
  createdAt?: Timestamp,
}

export interface LinkType {
  url: string,
  title?: string,
  image?: string,
  description?: string
}