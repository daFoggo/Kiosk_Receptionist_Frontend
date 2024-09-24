import { createBrowserRouter, RouteObject } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import CCCD from "../pages/CCCD";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Upload from "../components/Upload";
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
    element: <DashboardLayout />,
    children: [
        {
            path: routes.dashboard,
            element: <Dashboard />,
        },
        {
          path: routes.upload,
          element: <Upload />
        }
    ]
  },
  {
    path: "/admin/" + routes.login,
    element: <Login/>
  }

];

const router = createBrowserRouter(routeLayout);

export default router;
