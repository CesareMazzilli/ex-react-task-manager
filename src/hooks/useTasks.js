import { useEffect, useReducer } from "react";
import tasksReducer from "../reducers/tasksReducer";
const { VITE_API_URL } = import.meta.env;

export default function useTasks(){
    const [tasks, dispatchTasks] = useReducer(tasksReducer, []);

    useEffect(() => {
        fetch(`${VITE_API_URL}/tasks`)
           .then(res => res.json())
           .then(data => dispatchTasks({type: 'LOAD_TASKS', payload: data}))
           .catch(error => console.error(error));
    }, []);

    const addTask = async newTask => {
        const taskExists = tasks.some(t => t.title === newTask.title);
        if(taskExists){
            throw new Error('Esiste già una task con questo nome.');
        }

        const response = await fetch(`${VITE_API_URL}/tasks`, {
            method: 'POST',
            headers: { "Content-type": "application/json"},
            body: JSON.stringify(newTask)
        });
        const { success, message, task } = await response.json();
        if(!success) throw new Error(message);

        dispatchTasks({type: 'ADD_TASK', payload: task});
    }

    const removeTask = async taskId => {
        const response = await fetch(`${VITE_API_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });
        const { success, message } = await response.json();
        if(!success) throw new Error(message);

        dispatchTasks({type: 'REMOVE_TASK', payload: taskId})
    }

    const removeMultipleTasks = async taskIds => {
        const deleteRequests = taskIds.map(taskId =>
            fetch(`${VITE_API_URL}/tasks/${taskId}`, {method: 'DELETE'})
            .then(res => res.json())
        );

        const results = await Promise.allSettled(deleteRequests);

        const fullfilledDeletions = [];
        const rejectedDeletions = [];

        results.forEach((result, index) => {
            const taskId = taskIds[index];
            if(result.status === 'fulfilled' && result.value.success){
                fullfilledDeletions.push(taskId);
            }else{
                rejectedDeletions.push(taskId);
            }
        });

        if(fullfilledDeletions.length > 0) {
            dispatchTasks({type: 'REMOVE_MULTIPLE_TASKS', payload: fullfilledDeletions})
        }

        if(rejectedDeletions.length > 0){
            throw new Error(`Errore nell'eliminazione delle task con id: ${rejectedDeletions.join(", ")}`);
        }

    }

    const updateTask = async updatedTask => {
        const taskWithSameTitle = tasks.find(t => t.title === updatedTask.title);
        if(taskWithSameTitle && taskWithSameTitle.id !== updatedTask.id){
            throw new Error('Esiste già una task con questo nome.');
        }

        const response = await fetch(`${VITE_API_URL}/tasks/${updatedTask.id}`, {
            method: 'PUT',
            headers: { "Content-type": "application/json"},
            body: JSON.stringify(updatedTask)
        });
        const { success, message, task } = await response.json();
        if(!success) throw new Error(message);

        dispatchTasks({type: 'UPDATE_TASK', payload: task});
    }

    return { tasks, addTask, removeTask, updateTask, removeMultipleTasks }
}