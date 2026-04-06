import React, { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import "./ChildWizard.css";

export const ChildSmallGoals = ({ onBack, onNextStep, step }) => {
    // Iniciamos directamente con los cupones base en la lista de "Añadidos"
    const [addedRewards, setAddedRewards] = useState([
        { id: 1, name: "30 min de videojuegos", coins: 50 },
        { id: 2, name: "Elegir la cena del viernes", coins: 100 },
        { id: 3, name: "Dormir 30 min más tarde", coins: 150 },
        { id: 4, name: "Ir al parque el finde", coins: 80 },
    ]);

    const [newRewardName, setNewRewardName] = useState("");
    const [newRewardCoins, setNewRewardCoins] = useState(50);

    // Añadir directamente a la lista final
    const addNewReward = () => {
        if (!newRewardName.trim()) return;
        const newR = {
            id: Date.now(),
            name: newRewardName,
            coins: parseInt(newRewardCoins) || 50
        };
        setAddedRewards([newR, ...addedRewards]);
        setNewRewardName("");
        setNewRewardCoins(50);
    };

    // Borrar cupón directamente de la lista
    const removeReward = (id) => {
        setAddedRewards(addedRewards.filter(r => r.id !== id));
    };

    const handleNext = () => {
        const formattedRewards = addedRewards.map(r => ({
            name: r.name,
            coins: r.coins
        }));
        onNextStep(formattedRewards);
    };

    return (
        <div className="wizard-step-wrapper animate__animated animate__fadeIn">
            
            {/* CABECERA */}
            <div className="wizard-header">
                <h2 className="wizard-title">Crear Cupones</h2>
                
                <div className="task-input-row">
                    <input
                        type="text"
                        className="wizard-input"
                        style={{ flex: 1 }}
                        placeholder="Nuevo cupón (ej: Un helado)"
                        value={newRewardName}
                        onChange={(e) => setNewRewardName(e.target.value)}
                    />
                    <div className="task-coin-input-wrapper">
                        <span>🪙</span>
                        <input
                            type="number"
                            className="task-coin-input"
                            value={newRewardCoins}
                            onChange={(e) => setNewRewardCoins(e.target.value)}
                        />
                    </div>
                    <button onClick={addNewReward} className="btn-next" style={{ width: "auto", padding: "0 25px" }}>
                        Añadir
                    </button>
                </div>
            </div>

            {/* CUERPO CENTRAL (Lista única) */}
            <div className="wizard-body">
                <label className="wizard-label task-list-label">
                    ✅ CUPONES ACTIVOS ({addedRewards.length})
                </label>
                
                {addedRewards.length === 0 && (
                    <p className="empty-tasks-msg">Añade cupones para que el niño pueda canjearlos</p>
                )}
                
                {addedRewards.map((r) => (
                    <div key={r.id} className="task-item">
                        <span className="task-name">{r.name}</span>
                        <div className="task-coins-display" style={{marginRight: "15px"}}>
                            🪙 {r.coins}
                        </div>
                        <button onClick={() => removeReward(r.id)} className="btn-delete-task">
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            {/* PIE FIJO */}
            <div className="wizard-footer">
                <p className="footer-suggestion">💡 Sugerencia: 20 🪙 = 1€</p>
                <ProgressBar step={step} />
                <div className="footer-buttons">
                    <button onClick={onBack} className="btn-back">Atrás</button>
                    <button onClick={handleNext} className="btn-next" disabled={addedRewards.length === 0}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};