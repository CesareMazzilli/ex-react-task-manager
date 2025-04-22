import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import TaskRow from "../components/TaskRow";

export default function TaskList(){

    const {tasks} = useContext(GlobalContext);
    console.log('Tasks:', tasks);

    return (
        <div>
            <h1>Lista delle Task</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Data di creazione</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <TaskRow key={task.id} task={task}/>
                    ))}
                </tbody>
            </table>
        </div>
    )
}