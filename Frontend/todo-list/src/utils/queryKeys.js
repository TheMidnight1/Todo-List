export const queryKeys = {
    currentUser: ["current-user"],
    tasks: ["tasks"],
    task: id => [queryKeys.tasks, id]
}

export const mutationKeys = {
    login: ["login"],
    addTask: ["add-task"],
    editTask: ["edit-task"],
    deleteTask: ["delete-task"]

}