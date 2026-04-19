import React from "react";
import { getTaskIcon } from "../Utils/getTaskIcon"; 
import coin from "../assets/img/coin.png";
import tareasImg from "../assets/img/Tareas de casa.png";

export const TaskSection = ({ tasks }) => {
    const firstTask = tasks?.[0];
    const taskEmoji = getTaskIcon(firstTask?.title || firstTask?.name);

    return (
        <>
            <div className="task-summary-card__header">
                <span className="task-summary-card__badge">{tasks?.length || 0}</span>
                <h2 className="task-summary-card__title">Tareas de casa</h2>
            </div>

            <div className="task-summary-card__content">
                <img className="task-summary-card__image" src={tareasImg} alt="Tareas de casa" />

                <p className="task-summary-card__task-name">
                    {firstTask?.title || firstTask?.name || "Pasear al perro"}
                </p>
                <p className="task-summary-card__reward">
                    +{firstTask?.coins ?? 10}
                    <img className="task-summary-card__coin-icon" src={coin} alt="Moneda" />
                </p>
            </div>
        </>
    );
};