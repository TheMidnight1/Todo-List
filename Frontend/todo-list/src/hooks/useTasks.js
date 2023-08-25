import { api } from "$/utils/api"
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "$/utils/queryKeys";
import { useCurrentUser } from "./useCurrentUser";


export function useTasks() {
    const { user } = useCurrentUser()
    const { data, isLoading } = useQuery({
        enabled: !!user,
        queryKey: queryKeys.tasks,
        queryFn: async () => {
            const { data } = await api.get("/tasks/")
            return data ? JSON.parse(data) : []

        }

    })
    return { tasks: data, isLoading }
}
