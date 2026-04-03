import React, { useState } from "react";

export const ChildSmallGoals = ({ onBack, onNextStep }) => {
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
        // Mapeamos para enviar solo lo que el Backend necesita
        const formattedRewards = addedRewards.map(r => ({
            name: r.name,
            coins: r.coins
        }));
        onNextStep(formattedRewards);
    };

    return (
        <div className="card shadow-lg border-0 p-4 w-100 h-100 d-flex flex-column"
            style={{ borderRadius: "30px", backgroundColor: "#f0fdfa" }}>

            <style>
                {`
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                `}
            </style>

            <h2 className="text-center fw-bold mb-4" style={{ color: "#32a89b" }}>Metas a Corto Plazo</h2>
            <p className="text-center small text-secondary mb-4">¿Qué premios puede canjear con sus monedas?</p>

            <div className="d-flex gap-2 mb-4 align-items-center">
                <input
                    type="text"
                    className="form-control rounded-pill px-4 shadow-sm flex-grow-1"
                    style={{ border: "2px solid #32a89b", height: "50px" }}
                    placeholder="Nuevo premio"
                    value={newRewardName}
                    onChange={(e) => setNewRewardName(e.target.value)}
                />

                <div className="d-flex align-items-center bg-white rounded-pill shadow-sm ps-3 pe-2"
                    style={{ border: "2px solid #32a89b", height: "50px", width: "140px" }}>
                    <span>🪙</span>
                    <input
                        type="number"
                        className="form-control border-0 bg-transparent text-center fw-bold p-0"
                        style={{ color: "#32a89b" }}
                        value={newRewardCoins}
                        onChange={(e) => setNewRewardCoins(e.target.value)}
                    />
                </div>

                <button onClick={addNewReward} className="btn text-white rounded-pill px-4 fw-bold shadow-sm" style={{ backgroundColor: "#32a89b", height: "50px" }}>
                    Añadir
                </button>
            </div>

            <div className="overflow-auto mb-3 pe-2" style={{ maxHeight: "200px" }}>
                <p className="small fw-bold text-secondary text-start mb-2 uppercase">Sugerencias</p>
                {suggestions.map((r) => (
                    <div key={r.id} className="d-flex align-items-center mb-2 gap-2 bg-white rounded-pill p-1 shadow-sm border border-light">
                        <span className="flex-grow-1 ms-3 text-start small fw-semibold text-secondary">{r.name}</span>
                        <div className="fw-bold me-2 small" style={{ color: "#f39c12" }}>🪙+{r.coins}</div>
                        <button onClick={() => confirmReward(r.id)} className="btn btn-sm btn-success rounded-circle fw-bold me-1 shadow-sm">+</button>
                    </div>
                ))}
            </div>

            <div className="flex-grow-1 border-top pt-3 overflow-auto">
                <p className="small fw-bold text-success text-start mb-2">🎁 PREMIOS ACTIVOS ({addedRewards.length})</p>
                {addedRewards.map((r, index) => (
                    <div key={index} className="d-flex align-items-center mb-2 gap-2 bg-success bg-opacity-10 rounded-pill p-2">
                        <span className="flex-grow-1 ms-3 text-start fw-bold text-success small">{r.name}</span>
                        <span className="text-danger fw-bold cursor-pointer me-3" onClick={() => revertReward(index)}>🗑️</span>
                    </div>
                ))}
            </div>

            <div className="d-flex gap-3 mt-4">
                <button onClick={onBack} className="btn btn-outline-secondary rounded-pill w-50 p-3 fw-bold">Atrás</button>
                <button onClick={handleNext} className="btn text-white rounded-pill w-50 p-3 fw-bold shadow-sm" style={{ backgroundColor: "#32a89b" }} disabled={addedRewards.length === 0}>
                    Siguiente
                </button>
            </div>
        </div>
    );
};