import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logoImg from "../assets/img/logo.png";
import "./Navbar.css";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Usamos la acción de tu proyecto para limpiar sesión
        dispatch({ type: "clear_session", payload: "Sesión cerrada correctamente." });
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-finquest sticky-top">
            <div className="container">
                {/* 🟢 BRAND / LOGO: Usamos la clase navbar-logo para tu CSS */}
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
                    <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        
                        {/* Enlaces comunes */}
                        <NavLink className="nav-link nav-link-custom" to="/">Inicio</NavLink>
                        <a className="nav-link nav-link-custom" href="#nosotros">Nosotros</a>
                        <NavLink className="nav-link nav-link-custom" to="/">Contacto</NavLink>

                        {store.token ? (
                            <>
                                {/* Rutas de gestión cuando hay sesión */}
                                <NavLink className="nav-link nav-link-custom" to="/parentadmin">
                                    Panel de Control
                                </NavLink>
                                <NavLink className="nav-link nav-link-custom" to="/profiles">
                                    Cambiar Perfil
                                </NavLink>
                                <button 
                                    className="btn btn-logout ms-lg-2" 
                                    onClick={handleLogout} 
                                    type="button"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Rutas de entrada cuando no hay sesión */}
                                <NavLink className="nav-link nav-link-custom" to="/sign-in">
                                    Iniciar Sesión
                                </NavLink>
                                <NavLink 
                                    className="btn btn-primary-yellow rounded-pill px-4 ms-lg-2" 
                                    to="/sign-up"
                                >
                                    Registrarse
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};