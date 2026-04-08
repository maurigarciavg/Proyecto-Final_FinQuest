import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../SignUp.css";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest } from "../services/api";
import beaverImg from "../assets/img/Castor-1.png";

export const SignUp = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        parentalPIN: "" // obligatorio para padres
    });

    if (store.token) {
        return <Navigate to="/profile-selection" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch({ type: "auth_request" });

        // Validaciones frontend
        if (!formData.name || !formData.email || !formData.password) {
            dispatch({
                type: "auth_failure",
                payload: "Todos los campos son obligatorios"
            });
            return;
        }

        if (!formData.parentalPIN || formData.parentalPIN.length !== 4) {
            dispatch({
                type: "auth_failure",
                payload: "El Parental PIN debe tener 4 dígitos"
            });
            return;
        }

        try {
            const data = await apiRequest("/api/sign-up", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    role: "parent" // implícito
                })
            });

            dispatch({
                type: "auth_success",
                payload: {
                    token: data.access_token,
                    user: data.user
                }
            });

            dispatch({
                type: "set_notice",
                payload: `Cuenta creada para ${data.user.name}.`
            });

            navigate("/profile-selection", { replace: true });
        } catch (error) {
            dispatch({
                type: "auth_failure",
                payload: error.message
            });
        }
    };

    return (
        <section className="auth-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="panel-card auth-card">
                            <h1 className="section-title">Crea tu cuenta</h1>

                            <form className="auth-form" onSubmit={handleSubmit}>
                                <label className="form-label" htmlFor="signup-name">
                                    Nombre
                                </label>
                                <input
                                    className="form-control form-control-lg"
                                    id="signup-name"
                                    name="name"
                                    onChange={handleChange}
                                    placeholder="Nombre del padre/madre"
                                    type="text"
                                    value={formData.name}
                                />

                                <label className="form-label" htmlFor="signup-email">
                                    Correo electrónico
                                </label>
                                <input
                                    className="form-control form-control-lg"
                                    id="signup-email"
                                    name="email"
                                    onChange={handleChange}
                                    placeholder="email@ejemplo.com"
                                    type="email"
                                    value={formData.email}
                                />

                                <label className="form-label" htmlFor="signup-password">
                                    Contraseña
                                </label>
                                <input
                                    className="form-control form-control-lg"
                                    id="signup-password"
                                    name="password"
                                    onChange={handleChange}
                                    placeholder="Mínimo 6 caracteres"
                                    type="password"
                                    value={formData.password}
                                />

                                <label className="form-label" htmlFor="signup-pin">
                                    PIN Parental
                                </label>
                                <input
                                    className="form-control form-control-lg"
                                    id="signup-pin"
                                    name="parentalPIN"
                                    type="password"
                                    placeholder="4 dígitos"
                                    value={formData.parentalPIN}
                                    onChange={handleChange}
                                    maxLength={4}
                                />

                                {store.errors.auth ? (
                                    <div className="alert alert-danger mb-0">
                                        {store.errors.auth}
                                    </div>
                                ) : null}

                                <button
                                    className="btn btn-primary-soft btn-lg w-100"
                                    disabled={
                                        store.loading.auth ||
                                        !formData.name ||
                                        !formData.email ||
                                        !formData.password ||
                                        !formData.parentalPIN
                                    }
                                    type="submit"
                                >
                                    {store.loading.auth ? "Creando cuenta..." : "Crear cuenta"}
                                </button>
                            </form>
                        </div>

                        {/* Imagen abajo a la izquierda */}
                        <div className="signup-image">
                            <img src={beaverImg} alt="Cashtor" />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};