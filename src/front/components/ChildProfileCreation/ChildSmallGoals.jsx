import React, { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import "./ChildWizard.css";

export const ChildSmallGoals = ({ onBack, onNextStep, step }) => {
    const [suggestions, setSuggestions] = useState([
        { id: 1, name: "30 min de videojuegos", coins: 50 },
        { id: 2, name: "Elegir la cena del viernes", coins: 100 },
        { id: 3, name: "Dormir 30 min más tarde", coins: 150 },
        { id: 4, name: "Ir al parque el finde", coins: 80 },
    ]);

    const [addedRewards, setAddedRewards] = useState([]);
    const [newRewardName, setNewRewardName] = useState("");
    const [newRewardCoins, setNewRewardCoins] = useState(50);

    const addNewReward = () => {
        if (!newRewardName.trim()) return;
        const newR = {
            id: Date.now(),
            name: newRewardName,
            coins: parseInt(newRewardCoins) || 50
        };
        setSuggestions([newR, ...suggestions]);
        setNewRewardName("");
        setNewRewardCoins(50);
    };

    const confirmReward = (id) => {
        const rewardToMove = suggestions.find(r => r.id === id);
        setAddedRewards([...addedRewards, rewardToMove]);
        setSuggestions(suggestions.filter(r => r.id !== id));
    };

    const revertReward = (index) => {
        const rewardToRevert = addedRewards[index];
        setSuggestions([rewardToRevert, ...suggestions]);
        setAddedRewards(addedRewards.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        const formattedRewards = addedRewards.map(r => ({
            name: r.name,
            coins: r.coins
        }));
        onNextStep(formattedRewards);
    };

    return (
        <div className="d-flex flex-column h-100 w-100 animate__animated animate__fadeIn">
            <style>
                {`
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                `}
            </style>

            {/* CABECERA: Igual que TaskSetting (px-4 pt-3) */}
            <div className="px-4 pt-3">
                <h2 className="wizard-title mb-4">Crear Cupones</h2>
                
                <div className="d-flex gap-2 mb-3 align-items-center">
                    <input
                        type="text"
                        className="form-control rounded-pill px-4 shadow-sm flex-grow-1"
                        style={{ border: "2px solid #32a89b", height: "50px" }}
                        placeholder="Nuevo cupón (ej: Un helado)"
                        value={newRewardName}
                        onChange={(e) => setNewRewardName(e.target.value)}
                    />

                    <div className="d-flex align-items-center bg-white rounded-pill shadow-sm ps-3 pe-2"
                        style={{ border: "2px solid #32a89b", height: "50px", width: "100px" }}>
                        <span style={{fontSize: "1.1rem"}}>🪙</span>
                        <input
                            type="number"
                            className="form-control border-0 bg-transparent text-center fw-bold p-0 shadow-none"
                            style={{ color: "#32a89b", width: "40px" }}
                            value={newRewardCoins}
                            onChange={(e) => setNewRewardCoins(e.target.value)}
                        />
                    </div>

                    <button onClick={addNewReward} className="btn-next shadow-sm" style={{ width: "auto", padding: "0 20px", height: "50px" }}>
                        Añadir
                    </button>
                </div>
            </div>

            {/* CUERPO CENTRAL: Igual que TaskSetting (maxHeight 330px) */}
            <div className="px-4 flex-grow-1 overflow-auto" style={{ maxHeight: "330px", marginBottom: "10px" }}>
                
                <p className="small fw-bold text-secondary text-start mb-2 text-uppercase" style={{fontSize: "0.7rem"}}>Sugerencias</p>
                {suggestions.map((r) => (
                    <div key={r.id} className="d-flex align-items-center mb-2 gap-2 bg-white rounded-pill p-1 shadow-sm border border-light">
                        <span className="flex-grow-1 ms-3 text-start small fw-semibold text-secondary" style={{fontSize: "0.8rem"}}>{r.name}</span>
                        <div className="fw-bold me-2 small" style={{ color: "#f39c12", fontSize: "0.8rem" }}>🪙 {r.coins}</div>
                        <button onClick={() => confirmReward(r.id)} className="btn btn-sm btn-success rounded-circle fw-bold me-1" style={{width: "24px", height: "24px", padding: "0"}}>+</button>
                    </div>
                ))}

                <div className="border-top mt-4 pt-3">
                    <p className="small fw-bold text-success text-start mb-3" style={{fontSize: "0.75rem"}}>
                        ✅ CUPONES ACTIVOS ({addedRewards.length})
                    </p>
                    {addedRewards.length === 0 && <p className="text-muted small italic text-start ps-2">Añade cupones para que el niño pueda canjearlos</p>}
                    {addedRewards.map((r, index) => (
                        <div key={index} className="d-flex align-items-center mb-2 gap-2 bg-success bg-opacity-10 rounded-pill p-2">
                            <span className="flex-grow-1 ms-3 text-start fw-bold text-success small" style={{fontSize: "0.8rem"}}>{r.name}</span>
                            <span className="fw-bold text-success small me-3" style={{fontSize: "0.7rem"}}>🪙 {r.coins}</span>
                            <span className="text-danger fw-bold me-3" style={{ cursor: "pointer" }} onClick={() => revertReward(index)}>🗑️</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* PIE FIJO: Quitamos clases extras para que mande el CSS .wizard-footer */}
            <div className="wizard-footer">
                <p className="text-center text-muted small mb-2" style={{ fontSize: "0.75rem" }}>
                    💡 Sugerencia: 20 🪙 = 1€
                </p>
                <ProgressBar step={step} />
                <div className="d-flex gap-3 mt-1">
                    <button onClick={onBack} className="btn-back">Atrás</button>
                    <button onClick={handleNext} className="btn-next shadow-sm" disabled={addedRewards.length === 0}>Siguiente</button>
                </div>
            </div>
        </div>
    );
};