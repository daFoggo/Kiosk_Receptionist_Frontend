import { createBrowserRouter, RouteObject } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import CCCD from "../pages/CCCD";
import Dashboard from "../pages/Dashboard";
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
      },
      {
        path: routes.cccd,
        element: <CCCD />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
        {
            path: routes.dashboard,
            element: <Dashboard />,
        }
    ]
  },
];

const router = createBrowserRouter(routeLayout);

export default router;
