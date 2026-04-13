import React, { useState } from "react";
import { ProgressBar } from "./ProgressBar";
// Importamos el avatar por defecto (puedes elegir el que prefieras de los 4)
import defaultAvatar from "../../assets/img/Profiles/Children/child_9.png";
import "./ChildWizard.css";

export const ChildSmallGoals = ({ onBack, onNextStep, step, formData }) => {

    // 🟢 Extraemos el avatar seleccionado en el paso 1 desde el formData
    const selectedAvatar = formData?.child?.child?.avatar || formData?.child?.avatar || defaultAvatar;
    const childName = formData?.child?.child?.name || formData?.child?.name || "Niño/a";

    const [addedRewards, setAddedRewards] = useState([
        { id: 1, name: "30 min de videojuegos", coins: 50 },
        { id: 2, name: "Elegir la cena del viernes", coins: 100 },
        { id: 3, name: "Dormir 30 min más tarde", coins: 150 },
        { id: 4, name: "Ir al parque el finde", coins: 80 },
    ]);

    const [newRewardName, setNewRewardName] = useState("");
    const [newRewardCoins, setNewRewardCoins] = useState("");

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

    const removeReward = (id) => {
        setAddedRewards(addedRewards.filter(r => r.id !== id));
    };

    const handleNext = () => {
        const formattedRewards = addedRewards.map(r => ({
            name: r.name,
            coins: parseInt(r.coins),
            // Si tu backend pide una imagen para los cupones, añade una por defecto aquí
            image_url: ""
        }));
        onNextStep(formattedRewards);
    };

    return (
        <div className="wizard-step-wrapper animate__animated animate__fadeIn">

            {/* CABECERA */}
            <div className="wizard-header">

                {/* 🟢 AHORA MUESTRA EL AVATAR ELEGIDO POR EL PADRE */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    <img
                        src={selectedAvatar}
                        alt="Avatar"
                        style={{
                            width: "65px",
                            height: "65px",
                            borderRadius: "50%",
                            border: "3px solid #32a89b",
                            objectFit: "cover",
                            boxShadow: "0 4px 10px rgba(50, 168, 155, 0.2)"
                        }}
                        // Si la ruta falla, ponemos el avatar por defecto
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>

                {/* Título justo debajo */}
                <h2 className="wizard-title" style={{ marginBottom: "25px" }}>Crear Cupones para {childName}</h2>

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
                            placeholder="50"
                            value={newRewardCoins}
                            onChange={(e) => setNewRewardCoins(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={addNewReward}
                        className="btn-next"
                        style={{ width: "auto", padding: "0 25px", height: "55px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        Añadir
                    </button>
                </div>
            </div>

            {/* CUERPO CENTRAL */}
            <div className="wizard-body">
                <label className="wizard-label task-list-label">
                    ✅ CUPONES ACTIVOS ({addedRewards.length})
                </label>

                {addedRewards.length === 0 && (
                    <p className="empty-tasks-msg">Añade cupones para que el niño pueda canjearlos</p>
                )}

                {/* ... dentro del map de addedRewards ... */}
                {addedRewards.map((r) => (
                    <div key={r.id} className="task-item">
                        <span className="task-name">{r.name}</span>
                        <div className="task-coins-display" style={{ marginRight: "15px" }}>
                            🪙 {r.coins}
                        </div>
                        <button onClick={() => removeReward(r.id)} className="btn-delete-task">
                            <i className="fa-solid fa-trash text-red"></i>
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

