import React, { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import "./ChildWizard.css"; 

export const ChildTaskSetting = ({ onBack, onNextStep, step }) => {
    const [suggestions, setSuggestions] = useState([
        { id: 1, name: "Hacer los deberes", coins: 10, days: ["L", "M", "X", "J", "V"] },
        { id: 2, name: "Sacar al perro", coins: 22, days: ["L", "M", "X", "J", "V"] },
        { id: 3, name: "Poner la mesa", coins: 10, days: ["L", "M", "X", "J", "V"] },
    ]);

    const [addedTasks, setAddedTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskCoins, setNewTaskCoins] = useState(10);
    const allDays = ["L", "M", "X", "J", "V", "S", "D"];

    const addNewCustomTask = () => {
        if (!newTaskName.trim()) return;
        const newTask = {
            id: Date.now(),
            name: newTaskName,
            coins: parseInt(newTaskCoins) || 10,
            days: ["L", "M", "X", "J", "V"]
        };
        setSuggestions([newTask, ...suggestions]);
        setNewTaskName("");
    };

    const toggleDay = (id, day) => {
        setSuggestions(suggestions.map(t =>
            t.id === id ? { ...t, days: t.days.includes(day) ? t.days.filter(d => d !== day) : [...t.days, day] } : t
        ));
    };

    const confirmTask = (id) => {
        const taskToMove = suggestions.find(t => t.id === id);
        setAddedTasks([...addedTasks, taskToMove]);
        setSuggestions(suggestions.filter(t => t.id !== id));
    };

    const revertTask = (index) => {
        const taskToRevert = addedTasks[index];
        setSuggestions([taskToRevert, ...suggestions]);
        setAddedTasks(addedTasks.filter((_, i) => i !== index));
    };

    return (
        <div className="d-flex flex-column h-100 w-100">
            
            <style>
                {`
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                `}
            </style>

            {/* CABECERA: Título + Input (SIEMPRE VISIBLE) */}
            <div className="px-4 pt-3">
                <h2 className="wizard-title mb-4">Crear Tareas de casa</h2>
                
                <div className="d-flex gap-2 mb-3 align-items-center">
                    <input
                        type="text"
                        className="form-control rounded-pill px-4 shadow-sm flex-grow-1"
                        style={{ border: "2px solid #32a89b", height: "50px" }}
                        placeholder="Nueva tarea"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                    />
                    <div className="d-flex align-items-center bg-white rounded-pill shadow-sm ps-3 pe-2"
                        style={{ border: "2px solid #32a89b", height: "50px", width: "100px" }}>
                        <span style={{fontSize: "1.1rem"}}>🪙</span>
                        <input
                            type="number"
                            className="form-control border-0 bg-transparent text-center fw-bold p-0 shadow-none"
                            style={{ color: "#32a89b", width: "40px" }}
                            value={newTaskCoins}
                            onChange={(e) => setNewTaskCoins(e.target.value)}
                        />
                    </div>
                    <button onClick={addNewCustomTask} className="btn-next shadow-sm" style={{ width: "auto", padding: "0 20px", height: "50px" }}>
                        Añadir
                    </button>
                </div>
            </div>

            {/* CUERPO CENTRAL CON SCROLL (Sugerencias + Añadidas) */}
            {/* Le damos una altura máxima fija para que no empuje el footer fuera */}
            <div className="px-4 flex-grow-1 overflow-auto" style={{ maxHeight: "330px", marginBottom: "10px" }}>
                
                <p className="small fw-bold text-secondary text-start mb-2 text-uppercase" style={{fontSize: "0.7rem"}}>Sugerencias</p>
                {suggestions.map((task) => (
                    <div key={task.id} className="d-flex align-items-center mb-2 gap-2 bg-white rounded-pill p-1 shadow-sm border border-light">
                        <span className="flex-grow-1 ms-3 text-start small fw-semibold text-secondary">{task.name}</span>
                        <div className="d-flex gap-1 me-2">
                            {allDays.map(d => (
                                <span key={d} onClick={() => toggleDay(task.id, d)}
                                    style={{
                                        cursor: "pointer", fontSize: "9px", width: "18px", height: "18px",
                                        backgroundColor: task.days.includes(d) ? "#32a89b" : "#e9ecef",
                                        color: task.days.includes(d) ? "white" : "#adb5bd"
                                    }}
                                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold">
                                    {d}
                                </span>
                            ))}
                        </div>
                        <div className="fw-bold me-2 small" style={{ color: "#f39c12" }}>🪙+{task.coins}</div>
                        <button onClick={() => confirmTask(task.id)} className="btn btn-sm btn-success rounded-circle fw-bold me-1" style={{width: "24px", height: "24px", padding: "0"}}>+</button>
                    </div>
                ))}

                <div className="border-top mt-4 pt-3">
                    <p className="small fw-bold text-success text-start mb-3" style={{fontSize: "0.75rem"}}>
                        ✅ TAREAS AÑADIDAS ({addedTasks.length})
                    </p>
                    {addedTasks.length === 0 && <p className="text-muted small italic text-start ps-2">Usa el "+" para añadir tareas</p>}
                    {addedTasks.map((task, index) => (
                        <div key={index} className="d-flex align-items-center mb-2 gap-2 bg-success bg-opacity-10 rounded-pill p-2">
                            <span className="flex-grow-1 ms-3 text-start fw-bold text-success small">{task.name}</span>
                            <span className="text-muted small me-2" style={{ fontSize: "0.7rem" }}>{task.days.join(", ")}</span>
                            <span className="text-danger fw-bold me-3" style={{ cursor: "pointer" }} onClick={() => revertTask(index)}>🗑️</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* PIE FIJO: Barra + Botones */}
            <div className="wizard-footer">
                <p className="text-center text-muted small mb-2" style={{ fontSize: "0.75rem" }}>
                    💡 Sugerencia: 20 🪙 = 1€
                </p>
                <ProgressBar step={step} />
                <div className="d-flex gap-3 mt-1">
                    <button onClick={onBack} className="btn-back">Atrás</button>
                    <button onClick={() => onNextStep(addedTasks)} className="btn-next shadow-sm" disabled={addedTasks.length === 0}>Siguiente</button>
                </div>
            </div>
        </div>
    );
};