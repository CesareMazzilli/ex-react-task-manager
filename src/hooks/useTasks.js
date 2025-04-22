import { useEffect, useState } from "react";
const { VITE_API_URL } = import.meta.env;

export default function useTasks(){
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch(`${VITE_API_URL}/tasks`)
           .then(res => res.json())
           .then(data => setTasks(data))
           .catch(error => console.error(error));
    }, []);

    const addTask = async newTask => {
        const response = await fetch(`${VITE_API_URL}/tasks`, {
            method: 'POST',
            headers: { "Content-type": "application/json"},
            body: JSON.stringify(newTask)
        });
        const { success, message, task } = await response.json();
        if(!success) throw new Error(message);

        setTasks(prev => [...prev, task]);
    }

    const removeTask = () => {}

    const updateTask = () => {}

    return { tasks, addTask, removeTask, updateTask }
}