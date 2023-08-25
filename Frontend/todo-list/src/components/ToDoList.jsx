import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./PopOver"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./Dialog";
import { Button } from "./Button"
import { Label } from "./Label";
import { Textarea } from "./TextArea";
import { useTasks } from "$/hooks/useTasks";
import withAuth from "./withAuth";
import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "$/utils/queryKeys";

const ToDoPage = withAuth(() => {


    const { tasks } = useTasks()
    const { register, handleSubmit } = useForm()
    const [task, setTask] = useState({})
    const [opened, setOpened] = useState(false);
    const addTaskMutation = useMutation(mutationKeys.addTask)
    const deleteTaskMutation = useMutation(mutationKeys.deleteTask)

    //Create Task
    const onSubmitHandler = async (data) => {
        addTaskMutation.mutate(data)
    };



    //Data delete
    const handleDelete = async (taskId) => {
        console.log(taskId)
        deleteTaskMutation.mutate(taskId)
    }

    // //Edit Task Data
    const onUpdateHandler = async (data) => {

        try {
            const response = await fetch(`http://localhost:8000/edit/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
            }
            // Handle response and updates as needed
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };


    async function handleDialogOpen(taskId) {
        try {
            const taskData = await getTaskById(taskId);
            setTask(taskData);
            setOpened(true);
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    }

    const getTaskById = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8000/task/${taskId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching task:', error);
            throw error; // Re-throw the error to handle it in the caller function
        }
    }

    return (
        <>
            <div className="text-center bg-slate-300 h-32 pb-40 p-7">
                <h3 className="text-xl font-semibold mb-4">ToDo List</h3>
                <Dialog>
                    <DialogTrigger>
                        Create Task
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className=" border-gray-300">Create Task</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                        </DialogDescription>
                        <form method="post" onSubmit={handleSubmit(onSubmitHandler)}>
                            <Label htmlFor="text" className="">Task</Label>
                            <Input className="my-3" {...register("title")} />
                            <Label htmlFor="text" className="my-7">Description</Label>
                            <Textarea className="my-3"{...register("description")} />
                            <Label htmlFor="text" className="my-7">Due date</Label>
                            <Input type="date" className="my-3" {...register("due_date")} />
                            <Button type="submit" className="my-7">Create Task</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div >
            <section className="mx-40">
                <div className="flex flex-wrap gap-3">
                    {tasks?.map(todo_task => (
                        <div key={todo_task.pk} className="relative mt-6 w-96 flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md border-t-4 border-pink-500">
                            { }
                            <div className="p-6">
                                <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                                    {todo_task.fields.title}
                                </h5>
                                <p className="line-clamp-2 overflow-hidden font-sans text-base font-light leading-relaxed text-inherit antialiased">
                                    {todo_task.fields.description}
                                </p>
                            </div>
                            <div className="p-6 pt-0 flex items-center justify-between">
                                <a href="#" className="font-medium text-blue-gray-900 transition-colors hover:text-pink-500">
                                    <Popover>
                                        <PopoverTrigger>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                            </svg>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            Created at {todo_task.fields.created}
                                            {todo_task.fields.completed !== false ? (
                                                // If task is completed
                                                <div>
                                                    Completed
                                                </div>
                                            ) : (
                                                // If task is not completed
                                                <div>
                                                    Not complete
                                                </div>
                                            )}
                                            Due Data {todo_task.fields.due_date}
                                        </PopoverContent>
                                    </Popover>
                                </a>
                                <div className="flex gap-4">
                                    <Dialog>
                                        <DialogTrigger onClick={() => handleDialogOpen(todo_task.pk)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className=" transition-colors hover:text-pink-500 bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                            </svg>

                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Update Task</DialogTitle>
                                                <DialogDescription>
                                                </DialogDescription>
                                            </DialogHeader>
                                            {/* <form onSubmit={handleSubmit(onUpdateHandler)}>
                                                <Label htmlFor="text" className="">Task</Label>
                                                <Input className="my-3"{...register("title", { defaultValue: task?.title })} />
                                                <Label htmlFor="text" className="my-7">Description</Label>
                                                <Textarea         {...register("description", { defaultValue: "test valhe" })} />
                                                <Label htmlFor="text" className="my-7">Due date</Label>
                                                <Input type="date" className="my-3"  {...register("due_date", { defaultValue: task?.due_date })} />
                                                <Button type="submit" className="my-7">Create Task</Button>
                                            </form> */}
                                            <form onSubmit={(e) => { e.preventDefault(); onUpdateHandler(task); }}>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <Input type="text" id="title" placeholder="Title" value={task?.title || ''}
                                                        onChange={(e) => setTask({ ...task, title: e.target.value })} />
                                                </div>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <label htmlFor="description">Description</label>
                                                    <Input type="text" id="description" placeholder="Description" value={task?.description || ''}
                                                        onChange={(e) => setTask({ ...task, description: e.target.value })} />
                                                </div>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <label htmlFor="description">Due Date</label>
                                                    <input type="date" id="date" placeholder="Due Date" value={task?.due_date || ''}
                                                        onChange={(e) => setTask({ ...task, due_date: e.target.value })} />
                                                </div>
                                                <input type="submit" value="submit" />
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="transition-colors hover:text-pink-500 bi bi-trash-fill" viewBox="0 0 16 16">
                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                            </svg>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-row-reverse">
                                                <Button variant="destructive" data-id={todo_task.pk} onClick={() => handleDelete(todo_task.pk)}>Delete</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div className="container mx-auto p-4">
                    <div className="mt-4">
                        <table className="border-collapse border border-gray-400 w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-400 px-4 py-2">ID</th>
                                    <th className="border border-gray-400 px-4 py-2">Title</th>
                                    <th className="border border-gray-400 px-4 py-2">Description</th>
                                    <th className="border border-gray-400 px-4 py-2">Created</th>
                                    <th className="border border-gray-400 px-4 py-2">Due Date</th>
                                    <th className="border border-gray-400 px-4 py-2">Update/Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task.id} className="bg-gray-100">
                                        <td className="border border-gray-400 px-4 py-2">{task.id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.title}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.description}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.created}</td>
                                        <td className="border border-gray-400 px-4 py-2">{task.due_date}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <button type="submit" data-id={task.id} onClick={() => getTaskById(task.id)}>Edit</button>
                                            <button type="submit" data-id={task.id} onClick={() => handleDelete(task.id)}>Delete</button>
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>
                    <form method="post" onSubmit={handleSubmit(onSubmitHandler)}>
                        <label htmlFor="title">Title</label>
                        <input type="text" {...register("title")} />

                        <label htmlFor="description">Description</label>
                        <input type="text" {...register("description")} />

                        <label htmlFor="title">Due Date</label>
                        <input type="date" {...register("due_date")} />
                        <input type="submit" value="submit" />

                    </form>
                    <h1>
                        Selected Edit data
                    </h1>
                    <div>
                        {task !== null && (
                            <div>
                                {task.title}
                                {task.description}
                                {task.created}
                                {task.due_date}
                            </div>
                        )}
                    </div>
                    <h1>
                        Update form
                    </h1>
                    <form method="Put" onSubmit={handleSubmit(onUpdateHandler)}>

                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input type="text" id="title" placeholder="Title" defaultValue={task?.title} {...register("task.title")} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <label htmlFor="description">Description</label>
                            <Input type="text" id="description" placeholder="Description" defaultValue={task?.description} {...register("task.description")} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <label htmlFor="description">Due Date</label>
                            <input type="date" id="date" placeholder="Due Date" defaultValue={task?.due_date}{...register("task.due_date")} />

                        </div>
                        <input type="submit" value="submit" />

                    </form>
                </div> */}

            </section >
        </>
    );

})
export default ToDoPage