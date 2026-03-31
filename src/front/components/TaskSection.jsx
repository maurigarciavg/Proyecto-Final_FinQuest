import React from "react";

export const TaskSection = ({ tasks }) => {
    const firstTask = tasks?.[0];

    return (
        <div className="task-summary-card">
            <div className="task-summary-card__header">
                <span className="task-summary-card__badge">2</span>
                <h2 className="task-summary-card__title">Tareas de casa</h2>
            </div>

            <div className="task-summary-card__content">
                <div className="task-summary-card__image">🐶</div>

                <p className="task-summary-card__task-name">
                    {firstTask ? firstTask.title : "Sin tareas disponibles"}
                </p>

                <p className="task-summary-card__reward">
                    +{firstTask ? firstTask.coins : 0} 🪙
                </p>
            </div>
        </div>
    );
};