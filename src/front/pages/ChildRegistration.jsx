import React, { useState } from "react";
import cashtorImg from "../assets/img/Cashtor.jpg"; 

// Asumimos que estas funciones vendrán como props desde el padre (Profile.jsx)
export const ChildRegistration = ({ onClose, onAssignTasks }) => {
    // 1. ESTADOS
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [pin, setPin] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el botón de carga
    const [isSuccess, setIsSuccess] = useState(false); // Nuevo: Controla si el registro fue exitoso

    // Marcadores de posición con tu imagen
    const avatars = [
        { id: 1, img: cashtorImg, name: "Cashtor Red" },
        { id: 2, img: cashtorImg, name: "Cashtor Scuba" },
        { id: 3, img: cashtorImg, name: "Cashtor Pink" },
        { id: 4, img: cashtorImg, name: "Cashtor Flower" }
    ];

    // 2. MANEJADOR DEL ENVÍO (Simulado)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Activamos el efecto de carga

        // Objeto de datos que enviarás al Backend
        const childData = { 
            name: name, 
            age: parseInt(age), 
            pin: pin, // String de 4 dígitos
            avatar_id: selectedAvatar 
        };

        console.log("🚀 Intentando enviar datos al Backend:", childData);

        // --- SIMULACIÓN DE PETICIÓN A LA API (Sustituir por fetch mañana) ---
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        // --------------------------------------------------------------------

        console.log("✅ Perfil guardado (Simulación) para:", name);
        setIsSubmitting(false); // Desactivamos la carga
        setIsSuccess(true); // ¡Éxito! Cambiamos la vista del modal
    };

    // 3. VISTAS CONDICIONALES

    // Vista de Éxito (Sustituye al alert)
    if (isSuccess) {
        return (
            <div className="card shadow-lg border-0 p-5 text-center" style={{ maxWidth: "550px", borderRadius: "25px", backgroundColor: "#f0fdfa" }}>
                <div className="mb-4">
                    {/* Un castor celebrando (puedes cambiar la imagen por una más animada) */}
                    <img src={cashtorImg} alt="Éxito" className="rounded-circle shadow-sm" style={{ width: "120px", height: "120px", border: "5px solid #32a89b" }} />
                </div>
                <h2 className="mb-3 fw-bold" style={{ color: "#32a89b" }}>¡Bienvenido, {name}!</h2>
                <p className="text-secondary mb-5">El perfil de tu pequeño castor financiero se ha creado correctamente. ¿Qué quieres hacer ahora?</p>
                
                <div className="d-flex flex-column gap-3 align-items-center w-100">
                    <button 
                        className="btn btn-lg text-white rounded-pill fw-bold w-100 shadow-sm"
                        style={{ backgroundColor: "#32a89b" }}
                        onClick={() => {
                            // Esta función (onAssignTasks) la definirá Diego para abrir su modal
                            console.log("🔗 Redirigiendo al Modal de Tareas...");
                            if (onAssignTasks) onAssignTasks(); 
                        }}
                    >
                        <i className="fa-solid fa-tasks me-2"></i> Asignar primera tarea
                    </button>
                    <button 
                        className="btn btn-lg btn-light text-secondary rounded-pill fw-bold w-100"
                        onClick={() => {
                            // Esta función (onClose) la definirá el Dashboard para cerrar el modal
                            console.log("🏠 Volviendo al Panel de Control...");
                            if (onClose) onClose();
                        }}
                    >
                        Volver al Panel de Control
                    </button>
                </div>
            </div>
        );
    }

    // Vista del Formulario Original
    return (
        <div className="card shadow-lg border-0 p-4" style={{ maxWidth: "550px", borderRadius: "25px", backgroundColor: "#f0fdfa" }}>
            
            <h2 className="text-center mb-4" style={{ color: "#32a89b", fontWeight: "bold" }}>Crear Perfil del niño/a</h2>

            <form onSubmit={handleSubmit}>
                {/* Campo Nombre */}
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
                    {/* Edad */}
                    <div className="col-4 mb-3 text-start">
                        <label className="form-label fw-bold" style={{ color: "#32a89b" }}>Edad</label>
                        <input 
                            type="number" 
                            className="form-control rounded-pill shadow-sm border-0" 
                            placeholder="Edad"
                            min="1" // Pequeña validación de seguridad
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campo PIN */}
                    <div className="col-8 mb-3 text-start">
                        <label className="form-label fw-bold" style={{ color: "#32a89b" }}>PIN del perfil niño/a</label>
                        <input 
                            type="password" 
                            className={`form-control rounded-pill shadow-sm border-0 ${pin.length > 0 && pin.length !== 4 ? "is-invalid" : ""}`}
                            placeholder="4 dígitos"
                            maxLength="4" // Validación visual
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            required
                        />
                        {pin.length > 0 && pin.length !== 4 && (
                            <div className="invalid-feedback ps-2">El PIN debe ser de 4 dígitos.</div>
                        )}
                    </div>
                </div>

                {/* Selector de Avatar */}
                <div className="mt-3 text-start">
                    <label className="form-label fw-bold mb-3" style={{ color: "#32a89b" }}>Selecciona tu avatar</label>
                    <div className="d-flex justify-content-between p-2 flex-wrap gap-2">
                        {avatars.map((av) => (
                            <img 
                                key={av.id}
                                src={av.img} 
                                alt={av.name}
                                onClick={() => setSelectedAvatar(av.id)}
                                className="rounded-circle"
                                style={{ 
                                    width: "75px", height: "75px", cursor: "pointer", padding: "5px",
                                    border: selectedAvatar === av.id ? "4px solid #32a89b" : "2px solid transparent",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    transform: selectedAvatar === av.id ? "scale(1.15)" : "scale(1)",
                                    boxShadow: selectedAvatar === av.id ? "0 4px 10px rgba(50, 168, 155, 0.3)" : "none"
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Botones de acción */}
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
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Guardando...
                            </>
                        ) : "Crear Perfil"}
                    </button>
                </div>
            </form>
        </div>
    );
};