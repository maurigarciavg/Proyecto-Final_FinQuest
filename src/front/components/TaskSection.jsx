import React from "react";
import tareasImg from "../assets/img/Tareas de casa.png";
import coin from "../assets/img/coin.png";
import { getTaskIcon } from "../Utils/getTaskIcon";

export const TaskSection = ({ tasks }) => {
    const tasksToday = tasks?.filter(t => t.is_today) || [];
    const firstTask = tasksToday[0];
    const taskEmoji = getTaskIcon(firstTask?.title || firstTask?.name);

    return (
        <>
            <div className="task-summary-card__header">
              
                
                <div className="task-summary-card__label-container">
                    <span className="task-summary-card__badge" style={{ backgroundColor: '#a978df' }}>
                        {tasksToday.length}
                    </span>
                    <h2 className="task-summary-card__title">Tareas</h2>
                </div>
            </div>

            <div className="task-summary-card__content">
                <img 
                    className="task-summary-card__image" 
                    src={tareasImg} 
                    alt="Tareas de casa" 
                />
                
                <p className="task-summary-card__task-name">
                    {firstTask?.title || firstTask?.name || "Pasear al perro"}
                </p>

                <p className="task-summary-card__reward">
                    +{firstTask?.coins || 10} 
                    <img className="task-summary-card__coin-icon" src={coin} alt="Moneda" />
                </p>
            </div>
        </>
    );
};