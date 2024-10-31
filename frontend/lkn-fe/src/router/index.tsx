import Login from "../pages/Login";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import { createBrowserRouter, Navigate, useRouteError } from "react-router-dom"
import Dashboard from "../pages/Dashboard";

function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);
    // Uncaught ReferenceError: path is not defined
    return <div>Dang!</div>;
}

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: '*',
                element: <h1>Not Found</h1>
            }, {
                path: 'unauthorized',
                element: <h1>Unauthorized</h1>
            },
            // Public Routes
            {
                path: "auth",
                children: [
                    {
                        path: "signin",
                        element: <Login />
                    },
                ]
            },
            {
                index: true,
                element: <Navigate to="/dashboard" replace />
            },
            // Authenticated Routes
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "/",
                        errorElement: <>Error on Authenticated Routes</>,
                        children: [
                            {
                                path: "dashboard",
                                element: <Dashboard />
                            }
                        ]
                    }
                ]
            }
        ]
    }
])

export default router
