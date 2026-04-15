import React from "react";
import { getTaskIcon } from "../Utils/getTaskIcon"; // Importa tu función
import coin from "../assets/img/coin.png";

export const TaskSection = ({ tasks }) => {
    const firstTask = tasks?.[0];
    // Obtenemos el emoji dinámico basado en el título
    const taskEmoji = getTaskIcon(firstTask?.title || firstTask?.name);

    return (
        <div className="task-summary-card">
            <div className="task-summary-card__header">
                <span className="task-summary-card__badge">{tasks?.length || 0}</span>
                <h2 className="task-summary-card__title">Tareas de casa</h2>
            </div>

            <div className="task-summary-card__content">
                {/* 🟢 Cambio: Usamos un span con el emoji en lugar del <img> del perro */}
                <div className="task-summary-card__emoji-container" style={{ fontSize: "3.5rem", marginBottom: "10px" }}>
                    {taskEmoji}
                </div>

                <p className="task-summary-card__task-name">
                    {firstTask?.title || firstTask?.name || "Pasear al perro"}
                </p>

                <p className="task-summary-card__reward">
                    +{firstTask?.coins ?? 10}
                    <img
                        className="task-summary-card__coin-icon"
                        src={coin}
                        alt="Moneda"
                    />
                </p>
            </div>
        </div>
    );
};