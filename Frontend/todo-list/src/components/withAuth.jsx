import { useEffect } from "react"
import { toast } from "react-hot-toast"
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "$/hooks/useCurrentUser";

export default function withAuth(Component) {
    return function WithAuth(props) {
        const { user, isLoading } = useCurrentUser()
        useEffect(() => {
            if (!isLoading && !user) {
                toast.error("Please login to continue", { id: "login" })
            }
        }, [user, isLoading])

        if (isLoading) return "Loading"


        if (user) return <Component {...props} />
        else return <Navigate to="/auth/login" />
    }
}