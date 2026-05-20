import React from "react";
import { getTaskIcon } from "../Utils/getTaskIcon";

export const TaskModal = ({ tasks, onClose, onComplete }) => {
    const tasksToday = tasks?.filter(t => t.is_today) || [];

    const handleItemClick = (task) => {
        if (task.status === "pending") {
            onComplete(task.id);
        }
    };

    return (
        <div className="task-modal__overlay" onClick={onClose}>
            <div className="task-modal" onClick={e => e.stopPropagation()}>
                <button className="task-modal__close" onClick={onClose}>✕</button>

                <h2 className="task-modal__title">Tareas de hoy</h2>

                <div className="task-modal__grid">
                    {tasksToday.length > 0 ? (
                        tasksToday.map(task => {
                            const taskEmoji = getTaskIcon(task.name || task.title);
                            
                            return (
                                <div
                            key={task.id}
                            className={`task-modal__item ${task.status === "pending" ? "task-modal__item--clickable" : ""}`}
                            onClick={() => handleItemClick(task)}
                            role={task.status === "pending" ? "button" : undefined}
                            tabIndex={task.status === "pending" ? 0 : undefined}
                        >
                                    <div className="task-modal__item-image" style={{ fontSize: "2rem" }}>
                                        {taskEmoji}
                                    </div>

                                    <div className="task-modal__item-info">
                                        <p className="task-modal__item-name">{task.name || task.title}</p>
                                        <p className="task-modal__item-coins">🪙 +{task.coins}</p>
                                        <p className="task-modal__item-hint">
                                            {task.status === "pending" ? "Pulsa aquí para marcarla como hecha" : task.status === "pending_validation" ? "Esperando aprobación" : "Tarea completada"}
                                        </p>
                                    </div>

                                    <button
                                        className={`task-modal__item-btn ${
                                            task.status === "completed"
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
                        <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '20px' }}>
                            No tienes tareas programadas para hoy. ¡A descansar! ✌️
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};