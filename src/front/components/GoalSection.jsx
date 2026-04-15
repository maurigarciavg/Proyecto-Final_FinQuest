import React from "react";
import monedas from "../assets/img/monedas.png";

export const GoalSection = ({ child }) => {
    const grandPrize = child.grand_prize;
    const totalCoins = child.total_coins ?? 0;
    const prizeCoins = grandPrize?.coins ?? 0;
    const progress = prizeCoins > 0 ? Math.min(Math.round((totalCoins / prizeCoins) * 100), 100) : 0;

    return (
        <section className="goal-card">
            <h2 className="goal-card__title">Gran Premio</h2>

            <div className="goal-card__box">
                <p className="goal-card__name">{grandPrize?.name || "Sin gran premio"}</p>

                <div className="goal-card__hero">
                    <img
                        className="goal-card__image"
                        src={grandPrize?.image_url?.startsWith("http") ? grandPrize.image_url : "https://cdn-icons-png.flaticon.com/512/3112/3112946.png"}
                        alt={grandPrize?.name || "Gran Premio"}
                    />
                    <div className="goal-card__price">
                        <span className="goal-card__price-number">{prizeCoins.toLocaleString()}</span>
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
                    <strong>{progress}%</strong> completado — {totalCoins.toLocaleString()} / {prizeCoins.toLocaleString()} monedas
                </p>

                <p className="goal-card__hint">
                    Sigue completando tareas para acercarte a tu meta.
                </p>

                <div className="goal-card__minigame">
                    <p className="goal-card__minigame-label">🎮 Minijuego</p>
                    <p className="goal-card__minigame-hint">Próximamente...</p>
                </div>
            </div>
        </section>
    );
};