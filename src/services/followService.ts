import useDataQuery from "@/hooks/useDataQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import useFirestoreRead from "@/hooks/useFirestoreRead";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";
import useModalStack from "@/hooks/useModalStack";

import getAccountId from "@/utils/getAccountId";
import { produce } from "immer";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType } from "@/types/users.type";

export type UserMachinedType = ReadDocumentType<UsersType & { isFollow: boolean }>

const FollowService = () => {

  const ReadFollow = (users: string[]) => {
    const { readDocumentsSimplePaged } = useFirestoreRead("users")
    const { data, isLoading } = useDataQuery<UserMachinedType[], Error, UserMachinedType[]>(
      "follow-users",
      async ()=> {
        const readedUsers = await readDocumentsSimplePaged<UsersType>([], "authorizationId", "in", users, "accountName", "asc", Infinity)
        if (readedUsers) {
          const updatedUser = readedUsers.map((readedUser) => {
            return {
              ...readedUser,
              isFollow: true
            }
          })
          return updatedUser;
        }
      },
      (data) => data,
      {
        staleTime: 0,
        gcTime: 0
      }
    )
    return { data, isLoading }
  }

  const UpdateFollow = () => {
    const accountId = getAccountId()
    const { openModal } = useModalStack();
    const { createFieldArray } = useFirestoreCreate("users");
    const { deleteFieldArray } = useFirestoreDelete("users");
    const queryClient = useQueryClient();

    const queryKeys = [ "my-userInfo", "other-userInfo", "follow-users"];
  
    return useMutation({
      mutationFn: async (request: {type: "create" | "delete", id: string | undefined }) => {
        // if (request.target === "followings" && request.type === "create" && request.id) {
        //   await Promise.all([
        //     createFieldArray(accountId, "followers", request.id),
        //     createFieldArray(request.id, "followings", accountId)
        //   ])
        // } else if (request.target === "followings" && request.type === "delete" && request.id) {
        //   await Promise.all([
        //     deleteFieldArray(accountId, "followers", request.id),
        //     deleteFieldArray(request.id, "followings", accountId)
        //   ])
        // } else if (request.target === "followers" && request.type === "create" && request.id) {
        //   await Promise.all([
        //     createFieldArray(request.id, "followers", accountId),
        //     createFieldArray(accountId, "followings", request.id)
        //   ])
        // } else if (request.target === "followers" && request.type === "delete" && request.id) {
        //   await Promise.all([
        //     createFieldArray(request.id, "followers", accountId),
        //     createFieldArray(accountId, "followings", request.id)
        //   ])
        // } 
        if (request.type === "create" && request.id) {
          await Promise.all([
            createFieldArray(request.id, "followers", accountId),
            createFieldArray(accountId, "followings", request.id)
          ])
        } else if (request.type === "delete" && request.id) {
          await Promise.all([
            deleteFieldArray(request.id, "followers", accountId),
            deleteFieldArray(accountId, "followings", request.id)
          ])
        } 
      },
      onMutate: async (request: {type: "create" | "delete", id: string | undefined }) => {
        queryKeys.forEach(async (key) => {
          await queryClient.cancelQueries({ queryKey: [key] });
        });
  
        const oldPostsData = queryKeys.map((key) => queryClient.getQueryData<UserMachinedType[] | ReadDocumentType<UsersType>>([key]));

        queryKeys.forEach((key, index) => {
          const currentOldPostsData = oldPostsData[index];
          if (Array.isArray(currentOldPostsData)) {
            queryClient.setQueryData([key], (data:UserMachinedType[] | undefined) => {
              if (!data) return [];
                return data.map((singleData:UserMachinedType) => (
                  produce(singleData, (draft) => {
                    if (singleData.id === request.id) {
                      if (request.type === "create") {
                        draft.data.isFollow = false
                      } else {
                        draft.data.isFollow = true
                      }
                    }
                  })
              ))
            });
          } else {
            queryClient.setQueryData([key], (data: ReadDocumentType<UsersType> | undefined) => {
              if (!data) return [];
                return produce(data, (draft: ReadDocumentType<UsersType>) => {
                  if (request.id && key === "my-userInfo") {
                    draft.data.followings = request.type === "create" 
                    ? [...draft.data.followings, request.id]
                    : draft.data.followings.filter((id: string) => id !== request.id)
                  } else if (key === "other-userInfo") {
                    draft.data.followers = request.type === "create" 
                    ? [...draft.data.followers, accountId]
                    : draft.data.followers.filter((id: string) => id !== accountId)
                  }
                })
            });
          }
        })

        return { oldPostsData };
      },
      onError: (error: Error, _, context: { oldPostsData?: (UserMachinedType[] | ReadDocumentType<UsersType> | undefined)[] } | undefined) => {
        if (context?.oldPostsData) {
          openModal("Toast", { type: "fail", message: "새로고침 후 시도해주세요." });
            queryKeys.forEach((key) => {
              queryClient.setQueryData([key], context.oldPostsData);
            });
        } else {
          openModal("Toast", { type: "fail", message: "새로고침 후 시도해주세요." });
          console.error(error);
          throw error;
        }
      },
      // onSettled: () => {
      //   queryClient.invalidateQueries(["all-posts", "following-posts", "like-posts", "other-posts", "my-posts"]);
      // },
    });
  }
  
  return { ReadFollow, UpdateFollow }
};

export default FollowService;
