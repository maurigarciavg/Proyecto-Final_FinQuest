import {
    Route,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";

import { PrivateRoute } from "./components/PrivateRoute";
import { ParentAdmin } from "../ParentDashboard/pages/ParentAdmin";
import { Home } from "./pages/Home";
import { Layout } from "./pages/Layout";
import { NotFound } from "./pages/NotFound";
import { Orders } from "./pages/Orders";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ChildWizard } from "./components/ChildProfileCreation/ChildWizard.jsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<NotFound />}>
            <Route index element={<Home />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />

               {/* Ahora está público, pero luego será privado con login */}
            <Route path="parentadmin" element={<ParentAdmin/>} /> 

            <Route
                path="profile"
                element={(
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                )}
            />
            
            <Route
                path="orders"
                element={(
                    <PrivateRoute>
                        <Orders />
                    </PrivateRoute>
                )}
            />

            {/* 🎯 RUTA DEL WIZARD: Aquí es donde ocurre la magia de los 3 pasos */}
            <Route path="child-registration" element={<ChildWizard />} />

            <Route path="*" element={<NotFound />} />
        </Route>
    ),
    {
        future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true,
        },
    }
);