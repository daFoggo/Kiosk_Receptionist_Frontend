import { createBrowserRouter, RouteObject } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import routes from "./routerConfig";

const routeLayout: RouteObject[] = [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: routes.home,
                element: <Home />,
            },
            {
                path: routes.about,
                element: <About />,
            }
        ]
    }
]

const router = createBrowserRouter(routeLayout);

export default router;