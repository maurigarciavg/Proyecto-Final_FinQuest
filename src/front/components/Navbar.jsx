import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logoImg from "../assets/img/logo.png";
import "./Navbar.css";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const location = useLocation();

    const activeProfile = store.activeProfile;

    // compute profile target: prefer current child, then saved activeProfile, then parent, else profiles
    let profileTarget = "/profiles";
    if (store.currentChild && store.currentChild.id) {
        profileTarget = `/child-dashboard/${store.currentChild.id}`;
    } else if (activeProfile && activeProfile.role === "child" && activeProfile.id) {
        profileTarget = `/child-dashboard/${activeProfile.id}`;
    } else if (activeProfile && activeProfile.role === "parent") {
        profileTarget = "/parentadmin";
    } else if (store.user) {
        profileTarget = "/parentadmin";
    }

    const isHome = location.pathname === "/";
    const isParent = location.pathname === "/parentadmin";

    const handleLogout = () => {
        dispatch({ type: "clear_session", payload: "Sesión cerrada correctamente." });
        localStorage.removeItem("activeProfile");
        localStorage.removeItem("jwt-example-session");
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-finquest sticky-top">
            <div className="container-fluid px-3 px-md-4">
                <NavLink className="navbar-brand d-flex align-items-center" to={profileTarget}>
                    <img src={logoImg} alt="FinQuest Logo" className="navbar-logo" />
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
                        <NavLink className="nav-link nav-link-custom" to={profileTarget}>
                            Inicio
                        </NavLink>

                        {isHome && (
                            <a className="nav-link nav-link-custom" href="#nosotros">
                                Nosotros
                            </a>
                        )}

                        {activeProfile && (
                            <div className="navbar-profile-info d-flex align-items-center">
                                {activeProfile.avatar && (
                                    <img
                                        className="navbar-profile-avatar"
                                        src={activeProfile.avatar}
                                        alt={activeProfile.name}
                                    />
                                )}
                                {activeProfile.name && (
                                    <span className="nav-link nav-link-custom navbar-profile-name">
                                        {activeProfile.name}
                                    </span>
                                )}
                            </div>
                        )}

                        {store.token ? (
                            <>
                                {isParent && (
                                    <NavLink className="nav-link nav-link-custom" to="/parentadmin">
                                        Panel de Control
                                    </NavLink>
                                )}

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