import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDataMutation = (
  mutationKey: any, 
  mutationFn: any,
  onSuccess: () => void,
  onError: () => void,
  clientUpdate = true
) => {

  const queryClient = useQueryClient();
    
  const { mutate, isPending } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: mutationFn,
    onSuccess: () => {
      onSuccess()
      clientUpdate && queryClient.invalidateQueries(mutationKey)
    },
    onError: () => {
      onError()
    },
  })

  return { mutate, isPending };
};

export default useDataMutation;
