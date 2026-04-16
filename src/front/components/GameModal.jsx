import React from "react";
import GiphyMemoryGame from "./GiphyMemoryGame";
import "./game-modal.css";

export const GameModal = ({ onClose, onGameComplete }) => {
    return (
        <div className="game-modal-overlay">
            <div className="game-modal-content">
                <div className="game-modal-header">
                    <h2>🎮 Minijuego: Memoria Pokémon</h2>
                    <button className="game-modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                
                <div className="game-modal-body">
                    <p style={{ marginBottom: "20px", color: "#666" }}>
                        Encuentra las parejas de GIFs para ganar <strong>30 monedas</strong>. 
                        ¡Solo puedes ganar el premio una vez al día!
                    </p>
                    <GiphyMemoryGame onGameComplete={onGameComplete} />
                </div>
            </div>
        </div>
    );
};