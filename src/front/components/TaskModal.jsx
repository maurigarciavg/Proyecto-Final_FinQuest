import React from "react";

export const TaskModal = ({ tasks, onClose, onComplete }) => {
    return (
        <div className="task-modal__overlay" onClick={onClose}>
            <div className="task-modal" onClick={e => e.stopPropagation()}>
                <button className="task-modal__close" onClick={onClose}>✕</button>

                <h2 className="task-modal__title">Tareas de casa</h2>

                <div className="task-modal__grid">
                    {tasks && tasks.length > 0 ? (
                        tasks.map(task => (
                            <div key={task.id} className="task-modal__item">
                                <div className="task-modal__item-image">🏠</div>
                                <div className="task-modal__item-info">
                                    <p className="task-modal__item-name">{task.title}</p>
                                    <p className="task-modal__item-coins">🪙 +{task.coins}</p>
                                </div>
                                <button
                                    className={`task-modal__item-btn ${task.status === "completed" ? "task-modal__item-btn--done" : ""}`}
                                    onClick={() => task.status !== "completed" && onComplete(task.id)}
                                >
                                    ✓
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Sin tareas disponibles</p>
                    )}
                </div>
            </div>
        </div>
    );
};