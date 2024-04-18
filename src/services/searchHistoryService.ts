import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";
import useModalStack from "@/hooks/useModalStack";

import getAccountId from "@/utils/getAccountId";
import { produce } from "immer";

import { SearchHistoryType } from "@/types/users.type";
import { UsersType } from "@/types/users.type";

const SearchHistoryService = () => {

  const queryClient = useQueryClient();

  const { createFieldObject } = useFirestoreCreate("users")
  const { deleteFieldObject } = useFirestoreDelete("users")
  const { openModal } = useModalStack();

  const accountId = getAccountId()

  return useMutation({
    mutationFn: async (request: { type: "create" | "delete", searchHistory: SearchHistoryType }) => {
      if (request.type === "create") {
        await createFieldObject(accountId, "searchHistory", request.searchHistory);
      } else if (request.type === "delete") {
        await deleteFieldObject(accountId, "searchHistory", {id : request.searchHistory.id});
      }
    },
    onMutate: async (request: { type: "create" | "delete", searchHistory: SearchHistoryType }) => {
      await queryClient.cancelQueries({ queryKey: ["my-userInfo"] });
    
      const oldPostsData = queryClient.getQueryData<ReadDocumentType<UsersType>>(["my-userInfo"])

        queryClient.setQueryData(["my-userInfo"], (data: ReadDocumentType<UsersType>) => {
          if (!data) return [];
          return produce(data, (draft: ReadDocumentType<UsersType>) => {
            if (request.type === "create") {
              draft.data.searchHistory = [...draft.data.searchHistory, request.searchHistory];
            } else {
              draft.data.searchHistory = draft.data.searchHistory.filter((history: SearchHistoryType) => history.id !== request.searchHistory.id);
            }
        });
      });
    
      return { oldPostsData };
    },
    onError: (error: Error, _, context: { oldPostsData?: ReadDocumentType<UsersType> } | undefined) => {
      if (context?.oldPostsData) {
        openModal("Toast", { type: "fail", message: "새로고침 후 시도해주세요." });
        queryClient.setQueryData(["my-userInfo"], context.oldPostsData);
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

export default SearchHistoryService