import React from "react";
import consola from "../assets/img/switch.png";
import monedas from "../assets/img/monedas.png";

export const GoalSection = ({ child }) => {
    const progress = child.progress ?? 84;

    return (
        <section className="goal-card">
            <h2 className="goal-card__title">Gran Premio</h2>

            <div className="goal-card__box">
                <p className="goal-card__name">{child.goal || "Nintendo Switch"}</p>

                <div className="goal-card__hero">
                    <img
                        className="goal-card__image"
                        src={consola}
                        alt={child.goal || "Nintendo Switch"}
                    />

                    <div className="goal-card__price">
                        <span className="goal-card__price-number">10.000</span>
                        <span className="goal-card__price-label">Monedas</span>
                    </div>
                </div>

                <div className="goal-card__progress-row">
                    <div className="progress-track progress-track--large">
                        <div
                            className="progress-fill progress-fill--goal"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <img
                        className="goal-card__coins-image"
                        src={monedas}
                        alt="Monedas"
                    />
                </div>

                <p className="goal-card__progress-text">
                    <strong>{progress}%</strong> completado
                </p>

                <p className="goal-card__hint">
                    Sigue completando tareas para acercarte a tu meta.
                </p>

                <button className="goal-card__button">Ver más detalles</button>
            </div>
        </section>
    );
};