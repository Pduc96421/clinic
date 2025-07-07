import PrivateRoutes from "../components/PrivateRoutes/PrivateRoutes";
import LayoutDefault from "../layouts/LayoutDefault/LayoutDefault";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyAccount from "../pages/auth/VerifyAccount/VerifyAccount";
import ChatLayout from "../pages/chat/ChatLayout/ChatLayout";
import FriendList from "../pages/friends/FriendList/FriendList";
import FriendsPage from "../pages/friends/FriendPage/FriendPage";
import Requests from "../pages/friends/Requests/Requests";
import SentRequests from "../pages/friends/SentRequest/SentRequest";
import Suggestions from "../pages/friends/Suggestions/Suggestions";
import Home from "../pages/home/Home/Home";
import ChangePassword from "../pages/profile/changePassword/ChangePassword";
import Profile from "../pages/profile/Profile/Profile";
import UpdateUser from "../pages/profile/UpdateUser/UpdateUser";
import UserProfile from "../pages/user/UserProfile/UserProfile";

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
              { path: "edit", element: <UpdateUser /> },
              { path: "change-password", element: <ChangePassword /> },
            ],
          },
          {
            path: "/friends",
            element: <FriendsPage />,
            children: [
              { path: "", element: <FriendList /> },
              { path: "requests", element: <Requests /> },
              { path: "suggestions", element: <Suggestions /> },
              { path: "sent", element: <SentRequests /> },
            ],
          },
          {
            path: "/user",
            children: [{ path: ":userId", element: <UserProfile /> }],
          },
        ],
      },
    ],
  },
];
