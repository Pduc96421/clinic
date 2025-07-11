import { Dropdown, Avatar, MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../../helpers/cookie";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin } from "../../store/actions/login";
import classNames from "classnames/bind";
import styles from "./Dropdown.module.scss";
import { RootState } from "../../store/reducers";

const cx = classNames.bind(styles);

export default function UserDropdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
    } else if (key === "logout") {
      deleteCookie("token");
      dispatch(checkLogin(false, null));
      navigate("/");
    } else if (key === "friends") {
      navigate("/friends");
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Trang cá nhân",
    },
    {
      key: "friends",
      label: "Bạn bè",
    },
    {
      key: "logout",
      label: "Đăng xuất",
    },
  ];

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]}>
      <div className={cx("user-dropdown")}>
        <Avatar
          icon={<UserOutlined />}
          src={userData?.avatar || "/images/avatar-default.png"}
          className={cx("avatar")}
        />
        <span className={cx("username")}>{userData?.username || "Tài khoản"}</span>
      </div>
    </Dropdown>
  );
}
