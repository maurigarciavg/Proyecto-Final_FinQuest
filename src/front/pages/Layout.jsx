import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import ScrollToTop from "../components/ScrollToTop";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest, authHeaders } from "../services/api";

// 1. Importamos el CSS del Layout si decides crearlo, o usaremos estilos en línea


export const Layout = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        if (store.authChecked) return undefined;

        if (!store.token) {
            dispatch({ type: "finish_auth_check" });
            return undefined;
        }

        let isMounted = true;

        const validateStoredSession = async () => {
            dispatch({ type: "auth_request" });

            try {
                const data = await apiRequest("api/me", {
                    headers: authHeaders(store.token)
                });

                if (!isMounted) return;

                dispatch({
                    type: "auth_success",
                    payload: {
                        token: store.token,
                        user: data.user
                    }
                });
            } catch (error) {
                if (!isMounted) return;

                dispatch({
                    type: "clear_session",
                    payload: "Tu sesión expiró. Inicia sesión otra vez."
                });
            }
        };

        validateStoredSession();

        return () => {
            isMounted = false;
        };
    }, [dispatch, store.authChecked, store.token]);

    if (!store.authChecked && store.loading.auth) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 flex-column" style={{ backgroundColor: "#f8fafc" }}>
                <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem", color: "#32a89b" }}>
                    <span className="visually-hidden">Cargando FinQuest...</span>
                </div>
                <p className="mt-3 fw-bold" style={{ color: "#32a89b" }}>Cargando la aventura...</p>
            </div>
        );
    }

    return (
        <ScrollToTop>
            {/* Añadimos d-flex flex-column min-vh-100 para que el footer no flote */}
            <div className="app-shell d-flex flex-column min-vh-100">
                <Navbar />
                
                {store.notice ? (
                    <div className="container pt-3">
                        {/* 🟢 ALERTA PERSONALIZADA (Cambiamos alert-info por estilos FinQuest) */}
                        <div className="alert d-flex justify-content-between align-items-center gap-3 border-0 shadow-sm" 
                             style={{ backgroundColor: "#f0fdfa", color: "#134e4a", borderLeft: "5px solid #32a89b" }}>
                            <span>{store.notice}</span>
                            <button
                                className="btn btn-sm"
                                style={{ backgroundColor: "#32a89b", color: "white" }}
                                onClick={() => dispatch({ type: "clear_notice" })}
                                type="button"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                ) : null}

                <main className="page-content flex-grow-1">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </ScrollToTop>
    );
};
