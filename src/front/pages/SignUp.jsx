import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
        parentalPIN: ""
    });

    if (store.token) {
        return <Navigate to="/child-registration" replace />;
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

        try {
            const data = await apiRequest("api/sign-up", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    role: "parent"
                })
            });

            dispatch({
                type: "auth_success",
                payload: { token: data.access_token, user: data.user }
            });

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/child-registration", { replace: true });
        } catch (error) {
            dispatch({ type: "auth_failure", payload: error.message });
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
                                <label className="form-label">Nombre</label>
                                <input className="form-control" name="name" onChange={handleChange} value={formData.name} type="text" required />
                                
                                <label className="form-label">Correo electrónico</label>
                                <input className="form-control" name="email" onChange={handleChange} value={formData.email} type="email" required />
                                
                                <label className="form-label">Contraseña</label>
                                <input className="form-control" name="password" onChange={handleChange} value={formData.password} type="password" required />
                                
                                <label className="form-label">PIN Parental</label>
                                <input className="form-control" name="parentalPIN" onChange={handleChange} value={formData.parentalPIN} type="password" maxLength={4} required />

                                {store.errors.auth && <div className="alert alert-danger">{store.errors.auth}</div>}

                                <button className="btn btn-primary-soft w-100" type="submit" disabled={store.loading.auth}>
                                    {store.loading.auth ? "Creando cuenta..." : "Crear cuenta"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};