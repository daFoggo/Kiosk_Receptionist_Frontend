import { createBrowserRouter, RouteObject } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import CCCD from "../pages/CCCD";
import IdentifyData from "../pages/IdentifyData";
import Login from "../pages/Login";
import WeeklyCalendarManage from "../pages/WeeklyCalendarManage";
import ImageUpload from "../pages/ImageUpload";
import routes from "./routerConfig";
import EventManage from "../pages/EventManage";

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
            path: routes.identifyData,
            element: <IdentifyData />,
        },
        {
          path: routes.weekCalendar,
          element: <WeeklyCalendarManage />
        },
        {
          path: routes.eventManage,
          element: <EventManage />
        },
    ]
  },
  {
    path: "/admin/" + routes.login,
    element: <Login/>
  },
  {
    path: routes.imageUpload,
    element: <ImageUpload />
  }
];

const router = createBrowserRouter(routeLayout);

export default router;
