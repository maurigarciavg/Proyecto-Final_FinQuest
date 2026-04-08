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
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ChildDashboard } from "./pages/ChildDashboard";
import { Login } from "./pages/Login";
import { ProfilesPage } from "./pages/ProfilesPage.jsx";
import { ChildRegistration } from "./components/ChildProfileCreation/ChildRegistration.jsx";
import { ChildWizard } from "./components/ChildProfileCreation/ChildWizard.jsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<NotFound />}>
            <Route index element={<Home />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="login" element={<Login />} />
            <Route path="profiles" element={<ProfilesPage />} />
            {/* <Route
                path="profiles"
                element={
                    <PrivateRoute>
                    <ProfilesPage />
                    </PrivateRoute>
                }
                /> */}

            {/* Ahora está público, pero luego será privado con login */}
            <Route path="parentadmin" element={<ParentAdmin />} />

            <Route
                path="profile"
                element={(
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                )}
            />

            
            <Route
                path="child-dashboard"
                element={<ChildDashboard />}
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
            v7_skipActionErrorRevalidation: true
        }
    }
);