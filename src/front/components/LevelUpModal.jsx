import React from "react";
// 🟢 Importamos el video con la ruta corregida
import levelVideo from "../assets/img/subida-de-nivel.mp4";

export const LevelUpModal = ({ level, onClose }) => {
    
    return (
        <div className="task-modal__overlay" style={{ zIndex: 10000, backgroundColor: "rgba(0,0,0,0.85)" }}>
            <div style={{ 
                position: "relative",
                width: "90%", 
                maxWidth: "650px", 
                textAlign: "center" 
            }}>
                {/* Título con estilo de videojuego */}
                <h1 style={{ 
                    color: "#fff", 
                    fontSize: "3.2rem", 
                    marginBottom: "20px",
                    textShadow: "0 0 20px rgba(32, 184, 167, 0.9)",
                    fontWeight: "900",
                    letterSpacing: "2px"
                }}>
                    ¡NIVEL {level}! 👑
                </h1>

                <div style={{ 
                    borderRadius: "30px", 
                    overflow: "hidden", 
                    boxShadow: "0 0 60px rgba(32, 184, 167, 0.4)", // Brillo del color de tu marca
                    border: "5px solid #20b8a7",
                    backgroundColor: "#000"
                }}>
                    <video 
                        autoPlay 
                        playsInline
                        /* 🟢 Sin 'muted' para que se oigan los cohetes y el sonido del video */
                        style={{ width: "100%", display: "block" }}
                        onEnded={onClose} 
                    >
                        <source src={levelVideo} type="video/mp4" />
                        Tu navegador no soporta vídeos.
                    </video>
                </div>

                <button 
                    onClick={onClose}
                    style={{
                        marginTop: "30px",
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        color: "#fff",
                        padding: "10px 30px",
                        borderRadius: "50px",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        transition: "all 0.3s ease",
                        fontWeight: "600"
                    }}
                >
                    ¡A seguir construyendo! 🦫
                </button>
            </div>
        </div>
    );
};