import { mutationKeys, queryKeys } from "./queryKeys"
import { api } from "./api"


export function setUpMutation(queryClient) {

    //For create
    queryClient.setMutationDefaults(mutationKeys.addTask, {

        mutationFn: async (body) => {
            return api.post('/tasks/create', { body })
        },
        onMutate(data) {
            const pk = Date.now()
            const user = queryClient.getQueryData(queryKeys.currentUser)
            queryClient.setQueryData(queryKeys.tasks, (oldData) => {
                const newTask = {
                    pk,
                    fields: {
                        ...data, user: user.id, created: new Date,

                    }
                }
                if (!oldData) return [newTask]
                else return [...oldData, newTask]
            })
            return { pk }

        },
        onSettled(response, _, data, context) {
            console.log(response)
            queryClient.setQueryData(queryKeys.tasks, (oldData) => {
                const data = [...oldData].filter(o => o.pk != context.pk)
                if (response.data?.new_task) {
                    return [...data,
                    {
                        pk: response.data.new_task.pk,
                        fields: response.data.new_task
                    }]
                }
                return data

            })
        }

    })

    //For updating
    queryClient.setMutationDefaults(mutationKeys.editTask, {
        mutationFn: async (data) => {
            return api.delete()
        },
        onMutate(data) {

        },
        onSettled(response, _, data, context) {

        }

    })

    //For delete
    queryClient.setMutationDefaults(mutationKeys.deleteTask, {
        mutationFn: async (taskId) => {
            return api.delete(`/tasks/delete/${taskId}`)
        },
        onMutate(taskId) {
            const previousData = queryClient.getQueryData(queryKeys.tasks);
            queryClient.setQueryData(queryKeys.tasks, (oldData) =>
                oldData.filter(task => task.pk !== taskId)
            );

            return { previousData };
        },
        onSettled(response, _, data, context) {
            queryClient.invalidateQueries(queryKeys.tasks);
        }

    })
}