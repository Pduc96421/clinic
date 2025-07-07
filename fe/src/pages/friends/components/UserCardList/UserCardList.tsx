import { FC } from "react";
import { Row, Col, Card, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import styles from "./UserCardList.module.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const { Meta } = Card;

interface User {
  _id: string;
  fullName: string;
  username: string;
  avatar?: string;
}

interface Props {
  users: User[];
  actions?: (user: User) => React.ReactNode[];
}

const UserCardList: FC<Props> = ({ users, actions }) => {
  const navigate = useNavigate();

  const onCardClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className={cx("wrapper")}>
      <Row gutter={[24, 24]}>
        {users.map((user) => (
          <Col key={user._id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card
              cover={
                <img
                  alt="avatar"
                  src={user.avatar || "/images/avatar-default.png"}
                  className={cx("cover")}
                  onClick={() => onCardClick(user._id)}
                  style={{ cursor: "pointer" }}
                />
              }
              actions={actions ? actions(user) : []}
              className={cx("card")}
              hoverable
            >
              <Meta
                avatar={
                  <Avatar
                    src={user.avatar || "/images/avatar-default.png"}
                    icon={<UserOutlined />}
                    onClick={() => onCardClick(user._id)}
                    style={{ cursor: "pointer" }}
                  />
                }
                title={
                  <span className={cx("name")} onClick={() => onCardClick(user._id)} style={{ cursor: "pointer" }}>
                    {user.fullName}
                  </span>
                }
                description={
                  <span className={cx("username")} onClick={() => onCardClick(user._id)} style={{ cursor: "pointer" }}>
                    {user.username}
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UserCardList;
