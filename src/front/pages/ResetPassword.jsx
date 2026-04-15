import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../Login.css";

export const ResetPassword = () => {
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // 👉 Validación básica
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // 👉 aquí luego llamarás a tu API
        console.log("Token:", token);
        console.log("Nueva password:", password);
    };

    return (
        <div className="forgot-container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
                
                <h2 className="text-center mb-3 login-title">Nueva contraseña</h2>

                <p className="text-muted text-center mb-4">
                    Introduce tu nueva contraseña
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">Nueva contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirmar contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 send-btn">
                        Cambiar contraseña
                    </button>
                </form>

                <div className="text-center mt-3">
                    <Link to="/sign-in">Volver al login</Link>
                </div>

            </div>
        </div>
    );
};