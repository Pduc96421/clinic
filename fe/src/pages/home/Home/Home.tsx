import { Button, Typography, Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";

const cx = classNames.bind(styles);
const { Title, Paragraph } = Typography;

function Home() {
  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <div className={cx("home-container")}>
      <section className={cx("hero-section")}>
        <Row gutter={32} align="middle">
          <Col xs={24} md={12}>
            <Title className={cx("headline")}>Phòng Khám Tư Nhân ABC</Title>
            <Paragraph className={cx("description")}>
              Chăm sóc sức khỏe tận tâm, chất lượng hàng đầu. Đặt lịch khám dễ dàng với đội ngũ bác sĩ giàu kinh nghiệm.
            </Paragraph>
            <div className={cx("button-group")}>
              {isLoggedIn || (
                <Button type="primary" size="large" onClick={() => navigate("/auth/register")}>
                  Đăng ký ngay
                </Button>
              )}
              <Button type="default" size="large" onClick={() => navigate("/chat")}>
                Tư vấn trực tuyến
              </Button>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <img src="/images/clinic-illustration.png" alt="Phòng khám" className={cx("hero-image")} />
          </Col>
        </Row>
      </section>

      <section className={cx("features-section")}>
        <Title level={3} className={cx("section-title")}>
          Dịch vụ nổi bật
        </Title>
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Card title="Đặt lịch khám" variant="borderless">
              Hệ thống đặt lịch linh hoạt, chủ động chọn thời gian phù hợp với bạn.
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Bác sĩ chuyên môn" variant="borderless">
              Đội ngũ bác sĩ tận tâm, kinh nghiệm, và chuyên gia trong nhiều lĩnh vực.
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Hỗ trợ trực tuyến" variant="borderless">
              Hệ thống tư vấn trực tuyến nhanh chóng và tiện lợi mọi lúc, mọi nơi.
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
}

export default Home;
