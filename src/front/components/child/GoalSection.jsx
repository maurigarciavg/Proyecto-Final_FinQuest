import React from "react";
import monedas from "../../assets/img/monedas.png";
import { getGrandPrizeIcon } from "../../utils/getTaskIcon";

export const GoalSection = ({ child, onPrizeClick, onMinigameClick, onRedeemPrize }) => {
    const grandPrize = child.grand_prize;
    const totalCoins = child.total_coins ?? 0;
    const prizeCoins = grandPrize?.coins ?? 0;
    const progress = prizeCoins > 0 ? Math.min(Math.round((totalCoins / prizeCoins) * 100), 100) : 0;
    const prizeIconUrl = grandPrize?.image_url?.startsWith("http") ? grandPrize.image_url : null;
    const prizeEmoji = !prizeIconUrl ? getGrandPrizeIcon(grandPrize?.name) : null;

    const canRedeem = progress >= 100 && !grandPrize?.redeemed;

    return (
        <section className="goal-card">
            <h2 className="goal-card__title" style={{ marginBottom: "20px", paddingLeft: "10px" }}>Gran Premio</h2>

            <div className="goal-card__box--main" onClick={onPrizeClick} role={onPrizeClick ? "button" : undefined} tabIndex={onPrizeClick ? 0 : undefined}>
                <p className="goal-card__name">{grandPrize?.name || "Tu Próxima Meta"}</p>

                <div className="goal-card__hero">
                    {prizeIconUrl ? (
                        <img
                            className="goal-card__image"
                            src={prizeIconUrl}
                            alt="Premio"
                        />
                    ) : (
                        <div className="goal-card__emoji">{prizeEmoji}</div>
                    )}
                    <div className="goal-card__price">
                        <span className="goal-card__price-number">{prizeCoins.toLocaleString()}</span>
                    </div>
                </div>

                <div className="goal-card__progress-row" style={{ width: '100%' }}>
                    <div className="progress-track progress-track--large">
                        <div className="progress-fill progress-fill--goal" style={{ width: `${progress}%` }}></div>
                    </div>
                    <img className="goal-card__coins-image" src={monedas} alt="Coins" style={{ width: '60px' }} />
                </div>

                <p className="goal-card__progress-text">
                    ¡Llevas el <strong>{progress}%</strong> conseguido!
                </p>

                {canRedeem ? (
                    <button onClick={onRedeemPrize} className="goal-card__redeem-btn">
                        🎁 ¡CANJEAR MI RECOMPENSA!
                    </button>
                ) : grandPrize?.redeemed ? (
                    <div className="goal-card__redeemed-msg">🏆 ¡PREMIO CONSEGUIDO!</div>
                ) : (
                    <p className="goal-card__hint">Sigue esforzándote para conseguir tu meta.</p>
                )}
            </div>

            <div className="card-hover-effect" onClick={onMinigameClick} style={{ marginTop: "22px", textAlign: "center" }}>
                <h2 className="dashboard-placeholder__title">¡Bonus! 🎮</h2>
                <p className="task-summary-card__task-name" style={{ fontWeight: '700', margin: "10px 0" }}>
                    Minijuego de Memoria
                </p>
                <p className="goal-card__hint" style={{ margin: 0, color: '#20b8a7' }}>
                    Gana +30 monedas
                </p>
            </div>
        </section>
    );
};
