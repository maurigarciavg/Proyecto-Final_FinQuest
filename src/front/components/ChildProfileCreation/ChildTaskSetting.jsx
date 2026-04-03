import React, { useState } from "react";

export const ChildTaskSetting = ({ onBack, onNextStep }) => {
    // 1. Estados para el catálogo de sugerencias
    const [suggestions, setSuggestions] = useState([
        { id: 1, name: "Poner la mesa", coins: 10, days: ["L", "M", "X", "J", "V"] },
        { id: 2, name: "Sacar al perro", coins: 22, days: ["L", "M", "X", "J", "V"] },
        { id: 3, name: "Hacer los deberes", coins: 10, days: ["L", "M", "X", "J", "V"] },
    ]);

    // 2. Estados para la lista final de tareas añadidas
    const [addedTasks, setAddedTasks] = useState([]);

    // 3. Estados para el creador superior (Inputs)
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskCoins, setNewTaskCoins] = useState(10);

    const allDays = ["L", "M", "X", "J", "V", "S", "D"];

    // --- FUNCIONES DE LÓGICA ---

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
        setNewTaskCoins(10);
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

    // Función para limpiar datos antes de enviarlos al Wizard/Backend
    const handleNext = () => {
        const formattedTasks = addedTasks.map(task => ({
            name: task.name,
            coins: task.coins,
            days: task.days.join(",") // Convertimos Array ["L","M"] a String "L,M" para el Backend
        }));
        onNextStep(formattedTasks);
    };

    return (
        <div className="card shadow-lg border-0 p-4 w-100 h-100 d-flex flex-column"
            style={{ borderRadius: "30px", backgroundColor: "#f0fdfa" }}>

            <style>
                {`
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                    input[type=number] {
                        -moz-appearance: textfield;
                    }
                `}
            </style>

            <h2 className="text-center fw-bold mb-4" style={{ color: "#32a89b" }}>Crear Tareas de casa</h2>

            <div className="d-flex gap-2 mb-4 align-items-center">
                <input
                    type="text"
                    className="form-control rounded-pill px-4 shadow-sm flex-grow-1"
                    style={{ border: "2px solid #32a89b", outline: "none", height: "50px" }}
                    placeholder="Nueva tarea"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                />

                <div className="d-flex align-items-center bg-white rounded-pill shadow-sm ps-3 pe-2"
                    style={{ border: "2px solid #32a89b", height: "50px", width: "140px" }}>
                    <span style={{ fontSize: "1.1rem" }}>🪙</span>
                    <input
                        type="number"
                        className="form-control border-0 bg-transparent text-center fw-bold p-0"
                        style={{ color: "#32a89b", fontSize: "1rem", outline: "none", boxShadow: "none", marginLeft: "2px" }}
                        placeholder="10"
                        value={newTaskCoins}
                        onChange={(e) => setNewTaskCoins(e.target.value)}
                    />
                </div>

                <button
                    onClick={addNewCustomTask}
                    className="btn text-white rounded-pill px-4 fw-bold shadow-sm"
                    style={{ backgroundColor: "#32a89b", border: "none", height: "50px" }}>
                    Añadir
                </button>
            </div>

            <div className="overflow-auto mb-3 pe-2" style={{ maxHeight: "230px" }}>
                <p className="small fw-bold text-secondary text-start mb-2">SUGERENCIAS (Configura y añade +)</p>
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
                                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all">
                                    {d}
                                </span>
                            ))}
                        </div>

                        <div className="fw-bold me-2 small" style={{ color: "#f39c12" }}>🪙+{task.coins}</div>
                        <button onClick={() => confirmTask(task.id)} className="btn btn-sm btn-success rounded-circle fw-bold me-1 shadow-sm">+</button>
                    </div>
                ))}
            </div>

            <div className="flex-grow-1 border-top pt-3 overflow-auto">
                <p className="small fw-bold text-success text-start mb-2">✅ TAREAS AÑADIDAS ({addedTasks.length})</p>
                {addedTasks.length === 0 && <p className="text-muted small italic text-start">Añade tareas arriba para que aparezcan aquí</p>}
                {addedTasks.map((task, index) => (
                    <div key={index} className="d-flex align-items-center mb-2 gap-2 bg-success bg-opacity-10 rounded-pill p-2 animate__animated animate__fadeInLeft">
                        <span className="flex-grow-1 ms-3 text-start fw-bold text-success small">{task.name}</span>
                        <span className="text-muted small me-2" style={{ fontSize: "0.75rem" }}>{task.days.join(", ")}</span>
                        <span className="text-danger fw-bold cursor-pointer me-3" onClick={() => revertTask(index)}>🗑️</span>
                    </div>
                ))}
            </div>

            <div className="d-flex gap-3 mt-4">
                <button onClick={onBack} className="btn btn-outline-secondary rounded-pill w-50 p-3 fw-bold">Atrás</button>
                <button
                    onClick={handleNext}
                    className="btn text-white rounded-pill w-50 p-3 fw-bold shadow-sm"
                    style={{ backgroundColor: "#32a89b" }}
                    disabled={addedTasks.length === 0}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};