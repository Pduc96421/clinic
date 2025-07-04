import PrivateRoutes from "../components/PrivateRoutes/PrivateRoutes";
import LayoutDefault from "../layouts/LayoutDefault/LayoutDefault";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyAccount from "../pages/auth/VerifyAccount/VerifyAccount";
import ChatLayout from "../pages/chat/ChatLayout/ChatLayout";
import Home from "../pages/home/Home/Home";

export const routes = [
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/register", element: <Register /> },
  { path: "/auth/verify-account", element: <VerifyAccount /> },
  {
    element: <LayoutDefault />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: '/chat',
        element: <ChatLayout />
      },
      {
        element: <PrivateRoutes />,
        children: [],
      },
    ],
  },
];
