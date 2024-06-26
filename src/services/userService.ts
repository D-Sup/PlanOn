import useDataQuery from "@/hooks/useDataQuery";
import useDataMutation from "@/hooks/useDataMutation";
import useFirestoreRead from "@/hooks/useFirestoreRead";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";

import { useSetRecoilState } from "recoil";
import { paginationValue } from "@/store";

import usePhotoUpload from "@/hooks/usePhotoUpload";

import { useRecoilValue } from "recoil";
import { inputValue } from "@/store";

import getAccountId from "@/utils/getAccountId";
import generateKeywordCombinations from "@/utils/generateKeywordCombinations";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType } from "@/types/users.type";

const UserService = () => {
  const SearchUser = () => {
    const inputValueState = useRecoilValue(inputValue);
    const { readDocumentQuery } = useFirestoreRead("users");
    const { data, isFetching, refetch } = useDataQuery<ReadDocumentType<UsersType>[], Error, ReadDocumentType<UsersType>[]>(
      "userSearch",
      () => readDocumentQuery<UsersType>("accountNameKeywords", "array-contains", inputValueState),
      (data) => data,
      {
        staleTime: 300000, 
        gcTime: 600000 
      },
      false
    )
    return { data, isFetching, refetch }
  }

  const ReadOtherUser = (id: string) => {
    const { readDocumentSingle } = useFirestoreRead("users")
    const { data, isLoading, refetch } = useDataQuery<ReadDocumentType<UsersType>, Error, ReadDocumentType<UsersType>>(
      "other-userInfo",
      ()=> readDocumentSingle<UsersType>(id),
      (data) => data,
      {
        staleTime: 300000,
        gcTime: 600000,
      },
      false
    )
    return { data, isLoading, refetch }
  }

  const ReadUser = () => {
    const { readDocumentSingle } = useFirestoreRead("users")
    const accountId = getAccountId()
    const { data, isLoading, isFetching, refetch } = useDataQuery<ReadDocumentType<UsersType>, Error, ReadDocumentType<UsersType>>(
      "my-userInfo",
      async () => {
        const readedUser = await readDocumentSingle<UsersType>(accountId);
        if (readedUser?.data.chats) {
          const chatsWithUserInfo = await Promise.all(
            readedUser.data.chats.map(async (chat) => {
              const userInfo = await readDocumentSingle<UsersType>(chat.userId);
              return {
                ...chat,
                userInfo: userInfo as ReadDocumentType<UsersType>,
              };
            })
          );
          return { ...readedUser, data: { ...readedUser.data, chats: chatsWithUserInfo } };
        }
      },
      (data) => data,
      {
        staleTime: Infinity,
        gcTime: Infinity,
      },
    )
    return { data, isLoading, isFetching, refetch }
  }

  const UpdateUser = (data: { isDefaultImage: boolean, accountImage: File[] | [], accountName: string, description: string }, onSuccess: () => void, onError: () => void) => {
    const { updateField } = useFirestoreUpdate("users")
    const { photoUpload } = usePhotoUpload()
    const accountId = getAccountId()
    const setPaginationValue = useSetRecoilState(paginationValue)
    const { mutate, isPending } = useDataMutation(
      ["my-userInfo", "all-posts", "following-posts", "like-posts", "tag-posts"],
      async() => {
        if (data.accountImage.length !== 0) {
          const uploadedPhoto = await photoUpload("users", data.accountImage)
          if (uploadedPhoto) {
            updateField(accountId, {
              accountImage: uploadedPhoto[0],
              accountName: data.accountName,
              description: data.description,
              accountNameKeywords: generateKeywordCombinations(data.accountName)
            })
          }
        } else {
          if (data.isDefaultImage) {
            updateField(accountId, {
              accountImage: "",
              accountName: data.accountName,
              description: data.description,
              accountNameKeywords: generateKeywordCombinations(data.accountName)
            })
          } else {
            updateField(accountId, {
              accountName: data.accountName,
              description: data.description,
              accountNameKeywords: generateKeywordCombinations(data.accountName)
            })
          }
        }
        setPaginationValue(Prev => ({...Prev, 
          posts : {
            lastVisible: null,
            isDataEnd: false
          }
        }))
      },
      onSuccess,
      onError
    )
  
    return { mutate, isPending }
  }
  
  return { SearchUser, ReadOtherUser, ReadUser, UpdateUser}
}

export default UserService