import useFirestoreRead from "@/hooks/useFirestoreRead";
import { useRecoilValue } from "recoil";
import { inputValue } from "@/store";

import useDataQuery from "@/hooks/useDataQuery";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { SchedulesType } from "@/types/schedules.type";

const LocationService = () => {
  const SearchLocation = () => {
    const inputValueState = useRecoilValue(inputValue);

    const queryFn = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SEARCH_PLACES_API_URL}?request=textsearch&keyword=${inputValueState}`,
          {
            method: "GET",
          }
        )
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const { data, isFetching, refetch } = useDataQuery<any, Error, any>(
      "locationSearch",
      () => queryFn(),
      (data) => data,
      {
        staleTime: 300000, 
        gcTime: 600000 
      },
      false
    )
    
    return { data, isFetching, refetch }
  }

  const SearchPostLocation = () => {
    const inputValueState = useRecoilValue(inputValue);
    const { readDocumentQuery } = useFirestoreRead("schedules");
    const { data, isFetching, refetch } = useDataQuery<ReadDocumentType<SchedulesType>[], Error, ReadDocumentType<SchedulesType>[]>(
      "locationPostSearch",
      () => readDocumentQuery<SchedulesType>("locationKeywords", "array-contains", inputValueState),
      (data) => data,
      {
        staleTime: 300000, 
        gcTime: 600000 
      },
      false
    )
    
    return { data, isFetching, refetch }
  }
  
  return { SearchLocation, SearchPostLocation }
}

export default LocationService