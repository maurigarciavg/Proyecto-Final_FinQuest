import React from "react";
import { getCouponIcon } from "../Utils/getTaskIcon";

export const RewardModal = ({ rewards, coins, onClose, onRedeem }) => {
    return (
        <div className="task-modal__overlay" onClick={onClose}>
            <div className="task-modal" onClick={e => e.stopPropagation()}>
                <button className="task-modal__close" onClick={onClose}>✕</button>

                <h2 className="task-modal__title">Cupones</h2>

                <div className="task-modal__grid">
                    {rewards && rewards.length > 0 ? (
                        rewards.map(reward => (
                            <div key={reward.id} className="task-modal__item">
                                <span className="task-modal__item-image">{getCouponIcon(reward.name)}</span>

                                <div className="task-modal__item-info">
                                    <p className="task-modal__item-name">{reward.name}</p>
                                    <p className="task-modal__item-coins">🪙 -{reward.coins}</p>
                                </div>

                                <button
                                    className={`task-modal__item-btn ${coins < reward.coins
                                            ? "task-modal__item-btn--disabled"
                                            : ""
                                        }`}
                                    onClick={() => {
                                        if (coins >= reward.coins) {
                                            onRedeem(reward.id);
                                        }
                                    }}
                                    disabled={coins < reward.coins}
                                    title={
                                        coins < reward.coins
                                            ? `Necesitas ${reward.coins - coins} monedas más`
                                            : "Canjear cupón"
                                    }
                                >
                                    {coins >= reward.coins ? "✓" : "✗"}
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