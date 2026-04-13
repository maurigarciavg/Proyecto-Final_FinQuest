import React, { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import defaultAvatar from "../../assets/img/Profiles/Children/child_9.png";
import "./ChildWizard.css"; 

export const ChildTaskSetting = ({ onBack, onNextStep, step, formData }) => {
    const selectedAvatar = formData?.child?.child?.avatar || formData?.child?.avatar || defaultAvatar;
    const childName = formData?.child?.child?.name || formData?.child?.name || "Niño/a";

    const [addedTasks, setAddedTasks] = useState([
        { id: 1, name: "Hacer los deberes", coins: 10, days: ["L", "M", "X", "J", "V"] },
        { id: 2, name: "Sacar al perro", coins: 22, days: ["L", "M", "X", "J", "V"] },
        { id: 3, name: "Poner la mesa", coins: 10, days: ["L", "M", "X", "J", "V"] }
    ]);

    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskCoins, setNewTaskCoins] = useState(10);
    const allDays = ["L", "M", "X", "J", "V", "S", "D"];

    const addNewTask = () => {
        if (!newTaskName.trim()) return;
        const newTask = {
            id: Date.now(),
            name: newTaskName,
            coins: parseInt(newTaskCoins) || 10,
            days: ["L", "M", "X", "J", "V"]
        };
        setAddedTasks([newTask, ...addedTasks]);
        setNewTaskName("");
        setNewTaskCoins(10);
    };

    const toggleDay = (id, day) => {
        setAddedTasks(addedTasks.map(t =>
            t.id === id ? { 
                ...t, 
                days: t.days.includes(day) ? t.days.filter(d => d !== day) : [...t.days, day] 
            } : t
        ));
    };

    const removeTask = (id) => {
        setAddedTasks(addedTasks.filter(t => t.id !== id));
    };

    return (
        <div className="wizard-step-wrapper animate__animated animate__fadeIn">
            
            <div className="wizard-header">
                
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    <img 
                        src={selectedAvatar} 
                        alt="Avatar del niño" 
                        style={{ 
                            width: "65px", 
                            height: "65px", 
                            borderRadius: "50%", 
                            border: "3px solid #32a89b", 
                            objectFit: "cover",
                            boxShadow: "0 4px 10px rgba(50, 168, 155, 0.2)" 
                        }} 
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>

                <h2 className="wizard-title" style={{ marginBottom: "25px" }}>Misiones para {childName}</h2>
                
                <div className="task-input-row">
                    <input
                        type="text"
                        className="wizard-input"
                        style={{ flex: 1 }}
                        placeholder="Ej: Limpiar mi cuarto"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                    />
                    <div className="task-coin-input-wrapper">
                        <span>🪙</span>
                        <input
                            type="number"
                            className="task-coin-input"
                            value={newTaskCoins}
                            onChange={(e) => setNewTaskCoins(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        onClick={addNewTask} 
                        className="btn-next" 
                        style={{ width: "auto", padding: "0 25px", height: "55px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        Añadir
                    </button>
                </div>
            </div>

            <div className="wizard-body">
                <label className="wizard-label task-list-label">
                    ✅ Tareas de esta semana ({addedTasks.length})
                </label>

                {addedTasks.length === 0 && (
                    <p className="empty-tasks-msg">Usa el buscador de arriba para añadir misiones</p>
                )}

                {addedTasks.map((task) => (
                    <div key={task.id} className="task-item">
                        <span className="task-name">{task.name}</span>
                        
                        <div className="task-days-container">
                            {allDays.map(d => (
                                <span 
                                    key={d} 
                                    onClick={() => toggleDay(task.id, d)}
                                    className={`task-day-bubble ${task.days.includes(d) ? 'active' : ''}`}
                                >
                                    {d}
                                </span>
                            ))}
                        </div>

                        <div className="task-coins-display">
                            🪙 {task.coins}
                        </div>

                        <button onClick={() => removeTask(task.id)} className="btn-delete-task">
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            <div className="wizard-footer">
                <p className="footer-suggestion">💡 Sugerencia: 20 🪙 = 1€</p>
                <ProgressBar step={step} />
                <div className="footer-buttons">
                    <button onClick={onBack} className="btn-back">Atrás</button>
                    <button 
                        onClick={() => onNextStep(addedTasks)} 
                        className="btn-next" 
                        disabled={addedTasks.length === 0}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};