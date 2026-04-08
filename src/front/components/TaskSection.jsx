import React from "react";
import perro from "../assets/img/perro2.png";
import coin from "../assets/img/coin.png";

export const TaskSection = ({ tasks }) => {
    const firstTask = tasks?.[0];

    return (
        <div className="task-summary-card">
            <div className="task-summary-card__header">
                <span className="task-summary-card__badge">2</span>
                <h2 className="task-summary-card__title">Tareas de casa</h2>
            </div>

            <div className="task-summary-card__content">
                <img
                    className="task-summary-card__image"
                    src={perro}
                    alt="Perro"
                />

                <p className="task-summary-card__task-name">
                    {firstTask?.title || "Pasear al perro"}
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