import React from "react";
 
export const RewardModal = ({ rewards, coins, onClose, onRedeem }) => {
    return (
        <div className="task-modal__overlay" onClick={onClose}>
            <div className="task-modal" onClick={e => e.stopPropagation()}>
                <button className="task-modal__close" onClick={onClose}>✕</button>
 
                <h2 className="task-modal__title">Cupones 🎟️</h2>
 
                <div className="task-modal__grid">
                    {rewards && rewards.length > 0 ? (
                        rewards.map(reward => (
                            <div key={reward.id} className="task-modal__item">
                                <div className="task-modal__item-image">🎁</div>
 
                                <div className="task-modal__item-info">
                                    {/* ✅ FIX: era reward.title, el modelo serializa "name" */}
                                    <p className="task-modal__item-name">{reward.name}</p>
                                    <p className="task-modal__item-coins">🪙 -{reward.cost}</p>
                                </div>
 
                                <button
                                    className={`task-modal__item-btn ${
                                        coins < reward.cost
                                            ? "task-modal__item-btn--disabled"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (coins >= reward.cost) {
                                            onRedeem(reward.id);
                                        }
                                    }}
                                    disabled={coins < reward.cost}
                                    title={
                                        coins < reward.cost
                                            ? `Necesitas ${reward.cost - coins} monedas más`
                                            : "Canjear cupón"
                                    }
                                >
                                    {coins >= reward.cost ? "✓" : "✗"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Sin cupones disponibles</p>
                    )}
                </div>
            </div>
        </div>
    );
};