import React, { useState } from "react";
import cashtorImg from "../../assets/img/Cashtor.jpg";

/**
 * NOTA PARA EL EQUIPO:
 * @param {Function} onClose - Cierra el flujo (conectar con el Dashboard).
 * @param {Function} onNextStep - Dispara el siguiente paso (conectar con el módulo de Tareas).
 */
export const ChildRegistration = ({ onClose, onNextStep }) => {
    // 1. ESTADOS DE CONTROL
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [pin, setPin] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false); 

    const avatars = [
        { id: 1, img: cashtorImg, name: "Cashtor Red" },
        { id: 2, img: cashtorImg, name: "Cashtor Scuba" },
        { id: 3, img: cashtorImg, name: "Cashtor Pink" },
        { id: 4, img: cashtorImg, name: "Cashtor Flower" }
    ];

    // 2. LÓGICA DE ENVÍO
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        /**
         * PARA EL RESPONSABLE DE BACKEND:
         * El objeto 'childData' ya está tipado. 
         * El PIN se envía como string para evitar errores con ceros a la izquierda.
         */
        const childData = { 
            name: name, 
            age: parseInt(age), 
            pin: pin, 
            avatar_id: selectedAvatar 
        };

        console.log("🚀 DEBUG: Datos para la API:", childData);

        // Simulación de carga (sustituir por fetch mas adelante)
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    // --- CONTENEDOR DE CENTRADO ABSOLUTO ---
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "rgba(0,0,0,0.05)" }}>
            
            {/* A. VISTA DE ÉXITO */}
            {isSuccess ? (
                <div className="card shadow-lg border-0 p-5 text-center animate__animated animate__fadeIn" style={{ maxWidth: "550px", borderRadius: "25px", backgroundColor: "#f0fdfa" }}>
                    <div className="mb-4">
                        <img src={cashtorImg} alt="Éxito" className="rounded-circle shadow-sm" style={{ width: "120px", height: "120px", border: "5px solid #32a89b" }} />
                    </div>
                    <h2 className="mb-3 fw-bold" style={{ color: "#32a89b" }}>¡Bienvenido, {name}!</h2>
                    <p className="text-secondary mb-5">Perfil creado con éxito. ¿Pasamos a configurar sus metas y tareas?</p>
                    
                    <div className="d-flex flex-column gap-3 w-100">
                        <button 
                            className="btn btn-lg text-white rounded-pill fw-bold shadow-sm"
                            style={{ backgroundColor: "#32a89b" }}
                            onClick={onNextStep}
                        >
                            Asignar primeras tareas
                        </button>
                        <button className="btn btn-lg btn-light text-secondary rounded-pill fw-bold" onClick={onClose}>
                            Ir al Panel de Control
                        </button>
                    </div>
                </div>
            ) : (

                /* B. FORMULARIO DE REGISTRO (VISTA POR DEFECTO) */
                <div className="card shadow-lg border-0 p-4 animate__animated animate__fadeIn" style={{ maxWidth: "550px", borderRadius: "25px", backgroundColor: "#f0fdfa" }}>
                    <h2 className="text-center mb-4" style={{ color: "#32a89b", fontWeight: "bold" }}>Crear Perfil del niño/a</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label className="form-label fw-bold" style={{ color: "#32a89b" }}>Nombre del perfil</label>
                            <input 
                                type="text" 
                                className="form-control rounded-pill shadow-sm border-0" 
                                placeholder="Nombre del niño/a"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-4 mb-3 text-start">
                                <label className="form-label fw-bold" style={{ color: "#32a89b" }}>Edad</label>
                                <input 
                                    type="number" 
                                    className="form-control rounded-pill shadow-sm border-0" 
                                    placeholder="Edad"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-8 mb-3 text-start">
                                <label className="form-label fw-bold" style={{ color: "#32a89b" }}>PIN de Seguridad (4 dígitos)</label>
                                <input 
                                    type="password" 
                                    className={`form-control rounded-pill shadow-sm border-0 ${pin.length > 0 && pin.length !== 4 ? "is-invalid" : ""}`}
                                    placeholder="****"
                                    maxLength="4"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* SELECTOR DE AVATAR*/}
                        <div className="mt-4 text-start">
                            <label className="form-label fw-bold mb-3" style={{ color: "#32a89b" }}>Selecciona tu avatar</label>
                            <div className="d-flex justify-content-center p-2 flex-wrap gap-2 align-items-center">
                                {avatars.map((av) => (
                                    <img 
                                        key={av.id}
                                        src={av.img} 
                                        alt={av.name}
                                        onClick={() => setSelectedAvatar(av.id)}
                                        className="rounded-circle shadow-sm"
                                        style={{ 
                                            width: "90px", 
                                            height: "90px", 
                                            cursor: "pointer", 
                                            padding: "2px",
                                            border: selectedAvatar === av.id ? "4px solid #32a89b" : "2px solid transparent",
                                            transition: "all 0.2s ease-in-out",
                                            transform: selectedAvatar === av.id ? "scale(1.15)" : "scale(1)",
                                            boxShadow: selectedAvatar === av.id ? "0 8px 15px rgba(50, 168, 155, 0.4)" : "none"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="d-flex gap-3 mt-5">
                            <button type="button" className="btn btn-light rounded-pill w-50 fw-bold text-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn text-white rounded-pill w-50 fw-bold shadow-sm d-flex align-items-center justify-content-center"
                                style={{ backgroundColor: "#32a89b" }}
                                disabled={isSubmitting || !name || !age || pin.length !== 4 || !selectedAvatar}
                            >
                                {isSubmitting ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : "Crear Perfil"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};