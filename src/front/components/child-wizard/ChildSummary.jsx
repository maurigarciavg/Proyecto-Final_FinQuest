import React from "react";
import defaultAvatar from "../../assets/img/Profiles/Children/child_9.png";
import "./ChildWizard.css";

export const ChildSummary = ({ formData, isSaving, saveError, onClose }) => {
    const childName = formData.child?.child?.name || "Niño/a";
    const selectedAvatar = formData.child?.child?.avatar || defaultAvatar;
    const totalTasks = formData.tasks?.length || 0;
    const totalCoupons = formData.smallGoals?.length || 0;
    const grandPrizeName = formData.grandPrize?.name || "Sin premio";
    const grandPrizeCoins = formData.grandPrize?.coins || 0;

    return (
        <div className="wizard-step-wrapper animate__animated animate__fadeIn">
            
            <div className="wizard-header text-center pb-0">
                <h2 className="wizard-title mb-2">¡Misión Completada!</h2>
                <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
                    El perfil de <strong>{childName}</strong> está listo.
                </p>
            </div>

            <div className="wizard-body d-flex flex-column align-items-center justify-content-center" style={{ paddingTop: "0" }}>
                
                <div style={{ marginBottom: "30px", marginTop: "10px" }}>
                    <img 
                        src={selectedAvatar} 
                        alt="Avatar seleccionado" 
                        style={{ 
                            width: "140px", 
                            height: "140px", 
                            borderRadius: "50%", 
                            border: "5px solid #32a89b", 
                            objectFit: "cover",
                            boxShadow: "0 10px 25px rgba(50, 168, 155, 0.3)"
                        }} 
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>

                <div style={{ 
                    backgroundColor: "white", 
                    borderRadius: "20px", 
                    padding: "25px", 
                    width: "100%", 
                    border: "2px solid #e2e8f0",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
                }}>
                    <h4 style={{ color: "#32a89b", textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}>Resumen del Perfil</h4>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px dashed #e2e8f0", paddingBottom: "10px" }}>
                        <span style={{ color: "#64748b", fontWeight: "600" }}>📝 Tareas asignadas:</span>
                        <span style={{ fontWeight: "800", color: "#334155" }}>{totalTasks}</span>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px dashed #e2e8f0", paddingBottom: "10px" }}>
                        <span style={{ color: "#64748b", fontWeight: "600" }}>🎟️ Cupones disponibles:</span>
                        <span style={{ fontWeight: "800", color: "#334155" }}>{totalCoupons}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#64748b", fontWeight: "600" }}>🏆 Gran Premio:</span>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: "800", color: "#334155" }}>{grandPrizeName}</div>
                            <div style={{ fontSize: "0.85rem", color: "#f39c12", fontWeight: "bold" }}>🪙 {grandPrizeCoins}</div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: "20px", textAlign: "center", minHeight: "24px" }}>
                    {isSaving && <span style={{ color: "#32a89b", fontWeight: "bold" }}>⏳ Guardando configuración en la base de datos...</span>}
                    {saveError && <span style={{ color: "#e74c3c", fontWeight: "bold" }}>❌ Error: {saveError}</span>}
                    {!isSaving && !saveError && <span style={{ color: "#27ae60", fontWeight: "bold" }}>✅ ¡Todo guardado correctamente!</span>}
                </div>

            </div>

            <div className="wizard-footer">
                <button 
                    onClick={onClose} 
                    className="btn-next" 
                    disabled={isSaving} 
                    style={{ 
                        backgroundColor: isSaving ? "#a5d6d1" : "#32a89b",
                        cursor: isSaving ? "not-allowed" : "pointer"
                    }}
                >
                    {isSaving ? "Guardando..." : "Ir al Panel de Control"}
                </button>
            </div>
        </div>
    );
};