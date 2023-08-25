import { useEffect } from "react"
import { api } from "$/utils/api";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "$/hooks/useCurrentUser"
import { mutationKeys, queryKeys } from "$/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
    const navigate = useNavigate()
    const { user } = useCurrentUser()
    const queryClient = useQueryClient()
    const { register, handleSubmit } = useForm()

    useEffect(() => {
        if (user) {
            toast.success("Welcome user", { id: "login" })
            navigate("/")
        }
    }, [navigate, user])

    const loginMutation = useMutation({
        mutationKey: mutationKeys.login,
        mutationFn: async (body) => {
            toast.loading("Loading", { id: "login" })
            const { data, error } = await api.post("/auth/login/", { body })
            toast.remove("login")

            if (error) {
                toast.error(error.message, { id: "login" })
            }
            if (data?.token) {
                localStorage.setItem("token", data.token)
                queryClient.setQueryData(queryKeys.currentUser, () => data.user)
                toast.success("Welcome user", { id: "login" })
                navigate("/")
            }
        }
    })


    const onSubmitHandler = async (body) => {
        loginMutation.mutate(body);

    };
    return (
        <>

            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>

                    <p className="mt-4 text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla
                        eaque error neque ipsa culpa autem, at itaque nostrum!
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmitHandler)} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                    <div>
                        <label htmlFor="username" className="sr-only">Email</label>

                        <div className="relative">
                            <input
                                type="text"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter email"
                                {...register("username")}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>

                        <div className="relative">
                            <input
                                type="password"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter password"
                                {...register("password")}
                            />


                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            No account?
                            <Link to="/auth/register/" className="text-sm text-gray-500">
                                Signup
                            </Link>
                        </div>


                        <button
                            type="submit"
                            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}