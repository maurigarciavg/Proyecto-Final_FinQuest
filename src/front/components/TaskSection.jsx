import React from "react";
import { getTaskIcon } from "../Utils/getTaskIcon"; 
import coin from "../assets/img/coin.png";

export const TaskSection = ({ tasks }) => {
    // Mantengo nuestra lógica funcional de filtrado por día
    const tasksToday = tasks?.filter(t => t.is_today) || [];
    const firstTask = tasksToday[0];
    const taskEmoji = getTaskIcon(firstTask?.title || firstTask?.name);

    return (
        <>
            <div className="task-summary-card__header">
                {/* Badge dinámico con el número de tareas de HOY */}
                <span className="task-summary-card__badge">{tasksToday.length}</span>
                <h2 className="task-summary-card__title">Tareas de hoy</h2>
            </div>

            <div className="task-summary-card__content">
                {tasksToday.length > 0 ? (
                    <>
                        {/* Emoji dinámico (estilo Microsoft Rewards) */}
                        <div style={{ fontSize: "3.5rem", marginBottom: "10px" }}>
                            {taskEmoji}
                        </div>
                        
                        <p className="task-summary-card__task-name">
                            {firstTask?.title || firstTask?.name}
                        </p>
                        
                        <p className="task-summary-card__reward">
                            +{firstTask?.coins ?? 10}
                            <img className="task-summary-card__coin-icon" src={coin} alt="Moneda" />
                        </p>
                    </>
                ) : (
                    /* Mensaje de estado vacío */
                    <p className="task-summary-card__task-name" style={{ opacity: 0.7 }}>
                        ¡Todo listo por hoy! 🎉
                    </p>
                )}
            </div>
        </>
    );
};