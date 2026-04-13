import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logoImg from "../assets/img/logo.png";
import "./Navbar.css"; // Asegúrate de que este import sigue ahí

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "clear_session", payload: "Sesión cerrada correctamente." });
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-finquest">
            <div className="container">
                {/* BRAND / LOGO - Texto eliminado */}
                <NavLink className="navbar-brand d-flex align-items-center" to="/">
                    <img 
                        src={logoImg} 
                        alt="FinQuest Logo" 
                        className="navbar-logo" 
                    />
                </NavLink>
                
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mainNavbar">
                    <div className="navbar-nav ms-auto align-items-lg-center">
                        
                        {store.token ? (
                            <>
                                <NavLink className="nav-link nav-link-custom" to="/parentadmin">
                                    Panel de Control
                                </NavLink>
                                <NavLink className="nav-link nav-link-custom" to="/profiles">
                                    Cambiar Perfil
                                </NavLink>
                                <button className="btn btn-logout ms-lg-2" onClick={handleLogout} type="button">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink className="nav-link nav-link-custom" to="/sign-in">
                                    Entrar
                                </NavLink>
                                <NavLink className="btn btn-primary-soft rounded-pill px-4 ms-lg-2" to="/sign-up">
                                    Crear Cuenta
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};