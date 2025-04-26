import { useState, useRef } from "react";
import Modal from "./Modal";

export default function EditTaskModal({ show, onClose, task, onSave }){
    const [editedTask, setEditedTask] = useState(task);
    const editFormRef = useRef();

    const changeEditedTask = (key, event) => {
        setEditedTask(prev => ({...prev, [key]: event.target.value}));
    }

    const handleSubmit = e => {
        e.preventDefault();
        onSave(editedTask);
    }

    const { title, description, status } = editedTask;

    return(
        <Modal
          title="Modifica Task"
          content={
            <form ref={editFormRef} onSubmit={handleSubmit}>
                <label>
                    Nome Task:
                    <input
                      type='text'
                      value={title}
                      onChange={e => changeEditedTask('title', e)}
                    />
                </label>
                <label>
                    Descrizione:
                    <textarea
                      value={description}
                      onChange={e => changeEditedTask('description', e)}
                    />
                </label>
                <label>
                    Stato:
                    <select
                      value={status}
                      onChange={e => changeEditedTask('status', e)}
                    >
                        {["To do", "Doing", "Done"].map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))}
                    </select>
                </label>
            </form>
          }
          confirmText='Salva'
          show={show}
          onClose={onClose}
          onConfirm={() => editFormRef.current.requestSubmit()}
        />
    )
}