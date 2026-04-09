import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import ScrollToTop from "../components/ScrollToTop";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest, authHeaders } from "../services/api";


export const Layout = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        if (store.authChecked) {
            return undefined;
        }

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

                if (!isMounted) {
                    return;
                }

                dispatch({
                    type: "auth_success",
                    payload: {
                        token: store.token,
                        user: data.user
                    }
                });
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                dispatch({
                    type: "clear_session",
                    payload: "Tu sesion expiro. Inicia sesion otra vez."
                });
            }
        };

        validateStoredSession();

        return () => {
            isMounted = false;
        };
    }, [dispatch, store.authChecked, store.token]);

    return (
        <ScrollToTop>
            <div className="app-shell">
                <Navbar />
                {store.notice ? (
                    <div className="container pt-3">
                        <div className="alert alert-info d-flex justify-content-between align-items-center gap-3">
                            <span>{store.notice}</span>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => dispatch({ type: "clear_notice" })}
                                type="button"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                ) : null}
                <main className="page-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ScrollToTop>
    );
};
