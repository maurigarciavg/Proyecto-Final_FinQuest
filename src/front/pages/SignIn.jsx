import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import beaverImg from "../assets/img/cashtor_coins.png";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest } from "../services/api";

export const SignIn = () => {
    const { store, dispatch } = useGlobalReducer();
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "lara@example.com",
        password: "demo123"
    });

    if (store.token) {
        return <Navigate to="/profile" replace />;
    }

    const redirectTarget = location.state?.from?.pathname || "/profile";

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
        const data = await apiRequest("/api/sign-in", {
            method: "POST",
            body: JSON.stringify(formData)
        });

        dispatch({
            type: "auth_success",
            payload: {
                token: data.access_token,
                user: data.user
            }
        });

        // Guardar en localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("TOKEN guardado:", localStorage.getItem("token"));
        console.log("USER guardado:", JSON.parse(localStorage.getItem("user")));

        dispatch({
            type: "set_notice",
            payload: `Bienvenido otra vez, ${data.user.name}.`
        });

        // Redirección
        window.location.href = "/profiles";
    } catch (error) {
        dispatch({
            type: "auth_failure",
            payload: error.message
        });
    }
};

    return (
        <div className="login-container">

            {/* CARD LOGIN */}
            <div className="login-card">
                <h2 className="login-title">Iniciar sesión</h2>

                <form className="login-form" onSubmit={handleSubmit}>

                    <input
                        className="login-input"
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        className="login-input"
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {store.errors.auth && (
                        <div className="login-error">
                            {store.errors.auth}
                        </div>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={store.loading.auth}
                    >
                        {store.loading.auth ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <div className="login-signup">
                    <p>
                        ¿No tienes cuenta?{" "}
                        <Link to="/sign-up">Regístrate</Link>
                    </p>
                </div>
            </div>

            {/* Imagen derecha */}
            <div className="login-image">
                <img src={beaverImg} alt="Cashtor" />
            </div>

        </div>
    );
};