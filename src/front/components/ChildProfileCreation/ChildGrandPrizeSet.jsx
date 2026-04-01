import React, { useState } from "react";

/**
 * PASO 4: Configuración del Gran Premio (Final del Wizard)
 */
export const ChildGrandPrizeSet = ({ onBack, onNextStep }) => {
    const [goalName, setGoalName] = useState("");
    const [goalAmount, setGoalAmount] = useState(10);
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("🏆 Gran Premio Final:", { goalName, goalAmount, image });
        onNextStep({ goalName, goalAmount, image });
    };

    return (
        <div className="card shadow-lg border-0 p-4 h-100 w-100 d-flex flex-column animate__animated animate__fadeIn"
            style={{ borderRadius: "30px", backgroundColor: "#f0fdfa" }}>

            <style>
                {`
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                `}
            </style>

            <h2 className="text-center fw-bold mb-4" style={{ color: "#32a89b" }}>Crear Gran Premio</h2>

            <form onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column">

                <div className="d-flex gap-2 mb-4">
                    <input
                        type="text"
                        className="form-control rounded-pill border-0 shadow-sm px-4 flex-grow-1"
                        style={{ height: "50px", border: "2px solid #32a89b" }}
                        placeholder="Gran premio"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        required
                    />

                    <div className="d-flex align-items-center bg-white rounded-pill shadow-sm px-3"
                        style={{ border: "2px solid #32a89b", height: "50px", width: "220px" }}>
                        <input
                            type="number"
                            className="form-control border-0 bg-transparent text-center fw-bold p-0"
                            style={{ color: "#32a89b", outline: "none", boxShadow: "none" }}
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                        />
                        <span style={{ fontSize: "1.2rem", marginLeft: "5px" }}>🪙</span>
                    </div>
                </div>

                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center mb-3"
                    style={{
                        border: "2px dashed #ccc",
                        borderRadius: "20px",
                        backgroundColor: "transparent",
                        cursor: "pointer"
                    }}>
                    <div className="text-center">
                        <button type="button" className="btn btn-outline-info rounded-pill px-4 fw-bold mb-2"
                            style={{ color: "#32a89b", borderColor: "#32a89b" }}>
                            ↑ Añadir imagen
                        </button>
                        <p className="text-muted small">Máximo 1 MB de tamaño</p>
                    </div>
                </div>

                <p className="text-start small text-secondary px-2 mb-4" style={{ lineHeight: "1.2" }}>
                    Valor sugerido: 20 🪙 = 1 €. Definir un valor que motive a cumplir objetivos.
                </p>

                <div className="d-flex gap-3">
                    <button
                        type="button"
                        className="btn btn-outline-info rounded-pill w-50 fw-bold p-3"
                        style={{ color: "#32a89b", borderColor: "#32a89b", backgroundColor: "white" }}
                        onClick={onBack}
                    >
                        Atrás
                    </button>
                    <button
                        type="submit"
                        className="btn text-white rounded-pill w-50 fw-bold shadow-sm p-3"
                        style={{ backgroundColor: "#32a89b" }}
                        disabled={!goalName || !goalAmount}
                    >
                        Finalizar
                    </button>
                </div>
            </form>
        </div>
    );
};