import { api } from "$/utils/api"
import { queryKeys } from "$/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
    const { data, isLoading } = useQuery({
        queryKey: queryKeys.currentUser,
        queryFn: async () => {
            const { data } = await api.get("/auth/currentuser/")
            return data ?? null
        }
    })
    return { user: data, isLoading }
}