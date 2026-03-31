import React from "react";

export const GoalSection = ({ child }) => {
    return (
        <section className="goal-card">
            <h2 className="goal-card__title">Gran Premio</h2>

            <div className="goal-card__box">
                <p className="goal-card__name">{child.goal}</p>

                <div className="goal-card__hero">
                    <div className="goal-card__image">🎮</div>

                    <div className="goal-card__price">
                        <span className="goal-card__price-number">10.000</span>
                        <span className="goal-card__price-label">Monedas</span>
                    </div>
                </div>

                <div className="progress-track progress-track--large">
                    <div
                        className="progress-fill progress-fill--goal"
                        style={{ width: `${child.progress}%` }}
                    ></div>
                </div>

                <p className="goal-card__progress-text">
                    <strong>{child.progress}%</strong> completado
                </p>

                <p className="goal-card__hint">
                    Sigue completando tareas para acercarte a tu meta.
                </p>

                <button className="goal-card__button">Ver más detalles</button>
            </div>
        </section>
    );
};