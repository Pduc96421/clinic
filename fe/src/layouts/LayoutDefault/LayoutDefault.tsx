import { Layout } from "antd";
import classNames from "classnames/bind";
import styles from "./LayoutDefault.module.scss";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

const cx = classNames.bind(styles);

function LayoutDefault() {
  return (
    <>
      <Layout className={cx("container")}>
        <Header />

        <Outlet />
      </Layout>
    </>
  );
}

export default LayoutDefault;
