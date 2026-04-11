import React from "react";
 
// Estados posibles de una tarea:
// "pending"            → el niño puede marcarla
// "pending_validation" → esperando que el padre apruebe (⏳)
// "completed"          → aprobada por el padre (✓ oscuro, no pulsable)
 
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
                                    {/* ✅ FIX: era task.title, el modelo serializa "name" */}
                                    <p className="task-modal__item-name">{task.name}</p>
                                    <p className="task-modal__item-coins">🪙 +{task.coins}</p>
                                </div>
 
                                {/* ✅ NUEVO: 3 estados visuales */}
                                <button
                                    className={`task-modal__item-btn ${
                                        task.status === "completed"
                                            ? "task-modal__item-btn--done"
                                            : task.status === "pending_validation"
                                            ? "task-modal__item-btn--pending"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (task.status === "pending") {
                                            onComplete(task.id);
                                        }
                                    }}
                                    disabled={task.status !== "pending"}
                                    title={
                                        task.status === "pending_validation"
                                            ? "Esperando aprobación del padre"
                                            : task.status === "completed"
                                            ? "Tarea completada"
                                            : "Marcar como hecha"
                                    }
                                >
                                    {task.status === "completed"
                                        ? "✓"
                                        : task.status === "pending_validation"
                                        ? "⏳"
                                        : "✓"}
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