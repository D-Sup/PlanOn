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
  secureNumber: string,
  selectedFilter: "all-posts" | "following-posts" | "like-posts" | "tag-posts",
  filterTags: string[],
  selectedFont: string,
  deviceToken: string
  notificationHistory: NotificationHistoryType[]
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

export interface NotificationHistoryType {
  type: "post" | "like" | "comment" | "follow",
  notificationUrl: string,
  id: string,
  icon: string,
  title: string,
  body: string,
  createdAt: Timestamp,
}

