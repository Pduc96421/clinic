import { Layout } from "antd";
import classNames from "classnames/bind";
import styles from "./LayoutDefault.module.scss";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import { Footer } from "antd/es/layout/layout";

const cx = classNames.bind(styles);

function LayoutDefault() {
  return (
    <>
      <Layout className={cx("container")}>
        <div className={cx("header")}>
          <Header />
        </div>

        <div className={cx("content")}>
          <Outlet />
        </div>

        <Footer className={cx("footer")}>© 2025 Phòng khám ABC. All rights reserved.</Footer>
      </Layout>
    </>
  );
}

export default LayoutDefault;
