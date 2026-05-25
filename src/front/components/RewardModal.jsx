import React from "react";
import { getCouponIcon } from "../Utils/getTaskIcon";

export const RewardModal = ({ rewards, coins, onClose, onRedeem }) => {
    return (
        <div className="task-modal__overlay" onClick={onClose}>
            <div className="task-modal" onClick={e => e.stopPropagation()}>
                <button className="task-modal__close" onClick={onClose}>✕</button>

                <h2 className="task-modal__title">Tienda de Premios</h2>

                <div className="task-modal__grid">
                    {rewards && rewards.length > 0 ? (
                        rewards.map(reward => {
                            const isPending = reward.status === "pending";
                            const isApproved = reward.status === "approved";
                            const canRedeem = !isPending && !isApproved && coins >= reward.coins;
                            return (
                            <div
                            key={reward.id}
                            className={`task-modal__item ${canRedeem ? "task-modal__item--clickable" : ""}`}
                            onClick={() => { if (canRedeem) onRedeem(reward.id); }}
                            role={canRedeem ? "button" : undefined}
                            tabIndex={canRedeem ? 0 : undefined}
                        >
                                <span className="task-modal__item-image" style={{ fontSize: "2.5rem" }}>
                                    {getCouponIcon(reward.name)}
                                </span>

                                <div className="task-modal__item-info">
                                    <p className="task-modal__item-name">{reward.name}</p>
                                    <p className="task-modal__item-coins">🪙 {reward.coins}</p>
                                    <p className="task-modal__item-hint">
                                        {isPending ? "Pendiente de aprobación" : isApproved ? "Ya aprobado" : coins < reward.coins ? `Necesitas ${reward.coins - coins} monedas más` : "Pulsa para canjear"}
                                    </p>
                                </div>

                                <button
                                    className={`task-modal__item-btn ${
                                        isPending || isApproved ? "task-modal__item-btn--disabled"
                                        : coins < reward.coins ? "task-modal__item-btn--disabled"
                                        : ""
                                    }`}
                                    onClick={() => { if (canRedeem) onRedeem(reward.id); }}
                                    disabled={!canRedeem}
                                    title={
                                        isPending ? "Esperando aprobación de papá/mamá"
                                        : isApproved ? "Ya aprobado"
                                        : coins < reward.coins ? `Necesitas ${reward.coins - coins} monedas más`
                                        : "Canjear cupón"
                                    }
                                >
                                    {isPending ? "⏳" : isApproved ? "✅" : canRedeem ? "🎁" : "🔒"}
                                </button>
                            </div>
                            );
                        })
                    ) : (
                        <p style={{ textAlign: "center", gridColumn: "1/-1", padding: "20px" }}>
                            No hay cupones disponibles en este momento.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
//editar