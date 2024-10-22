import { createBrowserRouter, RouteObject } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import IdentifyData from "@/pages/IdentifyData/IdentifyData";
import Login from "@/pages/Login/Login";
import WeeklyCalendarManage from "@/pages/WeeklyCalendarManage/WeeklyCalendarManage";
import ImageUpload from "@/pages/ImageUpload/ImageUpload";
import routes from "./routerConfig";
import EventManage from "@/pages/EventManage/EventManage";

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
        element: <WeeklyCalendarManage />,
      },
      {
        path: routes.eventManage,
        element: <EventManage />,
      },
    ],
  },
  {
    path: "/admin/" + routes.login,
    element: <Login />,
  },
  {
    path: routes.imageUpload,
    element: <ImageUpload />,
  },
];

const router = createBrowserRouter(routeLayout);

export default router;
