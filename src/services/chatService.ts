import useDataQuery from "@/hooks/useDataQuery";
import useFirestoreRead from "@/hooks/useFirestoreRead";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { MessagesType } from "@/types/messages.type";
import { UsersType } from "@/types/users.type";

const ChatService = () => {

  const ReadPhoto = (id: string) => {
    const { readSubCollection } = useFirestoreRead("chats")
    const { data, isLoading, refetch } = useDataQuery<ReadDocumentType<MessagesType>[], Error, ReadDocumentType<MessagesType>[]>(
      "collection-photo",
      ()=> readSubCollection<UsersType>("messages", `message-${id}`, "photoURL", "!=", null),
      (data) => data,
      {
        staleTime: 300000, 
        gcTime: 600000 
      }
    )
    return { data, isLoading, refetch }
  }

  const ReadLink = (id: string) => {
    const { readSubCollection } = useFirestoreRead("chats")
    const { data, isLoading, refetch } = useDataQuery<ReadDocumentType<MessagesType>[], Error, ReadDocumentType<MessagesType>[]>(
      "collection-link",
      ()=> readSubCollection<UsersType>("messages", `message-${id}`, "link", "!=", null),
      (data) => data,
      {
        staleTime: 300000, 
        gcTime: 600000 
      }
    )
    return { data, isLoading, refetch }
  }
  
  return { ReadPhoto, ReadLink }
}

export default ChatService