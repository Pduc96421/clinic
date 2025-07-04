import { Dropdown, Avatar, MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../../helpers/cookie";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../store/actions/login";

interface UserDropdownProps {
  userData: {
    id: string;
    username: string;
    email: string;
    role: string;
    fullName: string;
    avatar: string;
    [key: string]: any;
  } | null;
}

export default function UserDropdown({ userData }: UserDropdownProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
    } else if (key === "logout") {
      deleteCookie("token");
      dispatch(checkLogin(false, null));
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Trang cá nhân",
    },
    {
      key: "logout",
      label: "Đăng xuất",
    },
  ];

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]}>
      <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar icon={<UserOutlined />} src={userData?.avatar || "/images/avatar-default.png"} />
        <span>{userData?.username || "Tài khoản"}</span>
      </div>
    </Dropdown>
  );
}
