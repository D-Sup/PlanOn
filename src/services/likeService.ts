import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";
import useModalStack from "@/hooks/useModalStack"

import notificationService from "./notificationService";
import getAccountId from "@/utils/getAccountId";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";

import { PostMachinedType } from "./postService";
import { CommentsType } from "@/types/posts.type";
import { UsersType } from "@/types/users.type";

const LikeService = () => {
  const accountId = getAccountId()
  const { openModal } = useModalStack();
  const { createFieldObject } = useFirestoreCreate("users");
  const { createFieldArray } = useFirestoreCreate("posts");
  const { deleteFieldArray } = useFirestoreDelete("posts");
  const { updateFieldObject } = useFirestoreUpdate("posts");
  const queryClient = useQueryClient();

  const queryKeys = ["all-posts", "following-posts", "like-posts", "tag-posts", "single-posts"];

  return useMutation({
    mutationFn: async (request: { target: "post" | "comment", type: "create" | "delete" | "update", id: string, comment?: CommentsType, deviceToken?: string, userData?: UsersType, authorizationId?: string }) => {
      if (request.target === "post" && request.type === "create") {
        await createFieldArray(request.id, "likedUsers", accountId);
        if (accountId !== request.authorizationId) {
          createFieldObject(
            request.authorizationId,
            "notificationHistory",
            {
              type: "like",
              notificationUrl: request.id,
              id: uuidv4(),
              icon: request.userData.accountImage,
              title: `${request.userData.accountName}님이 회원님 게시물에 좋아요를 눌렀습니다.`,
              body: "",
              createdAt: new Date(),
            }
          )
          notificationService(
            request.deviceToken,
            `post/detail/writable/${request.id}`,
            `${request.userData.accountName}님이 회원님 게시물에 좋아요를 눌렀습니다.`,
            "",
            `${request.userData.accountImage}`
          )
        }
      } else if (request.target === "post" && request.type === "delete") {
        await deleteFieldArray(request.id, "likedUsers", accountId);
      } else if (request.target === "comment" &&  request.type === "update" && request.comment) {
        await updateFieldObject(request.id, "comments", {id: request.comment.id}, request.comment)
      }
    },
    onMutate: async (request: { target: "post" | "comment", type: "create" | "delete" | "update", id: string, comment?: CommentsType, deviceToken?: string, userData?: UsersType, authorizationId?: string}) => {

      queryKeys.forEach(async (key) => {
        await queryClient.cancelQueries({ queryKey : [key] });
      });
    
      const oldPostsData = queryKeys.map((key) => queryClient.getQueryData<PostMachinedType[] | PostMachinedType>([key]));
    
      queryKeys.forEach((key, index) => {
        const currentOldPostsData = oldPostsData[index];
        if (Array.isArray(currentOldPostsData)) {
          queryClient.setQueryData([key], (data: PostMachinedType[] | undefined) => {
            if (!data) return [];
            return data.map((post: PostMachinedType) =>
              produce(post, (draft) => {
                if (draft.id === request.id) {
                  if (request.target === "post") {
                    if (draft.data.likedUsers.includes(accountId)) {
                      draft.data.likedUsers = draft.data.likedUsers.filter((id: string) => id !== accountId)
                    } else {
                      draft.data.likedUsers = [...draft.data.likedUsers, accountId];
                    }
                  } else {
                    const commentId = request.comment?.id;
                    if (commentId) {
                      const commentIndex = draft.data.comments.findIndex(comment => comment.id === commentId);
                      if (commentIndex !== -1) {
                        const likedUsers = draft.data.comments[commentIndex].likedUsers;
                        if (likedUsers.includes(accountId)) {
                          draft.data.comments[commentIndex].likedUsers = likedUsers.filter((id: string) => id !== accountId)
                        } else {
                          draft.data.comments[commentIndex].likedUsers = [...likedUsers, accountId];
                        }
                      }
                    }
                  }
                }
              })
            );
          });
        } else if (currentOldPostsData) {
          queryClient.setQueryData([key], (data: PostMachinedType | undefined) => {
            if (!data) return undefined;
            return produce(data, (draft: PostMachinedType) => {
              if (draft.id === request.id) {
                if (request.target === "post") {
                  if (draft.data.likedUsers.includes(accountId)) {
                    draft.data.likedUsers = draft.data.likedUsers.filter((id: string) => id !== accountId)
                  } else {
                    draft.data.likedUsers = [...draft.data.likedUsers, accountId];
                  }
                } else {
                  const commentId = request.comment?.id;
                  if (commentId) {
                    const commentIndex = draft.data.comments.findIndex(comment => comment.id === commentId);
                    if (commentIndex !== -1) {
                      const likedUsers = draft.data.comments[commentIndex].likedUsers;
                      if (likedUsers.includes(accountId)) {
                        draft.data.comments[commentIndex].likedUsers = likedUsers.filter((id: string) => id !== accountId)
                      } else {
                        draft.data.comments[commentIndex].likedUsers = [...likedUsers, accountId];
                      }
                    }
                  }
                }
              }
            });
          });
        }
      });
    
      return { oldPostsData };
    },
    onError: (error: Error, _, context: { oldPostsData?: (PostMachinedType[] | PostMachinedType | undefined)[] } | undefined) => {
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
};

export default LikeService;
