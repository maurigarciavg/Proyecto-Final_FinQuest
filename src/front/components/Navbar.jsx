import { NavLink, useNavigate } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";


export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "clear_session", payload: "Sesion cerrada correctamente." });
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg nav-shell">
            <div className="container">
                <NavLink className="navbar-brand brand-mark" to="/">
                    Auth Shop
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mainNavbar">
                    <div className="navbar-nav gap-lg-2 ms-auto align-items-lg-center">
                        <NavLink className="nav-link" to="/">
                            Catalogo
                        </NavLink>
                        {store.token ? (
                            <>
                                <NavLink className="nav-link" to="parentadmin">
                                    Panel de control
                                </NavLink>
                                <NavLink className="nav-link" to="/profile">
                                    Mi perfil
                                </NavLink>
                                <button className="btn btn-ghost" onClick={handleLogout} type="button">
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink className="nav-link" to="/sign-in">
                                    Sign in
                                </NavLink>
                                <NavLink className="btn btn-primary-soft" to="/sign-up">
                                    Crear cuenta
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
