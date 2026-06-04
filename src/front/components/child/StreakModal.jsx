import React from "react";
import PropTypes from "prop-types";
import monedas from "../../assets/img/monedas3.png";

export const StreakModal = ({ child, onClose }) => {
    const streakText = child?.streak === 1 ? "día" : "días";
    return (
        <div className="task-modal__overlay" onClick={onClose}>
            <div className="task-modal streak-modal" onClick={e => e.stopPropagation()}>
                <button className="task-modal__close" onClick={onClose}>✕</button>
                <h2 className="task-modal__title">Racha diaria</h2>

                <div className="streak-modal__content">
                    <div className="streak-modal__header">
                        <div className="streak-modal__emoji">🔥</div>
                        <div>
                            <p className="streak-modal__subhead">Tu racha actual</p>
                            <h3>{child?.streak ?? 0} {streakText} seguidos</h3>
                        </div>
                    </div>

                    <div className="streak-modal__info">
                        <p>Cada día que cumples tus tareas, ganas un bonus diario extra.</p>
                        <p>Esta racha te ayuda a llegar más rápido a tu gran premio.</p>
                    </div>

                    <div className="streak-modal__progress">
                        <div className="progress-track progress-track--large">
                            <div className="progress-fill progress-fill--goal" style={{ width: `${Math.min((child?.streak || 0) * 14, 100)}%` }}></div>
                        </div>
                        <p className="streak-modal__progress-text">Sigue acumulando días para ganar más monedas.</p>
                    </div>

                    <div className="streak-modal__bonus">
                        <img src={monedas} alt="Monedas bonus" />
                        <p>Bonus diario: <strong>+10 monedas</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

StreakModal.propTypes = {
    child: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
};
