import React, { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import defaultAvatar from "../../assets/img/Profiles/Children/child_9.png";
import "./ChildWizard.css";

export const ChildGrandPrizeSet = ({ onBack, onNextStep, step, formData }) => {
    // Extraemos el avatar dinámico del paso 1
    const selectedAvatar = formData?.child?.child?.avatar || formData?.child?.avatar || defaultAvatar;

    const [goalName, setGoalName] = useState("");
    // Iniciamos en vacío para que se vea el placeholder
    const [goalAmount, setGoalAmount] = useState("");

    const handleFinalClick = () => {
        const finalAmount = parseInt(goalAmount);
        if (!goalName || isNaN(finalAmount) || finalAmount <= 0) return;

        onNextStep({
            name: goalName,
            coins: finalAmount,
            // Usamos un identificador estándar si no hay subida de imagen
            image_url: "trophy_default"
        });
    };

    // Calculamos el valor para mostrar, manejando el string vacío
    const displayAmount = parseInt(goalAmount) || 0;

    return (
        <div className="wizard-step-wrapper animate__animated animate__fadeIn">

            {/* CABECERA */}
            <div className="wizard-header">
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
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>
                <h2 className="wizard-title" style={{ marginBottom: "10px" }}>¡Gran Premio Final!</h2>
            </div>

            {/* CUERPO CENTRAL */}
            <div className="wizard-body">
                {/* FILA DE INPUTS ALINEADOS AL FONDO (flex-end) */}
                <div style={{ display: "flex", gap: "15px", marginBottom: "15px", alignItems: "flex-end" }}>
                    <div style={{ flex: "1" }}>
                        <label className="wizard-label">¿Cuál es la meta?</label>
                        <input
                            type="text"
                            className="wizard-input"
                            placeholder="Ej. Nintendo Switch"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                        />
                    </div>
                    {/* Contenedor de monedas sin label para alineación limpia */}
                    <div className="task-coin-input-wrapper prize-amount-input-wrapper" style={{ width: "130px" }}>
                        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <span>🪙</span>
                            <input
                                type="number"
                                className="task-coin-input prize-amount-input"
                                style={{ fontSize: "1.2rem" }}
                                // Añadimos el placeholder sugerido
                                placeholder="5000"
                                value={goalAmount}
                                onChange={(e) => setGoalAmount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "30px", marginLeft: "15px" }}>
                    {/* Usamos displayAmount aquí */}
                    💡 20 monedas = 1€. Estimación de valor: <strong style={{ color: "#32a89b" }}>{(displayAmount / 20).toFixed(2)}€</strong>
                </p>

                {/* VISTA PREVIA DEL PREMIO CON EMOJI */}
                <div
                    style={{
                        border: "3px dashed #32a89b",
                        borderRadius: "30px",
                        backgroundColor: "rgba(50, 168, 155, 0.05)",
                        minHeight: "180px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                    }}
                >
                    <span style={{ fontSize: "5rem", marginBottom: "10px" }}>🏆</span>
                    <p style={{ fontWeight: "bold", color: "#32a89b", margin: 0 }}>
                        {goalName || "¡Tu gran meta!"}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                        ¡Sigue trabajando para conseguirlo!
                    </p>
                </div>
            </div>

            {/* PIE FIJO */}
            <div className="wizard-footer">
                <ProgressBar step={step} />
                <div className="footer-buttons">
                    <button type="button" className="btn-back" onClick={onBack}>
                        Atrás
                    </button>
                    <button
                        type="button"
                        className="btn-next"
                        onClick={handleFinalClick}
                        // Deshabilitado si no hay nombre o si el monto es 0 o vacío
                        disabled={!goalName || displayAmount <= 0}
                    >
                        ¡Ver resumen!
                    </button>
                </div>
            </div>
        </div>
    );
};