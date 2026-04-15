import React from "react";
import { getTaskIcon } from "../Utils/getTaskIcon"; // Importa tu función

export const TaskModal = ({ tasks, onClose, onComplete }) => {
    return (
        <div className="task-modal__overlay" onClick={onClose}>
            <div className="task-modal" onClick={e => e.stopPropagation()}>
                <button className="task-modal__close" onClick={onClose}>✕</button>

                <h2 className="task-modal__title">Tareas de casa</h2>

                <div className="task-modal__grid">
                    {tasks && tasks.length > 0 ? (
                        tasks.map(task => {
                            // 🟢 Calculamos el emoji para cada tarea individual
                            const taskEmoji = getTaskIcon(task.name || task.title);
                            
                            return (
                                <div key={task.id} className="task-modal__item">
                                    {/* 🟢 Cambio: Sustituimos 🏠 por el emoji dinámico */}
                                    <div className="task-modal__item-image" style={{ fontSize: "2rem" }}>
                                        {taskEmoji}
                                    </div>

                                    <div className="task-modal__item-info">
                                        <p className="task-modal__item-name">{task.name || task.title}</p>
                                        <p className="task-modal__item-coins">🪙 +{task.coins}</p>
                                    </div>

                                    <button
                                        className={`task-modal__item-btn ${task.status === "completed"
                                                ? "task-modal__item-btn--done"
                                                : task.status === "pending_validation"
                                                    ? "task-modal__item-btn--pending"
                                                    : ""
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (task.status === "pending") {
                                                onComplete(task.id);
                                            }
                                        }}
                                        disabled={task.status !== "pending"}
                                    >
                                        {task.status === "completed" ? "✓" : task.status === "pending_validation" ? "⏳" : "✓"}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p>Sin tareas disponibles</p>
                    )}
                </div>
            </div>
        </div>
    );
};