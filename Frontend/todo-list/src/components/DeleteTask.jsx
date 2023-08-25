import { useState } from "react";
import { Button } from "./Button";

export default function DeleteTask(props) {
    if (!props.taskId) {
        return "something"
    }
    const handleDelete = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8000/delete/${taskId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                console.log("ok")
            }

        } catch (error) {
            console.error("Error deleting data", error)
        }
    }

    return (
        <>
            <Button variant="destructive" onClick={() => handleDelete(task.id)}>Delete</Button>
        </>
    )
}