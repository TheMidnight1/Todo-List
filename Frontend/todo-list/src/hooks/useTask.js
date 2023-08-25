import { api } from "$/lib/utils/api"
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "$/utils/queryKeys";
import { useCurrentUser } from "./useCurrentUser";


export function useTask(taskId) {
    const { user } = useCurrentUser()
    const { data, isLoading } = useQuery({
        enabled: !!user,
        queryKey: queryKeys.task(taskId),
        queryFn: async () => {
            const { data } = await api.get(`/tasks/${taskId}`)
            return data ?? null
        }

    })
    return { task: data, isLoading }
}
