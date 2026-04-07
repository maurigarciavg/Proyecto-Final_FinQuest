import React, { useState, useRef } from "react";
import { ProgressBar } from "./ProgressBar";
import cashtorImg from "../../assets/img/Cashtor.jpg"; // 🔴 Importamos el avatar
import "./ChildWizard.css";

export const ChildGrandPrizeSet = ({ onBack, onNextStep, step, formData }) => {
    const [goalName, setGoalName] = useState("");
    const [goalAmount, setGoalAmount] = useState(5000); 
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
            image_url: "" 
        });
    };

    return (
        <div className="wizard-step-wrapper animate__animated animate__fadeIn">
            
            {/* CABECERA */}
            <div className="wizard-header">
                {/* 🔴 SOLO EL AVATAR CORONANDO EL MODAL */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    <img 
                        src={cashtorImg} 
                        alt="Avatar" 
                        style={{ 
                            width: "65px", 
                            height: "65px", 
                            borderRadius: "50%", 
                            border: "3px solid #32a89b", 
                            objectFit: "cover",
                            boxShadow: "0 4px 10px rgba(50, 168, 155, 0.2)" 
                        }} 
                    />
                </div>
                
                <h2 className="wizard-title" style={{ marginBottom: "10px" }}>¡Gran Premio!</h2>
            </div>

            {/* CUERPO CENTRAL */}
            <div className="wizard-body">
                <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                    <div style={{ flex: "1" }}>
                        <input 
                            type="text" 
                            className="wizard-input" 
                            placeholder="Ej. Nintendo Switch" 
                            value={goalName} 
                            onChange={(e) => setGoalName(e.target.value)} 
                        />
                    </div>
                    <div className="task-coin-input-wrapper" style={{width: "150px"}}>
                        <input 
                            type="number" 
                            className="task-coin-input"
                            style={{ fontSize: "1.2rem" }}
                            value={goalAmount} 
                            onChange={(e) => setGoalAmount(e.target.value)} 
                        />
                        <span>🪙</span>
                    </div>
                </div>
                
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "30px", marginLeft: "15px" }}>
                    💡 20 monedas = 1€. Estimación de valor: <strong style={{color: "#32a89b"}}>{(goalAmount / 20).toFixed(2)}€</strong>
                </p>

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
                    }}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" style={{ maxHeight: "200px", maxWidth: "100%", objectFit: "contain", padding: "10px" }} />
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: "3rem" }}>📸</span>
                            <p style={{ margin: "10px 0 0 0", fontWeight: "bold", color: "#32a89b" }}>Subir foto del premio</p>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "5px" }}>Formato JPG o PNG (Max 2MB)</p>
                        </div>
                    )}
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
                        disabled={!goalName || goalAmount <= 0}
                    >
                        ¡Finalizar!
                    </button>
                </div>
            </div>
        </div>
    );
};