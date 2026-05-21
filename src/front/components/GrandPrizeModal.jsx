import React from "react";
import PropTypes from "prop-types";
import monedas from "../assets/img/monedas.png";
import { getGrandPrizeIcon } from "../Utils/getTaskIcon";

export const GrandPrizeModal = ({ grandPrize, coins, onClose, onRedeem }) => {
    const prizeIcon = grandPrize?.image_url?.startsWith("http")
        ? grandPrize.image_url
        : null;
    const prizeEmoji = !prizeIcon ? getGrandPrizeIcon(grandPrize?.name) : null;
    const prizeCoins = grandPrize?.coins ?? 0;
    const progress = prizeCoins > 0 ? Math.min(Math.round((coins / prizeCoins) * 100), 100) : 0;
    const canRedeem = progress >= 100 && !grandPrize?.redeemed;

    return (
        <div className="task-modal__overlay" onClick={onClose}>
            <div className="task-modal grand-prize-modal" onClick={e => e.stopPropagation()}>
                <button className="task-modal__close" onClick={onClose}>✕</button>
                <h2 className="task-modal__title">Gran Premio</h2>

                <div className="grand-prize-modal__content">
                    <div className="grand-prize-modal__hero">
                        <div className="grand-prize-modal__icon">
                            {prizeIcon ? (
                                <img src={prizeIcon} alt={grandPrize?.name || "Gran Premio"} />
                            ) : (
                                <span>{prizeEmoji}</span>
                            )}
                        </div>

                        <div className="grand-prize-modal__info">
                            <p className="grand-prize-modal__name">{grandPrize?.name || "Tu gran premio"}</p>
                            <p className="grand-prize-modal__coins">Necesitas <strong>{prizeCoins}</strong> monedas</p>
                            <div className="progress-track progress-track--large grand-prize-modal__progress">
                                <div className="progress-fill progress-fill--goal" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="grand-prize-modal__progress-text">Llevas <strong>{progress}%</strong> para conseguirlo.</p>
                        </div>
                    </div>

                    <div className="grand-prize-modal__hint">
                        <p>Cuando consigas todas las monedas, puedes canjear tu premio aquí mismo.</p>
                        <p>¡Sigue sumando puntos haciendo tareas y jugando!</p>
                    </div>

                    {grandPrize?.redeemed ? (
                        <div className="goal-card__redeemed-msg">🏆 Premio ya canjeado</div>
                    ) : canRedeem ? (
                        <button className="goal-card__redeem-btn" onClick={onRedeem}>
                            🎁 Canjear premio ahora
                        </button>
                    ) : (
                        <button className="goal-card__redeem-btn goal-card__redeem-btn--disabled" disabled>
                            Sigue sumando monedas
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

GrandPrizeModal.propTypes = {
    grandPrize: PropTypes.object,
    coins: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onRedeem: PropTypes.func.isRequired
};
