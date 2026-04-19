import React from "react";
import monedas from "../assets/img/monedas.png";

export const GoalSection = ({ child, onMinigameClick, onRedeemPrize }) => {
    const grandPrize = child.grand_prize;
    const totalCoins = child.total_coins ?? 0;
    const prizeCoins = grandPrize?.coins ?? 0;
    const progress = prizeCoins > 0 ? Math.min(Math.round((totalCoins / prizeCoins) * 100), 100) : 0;
    
    // Verificamos si ya puede canjearlo y si no está canjeado ya
    const canRedeem = progress >= 100 && !grandPrize?.redeemed;

    return (
        <section className="goal-card">
            <h2 className="goal-card__title">Gran Premio</h2>

            {/* TARJETA DEL PREMIO */}
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
                        <div className="progress-fill progress-fill--goal" style={{ width: `${progress}%` }}></div>
                    </div>
                    <img className="goal-card__coins-image" src={monedas} alt="Monedas" />
                </div>
                <p className="goal-card__progress-text">
                    <strong>{progress}%</strong> completado — {totalCoins.toLocaleString()} / {prizeCoins.toLocaleString()} monedas
                </p>
                
                {/* 🟢 BOTÓN DE CANJEAR: Solo aparece al llegar al 100% */}
                {canRedeem ? (
                    <button 
                        onClick={onRedeemPrize}
                        className="goal-card__redeem-btn"
                       
                        onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    >
                        🎁 ¡CANJEAR PREMIO!
                    </button>
                ) : grandPrize?.redeemed ? (
                    <p className="goal-card__hint" style={{ color: "#20b8a7", fontWeight: "bold", marginTop: "10px" }}>
                        ✅ ¡Premio canjeado! ¡Enhorabuena!
                    </p>
                ) : (
                    <p className="goal-card__hint">Sigue completando tareas para acercarte a tu meta.</p>
                )}
            </div>

            {/* TARJETA DEL MINIJUEGO */}
            <div
                className="goal-card__box"
                onClick={onMinigameClick}
                style={{ cursor: 'pointer', textAlign: 'center' }}
            >
                <h2 className="dashboard-placeholder__title">¡Bonus! 🎮</h2>
                <p className="task-summary-card__task-name" style={{ minHeight: 'auto', fontWeight: 'bold' }}>
                    Minijuego de Memoria
                </p>
                <p className="goal-card__hint" style={{ margin: 0 }}>
                    Gana +30 monedas
                </p>
            </div>
        </section>
    );
};