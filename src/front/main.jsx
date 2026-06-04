import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { BackendURL } from "./components/common/BackendURL";
import { StoreProvider } from "./hooks/useGlobalReducer";
import "./index.css";
import { router } from "./routes";

const Main = () => {

    if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "") {
        return (
            <React.StrictMode>
                <BackendURL />
            </React.StrictMode>
        );
    }

    return (
        <React.StrictMode>
            <StoreProvider>
                <RouterProvider router={router} />
            </StoreProvider>
        </React.StrictMode>
    );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
