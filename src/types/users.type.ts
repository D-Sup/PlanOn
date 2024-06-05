import { ReadDocumentType } from "@/hooks/useFirestoreRead"
import { Timestamp } from "firebase/firestore"

export interface UsersType {
  authorizationId?: string,
  accountId: string,
  accountName: string,
  accountEmail: string,
  accountImage: string,
  accountNameKeywords?: string[],
  description: string,
  followers: string[],
  followings: string[],
  searchHistory: SearchHistoryType[]
  chats: ChatsType[],
  isDarkMode: boolean,
  isAlert: boolean,
  isFirstEntry: boolean,
  secureNumber: string
  // postIds: string[],
  // scheduleIds: string[]
}

export interface SearchHistoryType {
  id: string,
  type: "usertag" | "location" | "hashtag",
  title: string,
  createdAt: Timestamp | Date,
}

export interface ChatsType {
  id: string,
  userId: string,
  userName: string,
  userInfo: ReadDocumentType<UsersType>,
  lastReceive: string,
  lastMessageCreatedAt: Timestamp,
  unreadLength: number,
  isLocal: boolean
}

