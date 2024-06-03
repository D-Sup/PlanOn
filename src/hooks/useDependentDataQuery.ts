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



          // queryFn: () => {
          //   const updatedParams = dependentFunctionParams.map((item) => {
          //     if (typeof item === "object") {
          //       Object.keys(item).forEach((key) => {
          //         if (item[key] === null) {
          //           item[key] = primaryFunctionResult;
          //         }
          //       });
          //       return item;
          //     } else {
          //       return item === null ? primaryFunctionResult : item;
          //     }
          //   });
          //   return dependentFunction(...updatedParams);
          // },

// import { useState } from "react";
// import { useQuery, useQueries } from "react-query";

// interface DependentQueriesResult<T> {
//   isSuccessPrimaryQuery: boolean,
//   isSuccessDependentQuery: boolean,
//   primaryFunctionResults: any,
//   executeQueries: ()=> void;
//   isLoading: boolean,
//   combinedData: T, 
// }

// interface QueryOptions {
//   staleTime: number;
//   cacheTime: number;
// }

// const useDependentQueries = <T>(
//   primaryKey: string, 
//   primaryFunction: any, 
//   dependentDataKeys: string[],
//   dependentKey: string, 
//   dependentFunction: any,
//   dependentFunctionParams: (string | null | any)[],
//   queryOptions?: QueryOptions): DependentQueriesResult<T> => {

//   const [execute, setExecute] = useState<boolean>(false);

//   console.log(execute);
  
    
//   const { data: primaryFunctionResults, isSuccess: isSuccessPrimaryQuery } = useQuery<any, Error, string[]>([primaryKey], () => primaryFunction, {
//     enabled: execute,
//     select: primaryKey => dependentDataKeys.reduce((obj, key) => obj[key], primaryKey),
//     ...queryOptions
//   })

//   const dependentQueries = useQueries(
//     primaryFunctionResults?.map((primaryFunctionResult) => ({
//       queryKey: [dependentKey, primaryFunctionResult],
//       queryFn: () => dependentFunction(...dependentFunctionParams.map(i => i === null ? primaryFunctionResult : i)),
//       enabled: isSuccessPrimaryQuery,
//       ...queryOptions
//     })) || []
//   );

//   const combinedData = dependentQueries.map((query) => query.data) as T
//   const isLoading = dependentQueries.some(query => query.isLoading);
//   const isSuccessDependentQuery = dependentQueries.every(query => query.isSuccess);

//   const executeQueries = () => {
//     setExecute(true);
//   }

//   return { executeQueries, primaryFunctionResults, isSuccessPrimaryQuery, isSuccessDependentQuery, isLoading, combinedData };
// };

// export default useDependentQueries;
