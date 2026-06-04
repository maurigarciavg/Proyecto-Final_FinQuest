import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import avatar1 from "../../assets/img/Profiles/Children/child_9.png";
import avatar2 from "../../assets/img/Profiles/Children/child_7.png";
import avatar3 from "../../assets/img/Profiles/Children/child_4.png";
import avatar4 from "../../assets/img/Profiles/Children/child_5.png";

import { ProgressBar } from "./ProgressBar";
import "./ChildWizard.css";

export const ChildRegistration = ({ onClose, onNextStep, step }) => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [pin, setPin] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const avatars = [
        { id: 1, img: avatar1, name: "Niño 1" },
        { id: 2, img: avatar2, name: "Niño 2" },
        { id: 3, img: avatar3, name: "Niño 3" },
        { id: 4, img: avatar4, name: "Niño 4" }
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
        const currentAvatarObj = avatars.find(av => av.id === selectedAvatar);

        const childData = {
            name: name,
            age: parseInt(age),
            pin: pin,
            avatar: currentAvatarObj ? currentAvatarObj.img : avatar1
        };

        onNextStep({ child: { child: childData } });
    };

    const currentAvatar = avatars.find(av => av.id === selectedAvatar) || avatars[0];

    return (
        <div className="wizard-step-wrapper animate__animated animate__fadeIn">

            {isSuccess ? (
                <>
                    <div className="wizard-header text-center pb-0">
                        <h2 className="wizard-title mb-2">¡Perfil Creado!</h2>
                    </div>

                    <div className="wizard-body d-flex flex-column align-items-center justify-content-center" style={{ paddingTop: "0" }}>
                        <div className="avatar-preview-container" style={{ marginTop: "20px" }}>
                            <img
                                src={currentAvatar.img}
                                alt="Avatar seleccionado"
                                style={{
                                    width: "130px",
                                    height: "130px",
                                    borderRadius: "50%",
                                    border: "5px solid #32a89b",
                                    objectFit: "cover",
                                    boxShadow: "0 10px 25px rgba(50, 168, 155, 0.3)"
                                }}
                            />
                        </div>

                        <h3 style={{ color: "#32a89b", marginTop: "20px", fontWeight: "bold" }}>
                            {name}
                        </h3>

                        <p style={{ color: "#64748b", marginBottom: "40px", textAlign: "center", fontSize: "1.1rem" }}>
                            El espacio para tu hijo/a ya está listo.<br />
                            ¿Configuramos sus metas y tareas ahora?
                        </p>
                    </div>

                    <div className="wizard-footer">
                        <button
                            className="btn-next"
                            style={{ marginBottom: "15px" }}
                            onClick={handleConfirmAndNext}
                        >
                            Sí, asignar primeras tareas
                        </button>

                        <button
                            className="btn-back"
                            onClick={() => {
                                onClose();
                                navigate("/parentadmin");
                            }}
                        >
                            Hacerlo más tarde
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>

                        <div className="wizard-header">
                            <h2 className="wizard-title">Crear Perfil del niño/a</h2>
                        </div>

                        <div className="wizard-body">

                            <div style={{ marginBottom: "20px" }}>
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

                            <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
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
                                    <label className="wizard-label">PIN del perfil</label>
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

                            <div>
                                <label className="wizard-label" style={{ textAlign: "center", marginLeft: 0 }}>
                                    Selecciona tu avatar
                                </label>

                                <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px", flexWrap: "wrap" }}>
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
                                                transform: selectedAvatar === av.id ? "scale(1.1)" : "scale(1)"
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="wizard-footer">
                            <ProgressBar step={step} />

                            <div className="footer-buttons">
                                <button type="button" className="btn-back" onClick={() => {
                                    navigate("/parentadmin");
                                }}>
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
                </>
            )}
        </div>
    );
};