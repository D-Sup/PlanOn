import useDataQuery from "@/hooks/useDataQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import useFirestoreRead from "@/hooks/useFirestoreRead";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";
import useModalStack from "@/hooks/useModalStack";

import notificationService from "./notificationService";

import getAccountId from "@/utils/getAccountId";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType } from "@/types/users.type";

export type UserMachinedType = ReadDocumentType<UsersType & { isFollow: boolean }>

const FollowService = () => {

  const ReadFollow = (users: string[]) => {
    const { readDocumentsSimplePaged } = useFirestoreRead("users")
    const { data, isLoading } = useDataQuery<UserMachinedType[], Error, UserMachinedType[]>(
      "follow-users",
      async ()=> {
        const readedUsers = await readDocumentsSimplePaged<UsersType>([], "authorizationId", "in", users, "accountName", "asc", true, Infinity)
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
    const { createFieldObject, createFieldArray } = useFirestoreCreate("users");
    const { deleteFieldArray } = useFirestoreDelete("users");
    const queryClient = useQueryClient();

    const queryKeys = [ "my-userInfo", "other-userInfo", "follow-users"];
  
    return useMutation({
      mutationFn: async (request: {type: "create" | "delete", id: string | undefined, deviceToken?: string, userData?: UsersType, authorizationId?: string }) => { 
        if (request.type === "create" && request.id) {
          await Promise.all([
            createFieldArray(request.id, "followers", accountId),
            createFieldArray(accountId, "followings", request.id)
          ])
          if (request.userData && accountId !== request.authorizationId) {
              createFieldObject(
              request.authorizationId,
              "notificationHistory",
              {
                type: "follow",
                notificationUrl: accountId,
                id: uuidv4(),
                icon: request.userData.accountImage,
                title: `${request.userData.accountName}님이 회원님을 팔로우 했습니다.`,
                body: "",
                createdAt: new Date(),
              }
            )
            notificationService(
              request.deviceToken,
              `profile/${accountId}`,
              `${request.userData.accountName}님이 회원님을 팔로우 했습니다.`,
              "",
              `${request.userData.accountImage}`
            )
          }
        } else if (request.type === "delete" && request.id) {
          await Promise.all([
            deleteFieldArray(request.id, "followers", accountId),
            deleteFieldArray(accountId, "followings", request.id)
          ])
        } 
      },
      onMutate: async (request: {type: "create" | "delete", id: string | undefined, deviceToken?: string, userData?: UsersType, authorizationId?: string  }) => {
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
      //   queryClient.invalidateQueries(["all-posts", "following-posts", "like-posts", "tag-posts", "other-posts", "my-posts"]);
      // },
    });
  }
  
  return { ReadFollow, UpdateFollow }
};

export default FollowService;
