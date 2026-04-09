import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest, authHeaders } from "../services/api";


export const Profile = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            dispatch({ type: "auth_request" });

            try {
                const data = await apiRequest("api/profile", {
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

                if (error.status === 401) {
                    dispatch({
                        type: "clear_session",
                        payload: "Tu sesion ya no es valida. Entra otra vez."
                    });
                    navigate("/sign-in", { replace: true });
                    return;
                }

                dispatch({
                    type: "auth_failure",
                    payload: error.message
                });
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [dispatch, navigate, store.token]);

    return (
        <section className="private-section">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-5">
                        <div className="panel-card h-100">
                            <p className="eyebrow">Protected endpoint</p>
                            <h1 className="section-title">Mi perfil</h1>
                            <p className="section-copy">
                                Esta vista consume <code>/api/profile</code> y solo existe si el JWT es valido.
                            </p>

                            {store.errors.auth ? (
                                <div className="alert alert-danger">{store.errors.auth}</div>
                            ) : null}

                            <dl className="profile-list mb-0">
                                <div>
                                    <dt>Nombre</dt>
                                    <dd>{store.user?.name}</dd>
                                </div>
                                <div>
                                    <dt>Email</dt>
                                    <dd>{store.user?.email}</dd>
                                </div>
                                <div>
                                    <dt>Estado</dt>
                                    <dd>{store.user?.is_active ? "Activo" : "Inactivo"}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="panel-card h-100">
                            <p className="eyebrow">Front-end routing</p>
                            <h2 className="section-title">Paginas privadas en React</h2>
                            <p className="section-copy">
                                Las rutas <code>/profile</code> y <code>/orders</code> usan un <code>PrivateRoute</code>
                                que redirige al usuario a <code>/sign-in</code> si no hay sesion.
                            </p>
                            <div className="feature-grid">
                                <div className="feature-item">
                                    <h3>JWT persistido</h3>
                                    <p>La sesion se guarda en <code>localStorage</code> y se valida al abrir la app.</p>
                                </div>
                                <div className="feature-item">
                                    <h3>Endpoint me/profile</h3>
                                    <p>La API devuelve solo los datos del usuario autenticado.</p>
                                </div>
                                <div className="feature-item">
                                    <h3>Ordenes privadas</h3>
                                    <p>Cada usuario solo ve las compras asociadas a su <code>user_id</code>.</p>
                                </div>
                            </div>
                            <Link className="btn btn-primary-soft mt-4" to="/parentadmin">
                                Panel de control
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
