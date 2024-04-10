import { useQuery } from "@tanstack/react-query";

export interface QueryOptions {
  staleTime?: number;
  gcTime?: number;
}

const useDataQuery = <TQueryFnData, TError, TData>(
  queryKey: string, 
  queryFn: any, 
  select: any,
  queryOptions?: QueryOptions,
  enabled = true
) => {

  const { data, isLoading, isSuccess, isError, isFetching, refetch } = useQuery<TQueryFnData, TError, TData>({
    queryKey: [queryKey],
    queryFn: queryFn,
    select: select,
    enabled: enabled,
    ...queryOptions
  })  

  return { data, isLoading, isSuccess, isError, isFetching, refetch }
}

export default useDataQuery
