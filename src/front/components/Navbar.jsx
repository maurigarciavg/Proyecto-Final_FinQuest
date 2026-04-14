import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./Navbar.css";

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
                <NavLink className="" to="/">
                    <img src={logo} alt="FinQuest Logo" className="logo"/>
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
                    <div className="navbar-nav gap-lg-2 ms-auto align-items-lg-center">
                        <NavLink className="nav-link" to="/">Inicio</NavLink>
                        <a className="nav-link" href="#nosotros">Nosotros</a>
                        <NavLink className="nav-link" to="/">Contacto</NavLink>

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
                                <NavLink className="btn btn-primary-soft rounded-pill px-4 ms-lg-2" to="/sign-in">
                                    Iniciar Sesión
                                </NavLink>
                                <NavLink className="btn btn-primary-yellow rounded-pill px-4 ms-lg-2" to="/sign-up">
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