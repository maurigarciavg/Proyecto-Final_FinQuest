import {
    Route,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";

import { PrivateRoute } from "./components/PrivateRoute";
import { Home } from "./pages/Home";
import { Layout } from "./pages/Layout";
import { NotFound } from "./pages/NotFound";
import { Orders } from "./pages/Orders";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ChildDashboard } from "./pages/ChildDashboard";

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
                path="child-dashboard"
                element={<ChildDashboard />}
            />
            <Route path="*" element={<NotFound />} />
        </Route>
    )
);
