import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest, authHeaders } from "../services/api";


export const Home = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
       

        return () => {
            
        };
    }, []);

    const handlePurchase = async (productId) => {
        if (!store.token) {
            dispatch({
                type: "set_notice",
                payload: "Inicia sesion para crear una orden."
            });
            navigate("/sign-in");
            return;
        }

        dispatch({ type: "checkout_request" });

        try {
            
        } catch (error) {
            if (error.status === 401) {
                dispatch({
                    type: "clear_session",
                    payload: "Tu sesion ya no es valida. Entra otra vez."
                });
                navigate("/sign-in");
                return;
            }

        }
    };

    return (
        <>
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-7">
                            <p className="eyebrow">React protected routes + Flask JWT</p>
                            <h1 className="hero-title">
                                Catalogo publico, autenticacion real y ordenes privadas para cada usuario.
                            </h1>
                            <p className="hero-copy">
                                Este ejemplo incluye <code>sign_up</code>, <code>sign_in</code>,
                                <code> profile/me</code>, compra protegida y vistas privadas en React.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link className="btn btn-primary-soft" to={store.token ? "/orders" : "/sign-up"}>
                                    {store.token ? "Ver mis ordenes" : "Crear cuenta"}
                                </Link>
                                <Link className="btn btn-ghost" to={store.token ? "/profile" : "/sign-in"}>
                                    {store.token ? "Ir a mi perfil" : "Entrar al demo"}
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="panel-card credential-card">
                                <p className="eyebrow mb-2">Seed listo para probar</p>
                                <h2 className="section-title mb-3">Credenciales demo</h2>
                                <div className="credential-row">
                                    <span>Lara Instructor</span>
                                    <code>lara@example.com / demo123</code>
                                </div>
                                <div className="credential-row">
                                    <span>Diego Student</span>
                                    <code>diego@example.com / demo123</code>
                                </div>
                                <p className="section-copy mb-0">
                                    El catalogo es publico. Las ordenes y el perfil solo aparecen cuando hay sesion.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="catalog-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <p className="eyebrow">Public products</p>
                            <h2 className="section-title">Galeria de productos</h2>
                        </div>
                        <p className="section-copy mb-0">
                            Cualquier visitante puede explorar. Comprar crea una orden protegida para el usuario autenticado.
                        </p>
                    </div>

                   

                    <div className="row g-4">
                    </div>
                </div>
            </section>
        </>
    );
};
