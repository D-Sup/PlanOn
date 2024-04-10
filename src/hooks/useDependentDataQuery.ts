import { useQueries, QueryCache } from "@tanstack/react-query";

import useDataQuery from "./useDataQuery";

import { QueryOptions } from "./useDataQuery";

interface DependentQueriesResult<T> {
  isLoading: boolean,
  data: T, 
}

const useDependentDataQuery = <T>(
  primaryKey: string, 
  dependentKey: string, 
  dependentDataKeys: string[],
  functions: any, 
  params: ((string | null | any)[])[],
  queryOptions: QueryOptions,
  onSuccess?: () => void,
  onError?: () => void, 
): DependentQueriesResult<T> => {

  const { data: primaryFunctionResults, isSuccess: isSuccessPrimaryQuery } = useDataQuery<any,Error,string[]>(
    primaryKey, 
    () => functions[0](...params[0]), 
    primaryKey => dependentDataKeys.reduce((obj, key) => obj[key], primaryKey), 
    queryOptions
  )

  const dependentQueries = useQueries({
    queries: primaryFunctionResults
      ? primaryFunctionResults.map((primaryFunctionResult) => ({
          queryKey: [dependentKey, primaryFunctionResult],
          queryFn: () => functions[1](...params[1].map(i => i === null ? primaryFunctionResult : i)),
          enabled: isSuccessPrimaryQuery,
          ...queryOptions,
        }))
      : [],
    combine: (results) => {
      return {
        combinedData: results.map((result) => result.data) as T,
        isLoading: results.some((result) => result.isLoading),
        isSuccessDependentQuery: results.every((result) => result.isSuccess),
        isError: results.some((result) => result.isError),
      };
    },
  });

  const queryCache = new QueryCache()
  
  queryCache.subscribe(() => {
    if (dependentQueries.isSuccessDependentQuery) {
      onSuccess && onSuccess()
    } else if (dependentQueries.isError) {
      onError && onError()
    }
  });

  return { 
    isLoading: dependentQueries.isLoading, 
    data: dependentQueries.combinedData 
  };
};

export default useDependentDataQuery;