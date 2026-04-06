import React, { useState } from "react";
import cashtorImg from "../../assets/img/Cashtor.jpg";
import { ProgressBar } from "./ProgressBar";
import "./ChildWizard.css"; 

export const ChildRegistration = ({ onClose, onNextStep, step }) => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [pin, setPin] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(1); // Cashtor Red por defecto
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const avatars = [
        { id: 1, img: cashtorImg, name: "Cashtor Red" },
        { id: 2, img: cashtorImg, name: "Cashtor Scuba" },
        { id: 3, img: cashtorImg, name: "Cashtor Pink" },
        { id: 4, img: cashtorImg, name: "Cashtor Flower" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin.length !== 4) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    const handleConfirmAndNext = () => {
        const childData = {
            name: name,
            age: parseInt(age),
            pin: pin,
            avatar: `avatar_${selectedAvatar}.png`
        };
        onNextStep({ child: childData });
    };

    return (
        <div className="wizard-body-container animate__animated animate__fadeIn">
            
            {isSuccess ? (
                /* VISTA DE ÉXITO */
                <>
                    <div className="wizard-body text-center align-items-center justify-content-center">
                        <div className="avatar-preview-container">
                            <img src={cashtorImg} alt="Éxito" 
                                style={{ width: "120px", height: "120px", borderRadius: "50%", border: "5px solid #32a89b", objectFit: "cover" }} />
                        </div>
                        <h2 className="wizard-title" style={{ marginTop: "20px" }}>¡Bienvenido, {name}!</h2>
                        <p style={{ color: "#64748b", marginBottom: "40px" }}>Perfil preparado. ¿Configuramos sus metas y tareas ahora?</p>
                    </div>
                    
                    <div className="wizard-footer">
                        <button className="btn-next" style={{ marginBottom: "15px" }} onClick={handleConfirmAndNext}>
                            Asignar primeras tareas
                        </button>
                        <button className="btn-back" onClick={onClose}>
                            Ir al Panel de Control
                        </button>
                    </div>
                </>
            ) : (
                /* FORMULARIO DE REGISTRO */
                <form onSubmit={handleSubmit} className="wizard-body-container">
                    <div className="wizard-body">
                        <h2 className="wizard-title">Crear Perfil del niño/a</h2>

                        {/* NOMBRE */}
                        <div className="input-group-custom">
                            <label className="wizard-label">Nombre del perfil</label>
                            <input
                                type="text"
                                className="wizard-input"
                                placeholder="Nombre del niño/a"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* EDAD Y PIN */}
                        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                            <div style={{ flex: "1" }}>
                                <label className="wizard-label">Edad</label>
                                <input
                                    type="number"
                                    className="wizard-input"
                                    style={{ textAlign: "center" }}
                                    placeholder="Edad"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ flex: "2" }}>
                                <label className="wizard-label">PIN del perfil niño/a</label>
                                <input
                                    type="password"
                                    className="wizard-input"
                                    placeholder="Crea un código de 4 dígitos"
                                    maxLength="4"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                                    required
                                />
                            </div>
                        </div>

                        {/* SELECCIÓN DE AVATAR */}
                        <div style={{ marginTop: "30px" }}>
                            <label className="wizard-label" style={{ textAlign: "center", marginLeft: 0 }}>Selecciona tu avatar</label>
                            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" }}>
                                {avatars.map((av) => (
                                    <img
                                        key={av.id}
                                        src={av.img}
                                        alt={av.name}
                                        onClick={() => setSelectedAvatar(av.id)}
                                        style={{
                                            width: "75px",
                                            height: "75px",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            objectFit: "cover",
                                            border: selectedAvatar === av.id ? "4px solid #32a89b" : "2px solid transparent",
                                            transition: "transform 0.2s ease",
                                            transform: selectedAvatar === av.id ? "scale(1.1)" : "scale(1)"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PIE DE PÁGINA FIJO */}
                    <div className="wizard-footer">
                        <ProgressBar step={step} />
                        <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                            <button type="button" className="btn-back" onClick={onClose}>
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-next"
                                disabled={isSubmitting || !name || !age || pin.length !== 4}
                            >
                                {isSubmitting ? "Cargando..." : "Siguiente"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};