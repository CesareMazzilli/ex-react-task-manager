import { useCallback, useContext, useMemo, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import TaskRow from "../components/TaskRow";

function debounce(callback, delay){
    let timer;
    return (value) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(value);
        }, delay)
    }
}

export default function TaskList(){

    const { tasks, removeMultipleTasks } = useContext(GlobalContext);
    console.log('Tasks:', tasks);

    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSetSearchQuery = useCallback(debounce(setSearchQuery, 500), []);

    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState(1);

    const sortIcon = sortOrder === 1 ? "↓" : "↑";

    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
    const toggleSelection = taskId => {
        setSelectedTaskIds(prev => {
            if(selectedTaskIds.includes(taskId)){
                return prev.filter(id => id !== taskId);
            }else{
                return [...prev, taskId];
            }
        });
    }

    const handleDeleteSelected = async () => {
        try{
            await removeMultipleTasks(selectedTaskIds);
            alert("Task eliminate con successo!");
            setSelectedTaskIds([]);
        }catch(error){
            console.error(error);
            alert(error.message);
        }
    }

    const handleSort = (field) => {
        if(sortBy === field){
            setSortOrder(prev => prev * -1);
        }else{
            setSortBy(field);
            setSortOrder(1);
        }
    }

    const filteredAndSortedTasks = useMemo(() => {
        return [...tasks]
        .filter(t => t.title.toLowerCase().includes(searchQuery.toLocaleLowerCase()))
        .sort((a, b) => {
            let comparison;

            if(sortBy === 'title'){
                comparison = a.title.localeCompare(b.title)
            }else if(sortBy === 'status'){
                const statusOptions = ["To do", "Doing", "Done"];
                const indexA = statusOptions.indexOf(a.status);
                const indexB = statusOptions.indexOf(b.status);
                comparison = indexA - indexB;
            }else if(sortBy === 'createdAt'){
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                comparison = dateA - dateB;
            }

            return comparison * sortOrder;
        });
    },[tasks, sortBy, sortOrder, searchQuery]);

    return (
        <div>
            <h1>Lista delle Task</h1>

            <input
              type="text"
              placeholder='Cerca una task...'
              onChange={e=> debouncedSetSearchQuery(e.target.value)}
            />

            {selectedTaskIds.length > 0 && (
                <button onClick={handleDeleteSelected}>Elinima Selezionate</button>
            )}

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th onClick={() => handleSort('title')}>Nome {sortBy === "title" && sortIcon}</th>
                        <th onClick={() => handleSort('status')}>Status {sortBy === "status" && sortIcon}</th>
                        <th onClick={() => handleSort('createdAt')}>Data di creazione {sortBy === "createdAt" && sortIcon}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedTasks.map(task => (
                        <TaskRow 
                          key={task.id} 
                          task={task}
                          checked={selectedTaskIds.includes(task.id)}
                          onToggle={toggleSelection}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}