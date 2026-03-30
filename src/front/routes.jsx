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


export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<NotFound />}>
            <Route index element={<Home />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
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
            <Route
                path="parentadmin"
                element={(
                    <PrivateRoute>
                        <ParentAdmin />
                    </PrivateRoute>
                )}
            />
            <Route path="*" element={<NotFound />} />
        </Route>
    )
);
