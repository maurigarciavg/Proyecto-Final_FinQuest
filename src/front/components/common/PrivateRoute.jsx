import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

import useGlobalReducer from "../../hooks/useGlobalReducer";


export const PrivateRoute = ({ children }) => {
    const { store } = useGlobalReducer();
    const location = useLocation();

    if (!store.authChecked) {
        return (
            <div className="container py-5">
                <div className="panel-card text-center">
                    <p className="eyebrow mb-2">Checking session</p>
                    <h1 className="section-title">Validando acceso...</h1>
                    <p className="section-copy mb-0">
                        Estamos comprobando si ya existe una sesion valida.
                    </p>
                </div>
            </div>
        );
    }

    if (!store.token) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }

    return children;
};


PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};
