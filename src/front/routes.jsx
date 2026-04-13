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
// 🟢 Eliminada la importación de Profile
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ChildDashboard } from "./pages/ChildDashboard";
import { ProfilesPage } from "./pages/ProfilesPage.jsx";
import { ChildWizard } from "./components/ChildProfileCreation/ChildWizard.jsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<NotFound />}>
            <Route path="/" element={<Home />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            
            {/* 🟢 Selector de perfiles (Sustituye a la lógica de "Profile" antiguo) */}
            <Route
                path="profiles"
                element={
                    <PrivateRoute>
                        <ProfilesPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="parentadmin"
                element={
                    <PrivateRoute>
                        <ParentAdmin />
                    </PrivateRoute>
                }
            />

            {/* 🔴 RUTA /PROFILE ELIMINADA */}

            <Route
                path="child-dashboard/:childId" 
                element={(
                    <PrivateRoute>
                        <ChildDashboard />
                    </PrivateRoute>
                )}
            />

            <Route
                path="child-registration"
                element={(
                    <PrivateRoute>
                        <ChildWizard />
                    </PrivateRoute>
                )}
            />

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
            v7_skipActionErrorRevalidation: true
        }
    }
);