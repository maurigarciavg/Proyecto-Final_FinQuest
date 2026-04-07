import React from "react";

export const RewardModal = ({ rewards, coins, onClose, onRedeem }) => {
    return (
        <div className="task-modal__overlay" onClick={onClose}>
            <div className="task-modal" onClick={e => e.stopPropagation()}>
                <button className="task-modal__close" onClick={onClose}>✕</button>

                <h2 className="task-modal__title">Tienda de recompensas 🎟️</h2>

                <div className="task-modal__grid">
                    {rewards && rewards.length > 0 ? (
                        rewards.map(reward => (
                            <div key={reward.id} className="task-modal__item">
                                <div className="task-modal__item-image">🎁</div>
                                <p className="task-modal__item-name">{reward.title}</p>
                                <p className="task-modal__item-coins">🪙 {reward.cost}</p>
                                <button
                                    className={`task-modal__item-btn ${coins < reward.cost ? "task-modal__item-btn--disabled" : ""}`}
                                    onClick={() => coins >= reward.cost && onRedeem(reward.id)}
                                    disabled={coins < reward.cost}
                                >
                                    {coins >= reward.cost ? "✓" : "✗"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Sin recompensas disponibles</p>
                    )}
                </div>
            </div>
        </div>
    );
};