import { Layout, Input, Tooltip, Space, Button } from "antd";
import { MessageOutlined, BellOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import UserDropdown from "../Dropdown/Dropdown";
import { getCookie } from "../../helpers/cookie";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";

const { Header: AntHeader } = Layout;
const { Search } = Input;

const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();
  const token = getCookie("token");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userData } = useSelector((state: RootState) => state.auth);

  return (
    <AntHeader className={cx("header")}>
      <div className={cx("left")}>
        <Link to="/" className={cx("logo")}>
          Phòng Khám ABC
        </Link>
        <Search
          placeholder="Tìm kiếm..."
          allowClear
          className={cx("search")}
          onSearch={(value) => console.log("Tìm:", value)}
        />
      </div>

      <Space size="middle" className={cx("right")}>
        <Tooltip title="Tư vấn trực tuyến">
          <Button type="default" icon={<MessageOutlined />} onClick={() => navigate("/chat")} />
        </Tooltip>

        <Tooltip title="Thông báo">
          <Button type="default" icon={<BellOutlined />} />
        </Tooltip>

        {token ? (
          <UserDropdown />
        ) : (
          <>
            <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate("/auth/login")}>
              Đăng nhập
            </Button>
            <Button type="primary" icon={<UserAddOutlined />} onClick={() => navigate("/auth/register")}>
              Đăng ký
            </Button>
          </>
        )}
      </Space>
    </AntHeader>
  );
}

export default Header;
