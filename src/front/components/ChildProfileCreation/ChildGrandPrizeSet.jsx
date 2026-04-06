import React, { useState, useRef } from "react";
import { ProgressBar } from "./ProgressBar";
import "./ChildWizard.css";

export const ChildGrandPrizeSet = ({ onBack, onNextStep, step }) => {
    const [goalName, setGoalName] = useState("");
    const [goalAmount, setGoalAmount] = useState(5000); // Sugerencia de ahorro a largo plazo
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("¡Foto demasiado grande! Por favor, elige una de menos de 2MB.");
                e.target.value = "";
                return;
            }
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleFinalClick = () => {
        onNextStep({
            name: goalName,
            coins: parseInt(goalAmount) || 0,
            image_url: "" // Aquí irá la lógica de subida al servidor si la implementas
        });
    };

    return (
        <div className="wizard-body-container animate__animated animate__fadeIn">
            <style>
                {`
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                `}
            </style>

            {/* CUERPO CON SCROLL */}
            <div className="wizard-body">
                <h2 className="wizard-title">¡Gran Premio!</h2>

                {/* FORMULARIO DEL PREMIO */}
                <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                    <div style={{ flex: "1" }}>
                        <input 
                            type="text" 
                            className="wizard-input" 
                            placeholder="Ej. Nintendo Switch" 
                            value={goalName} 
                            onChange={(e) => setGoalName(e.target.value)} 
                        />
                    </div>
                    <div style={{ width: "150px" }}>
                        <div style={{ 
                            display: "flex", alignItems: "center", backgroundColor: "white", 
                            borderRadius: "50px", border: "2px solid #e2e8f0", padding: "0 15px", height: "55px" 
                        }}>
                            <input 
                                type="number" 
                                style={{ border: "none", width: "100%", fontWeight: "bold", color: "#f39c12", outline: "none", fontSize: "1.1rem", textAlign: "center" }} 
                                value={goalAmount} 
                                onChange={(e) => setGoalAmount(e.target.value)} 
                            />
                            <span>🪙</span>
                        </div>
                    </div>
                </div>
                
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "30px", paddingLeft: "10px" }}>
                    💡 20 monedas = 1€. Estimación de valor: <strong>{(goalAmount / 20).toFixed(2)}€</strong>
                </p>

                {/* SELECTOR DE IMAGEN */}
                <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
                
                <div 
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        border: "3px dashed #32a89b",
                        borderRadius: "30px",
                        backgroundColor: preview ? "white" : "rgba(50, 168, 155, 0.05)",
                        cursor: "pointer",
                        overflow: "hidden",
                        minHeight: "220px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        marginTop: "10px"
                    }}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" style={{ maxHeight: "200px", maxWidth: "100%", objectFit: "contain", padding: "10px" }} />
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: "3rem" }}>📸</span>
                            <p style={{ margin: "10px 0 0 0", fontWeight: "bold", color: "#32a89b" }}>Subir foto del premio</p>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Formato JPG o PNG (Max 2MB)</p>
                        </div>
                    )}
                </div>
            </div>

            {/* PIE FIJO */}
            <div className="wizard-footer">
                <ProgressBar step={step} />
                <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                    <button type="button" className="btn-back" onClick={onBack}>
                        Atrás
                    </button>
                    <button 
                        type="button" 
                        className="btn-next" 
                        onClick={handleFinalClick} 
                        disabled={!goalName || goalAmount <= 0}
                    >
                        ¡Finalizar!
                    </button>
                </div>
            </div>
        </div>
    );
};