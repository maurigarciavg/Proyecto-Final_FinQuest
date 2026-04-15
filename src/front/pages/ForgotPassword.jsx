import { useState } from "react";
import { Link } from "react-router-dom";
import "../Login.css";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // 👉 aquí luego llamarás a tu API
        console.log("Email enviado:", email);
    };

    return (
        <div className="forgot-container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
                
                <h2 className="text-center mb-3 login-title">Recuperar contraseña</h2>

                <p className="text-muted text-center mb-4">
                    Introduce tu email y te enviaremos instrucciones
                </p>

                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="send-btn btn btn-primary w-100">
                        Enviar instrucciones
                    </button>
                </form>

                <div className="text-center mt-3">
                    <Link to="/sign-in">Volver al login</Link>
                </div>

            </div>
        </div>
    );
};