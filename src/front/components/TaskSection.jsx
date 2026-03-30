import React from "react";

export const TaskSection = ({ tasks }) => {
    return (
        <div className="card h-100 border-0 bg-light rounded-4">
            <div className="card-body p-4">
                <h2 className="h5 mb-3">Tareas de casa</h2>

                {tasks.length === 0 ? (
                    <p className="text-muted mb-0">
                        No hay tareas disponibles.
                    </p>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="d-flex justify-content-between align-items-center bg-white rounded-4 p-3 shadow-sm border"
                            >
                                <div>
                                    <div className="fw-semibold">
                                        {task.title}
                                    </div>
                                    <div className="small text-muted">
                                        Tarea disponible
                                    </div>
                                </div>

                                <span className="badge text-bg-warning px-3 py-2">
                                    +{task.coins}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};