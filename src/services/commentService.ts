import useDataQuery from "@/hooks/useDataQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFirestoreRead from "@/hooks/useFirestoreRead";
import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";
import useModalStack from "@/hooks/useModalStack";

import { produce } from "immer";

import { PostMachinedType } from "./postService";
import { UsersType } from "@/types/users.type";
import { CommentsType } from "@/types/posts.type";

export type CommentMachinedType = CommentsType & {userInfo: UsersType};

const CommentService = () => {

  const ReadComment = (comments: CommentsType[]) => {

    const { readDocumentSingle } = useFirestoreRead("users");

    const { data, isLoading, refetch } = useDataQuery<CommentMachinedType[], Error, CommentMachinedType[]>(
      "comments",
      async () => {
        const updatedComments = await Promise.all(comments.map(async (comment) => {
          const user = await readDocumentSingle<UsersType>(comment.userId as string);
          return {
            ...comment,
            userInfo: user?.data
          };
        }));
        return updatedComments.slice().reverse();
      }, 
      (data) => data,
      {
        staleTime: 300000, 
        gcTime: 600000 
      }
    );

    return { data, isLoading, refetch };
  };

  const UpdateComment = () => {
    const { createFieldObject } = useFirestoreCreate("posts")
    const { deleteFieldObject } = useFirestoreDelete("posts")
    const { openModal } = useModalStack();

    const queryClient = useQueryClient();
    const queryKeys = ["all-posts", "following-posts", "single-posts"];

    return useMutation({
      mutationFn: async (request: { type: "create" | "delete", id: string, comment: CommentsType | CommentMachinedType }) => {
        if (request.type === "create") {
          await createFieldObject(request.id, "comments", request.comment);
        } else if (request.type === "delete") {
          await deleteFieldObject(request.id, "comments", {id : request.comment.id});
        }
      },
      onMutate: async (request: { type: "create" | "delete", id: string, comment: CommentsType | CommentMachinedType } ) => {
        queryKeys.forEach(async (key) => {
          await queryClient.cancelQueries({ queryKey: [key] });
        });
      
        const oldPostsData = queryKeys.map((key) => queryClient.getQueryData<PostMachinedType[] | PostMachinedType>([key]));
      
        queryKeys.forEach((key) => {
          queryClient.setQueryData([key], (data: PostMachinedType[] | PostMachinedType | undefined) => {
            if (!data) return [];
            
            if (Array.isArray(data)) {
              return data.map((post: PostMachinedType) =>
                produce(post, (draft: PostMachinedType) => {
                  if (draft.id === request.id) {
                    const commentId = request.comment?.id;
                    if (commentId) {
                      if (request.type === "create") {
                        draft.data.comments = [...draft.data.comments, request.comment];
                      } else {
                        draft.data.comments = draft.data.comments.filter((comment: CommentsType | CommentMachinedType) => comment.id !== commentId);
                      }
                    }
                  }
                })
              )
            } else {
              return produce(data, (draft: PostMachinedType) => {
                if (draft.id === request.id) {
                  const commentId = request.comment?.id;
                  if (commentId) {
                    if (request.type === "create") {
                      draft.data.comments = [...draft.data.comments, request.comment];
                    } else {
                      draft.data.comments = draft.data.comments.filter((comment: CommentsType | CommentMachinedType) => comment.id !== commentId);
                    }
                  }
                }
              });
            }
          });
        });
      
        return { oldPostsData };
      },
      onSuccess: async (_, request) => {
        if (request.type === "delete") {
          setTimeout(()=> openModal("Toast", { message: "댓글이 삭제되었습니다." }), 400)
        }
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
      //   queryClient.invalidateQueries(["all-posts", "following-posts", "other-posts", "my-posts"]);
      // },
    });
  }
  
  return { ReadComment, UpdateComment };
};

export default CommentService;
