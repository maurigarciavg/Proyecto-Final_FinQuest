import React, { useState, useRef } from "react";

export const ChildGrandPrizeSet = ({ onBack, onNextStep }) => {
    const [goalName, setGoalName] = useState("");
    const [goalAmount, setGoalAmount] = useState(10);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    // Esta función ahora es la única responsable de cerrar el proceso
    const handleFinalClick = (e) => {
        if (e) e.preventDefault();

        // Cambiamos los nombres para que coincidan con el modelo de la base de datos
        const finalData = {
            name: goalName,
            coins: parseInt(goalAmount) || 0,
            image_url: "" // De momento vacío hasta implementar Cloudinary
        };

        onNextStep(finalData);
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

            <div className="flex-grow-1 d-flex flex-column">
                {/* --- CAMPOS DE TEXTO --- */}
                <div className="d-flex gap-2 mb-4">
                    <input
                        type="text"
                        className="form-control rounded-pill border-0 shadow-sm px-4 flex-grow-1"
                        style={{ height: "50px", border: "2px solid #32a89b" }}
                        placeholder="Gran premio (ej. Una Switch)"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                    />

                    <div className="d-flex align-items-center bg-white rounded-pill shadow-sm px-3"
                        style={{ border: "2px solid #32a89b", height: "50px", width: "160px" }}>
                        <input
                            type="number"
                            className="form-control border-0 bg-transparent text-center fw-bold p-0"
                            style={{ color: "#32a89b" }}
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                        />
                        <span style={{ fontSize: "1.2rem", marginLeft: "5px" }}>🪙</span>
                    </div>
                </div>

                {/* --- SUBIDA DE IMAGEN --- */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <div
                    className="flex-grow-1 d-flex flex-column align-items-center justify-content-center mb-4"
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        border: "2px dashed #32a89b",
                        borderRadius: "20px",
                        backgroundColor: preview ? "white" : "rgba(50, 168, 155, 0.05)",
                        cursor: "pointer",
                        overflow: "hidden",
                        minHeight: "150px"
                    }}>
                    {preview ? (
                        <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                        <div className="text-center">
                            <span style={{ fontSize: "2.5rem" }}>🎁</span>
                            <p className="mb-0 fw-bold mt-2" style={{ color: "#32a89b" }}>Añadir foto del premio</p>
                        </div>
                    )}
                </div>

                {/* --- BOTONES DE ACCIÓN --- */}
                <div className="d-flex gap-3">
                    <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill w-50 fw-bold p-3"
                        onClick={onBack}
                    >
                        Atrás
                    </button>
                    <button
                        type="button" // Cambiado a button para evitar conflictos con onSubmit
                        className="btn text-white rounded-pill w-50 fw-bold shadow-sm p-3"
                        style={{ backgroundColor: "#32a89b" }}
                        onClick={handleFinalClick}
                        disabled={!goalName || !goalAmount}
                    >
                        Finalizar
                    </button>
                </div>
            </div>
        </div>
    );
};

