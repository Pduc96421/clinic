import PrivateRoutes from "../components/PrivateRoutes/PrivateRoutes";
import LayoutDefault from "../layouts/LayoutDefault/LayoutDefault";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyAccount from "../pages/auth/VerifyAccount/VerifyAccount";
import ChatLayout from "../pages/chat/ChatLayout/ChatLayout";
import Home from "../pages/home/Home/Home";
import Profile from "../pages/profile/Profile/Profile";
import UpdateUser from "../pages/profile/UpdateUser/UpdateUser";

export const routes = [
  {
    element: <LayoutDefault />,
    children: [
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/register", element: <Register /> },
      { path: "/auth/verify-account", element: <VerifyAccount /> },
      { path: "/", element: <Home /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "/chat", element: <ChatLayout /> },
          {
            path: "/profile",
            children: [
              { path: "", element: <Profile /> },
              {
                path: "edit",
                element: <UpdateUser />,
              },
            ],
          },
        ],
      },
    ],
  },
];
