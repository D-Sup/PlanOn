import useDataQuery from "@/hooks/useDataQuery";
import useFirestoreRead from "@/hooks/useFirestoreRead";

import { useRecoilValue } from "recoil";
import { inputValue } from "@/store";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { HashtagsType } from "@/types/hashtags.type";

const HashtagService = () => {
  const SearchHashTag = () => {
    const inputValueState = useRecoilValue(inputValue);
    const { readDocumentQuery } = useFirestoreRead("hashtags");
    const { data, isFetching, refetch } = useDataQuery<ReadDocumentType<HashtagsType>[], Error, ReadDocumentType<HashtagsType>[]>(
      "hashtagSearch",
      ()=> readDocumentQuery<HashtagsType>("tagKeywords", "array-contains", inputValueState),
      (data) => data,
      {
        staleTime: 300000, 
        gcTime: 600000 
      },
      false
    )
    return { data, isFetching, refetch }
  }
  
  return { SearchHashTag }
}

export default HashtagService