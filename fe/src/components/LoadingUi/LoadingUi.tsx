import classNames from "classnames/bind";
import styles from "./LoadingUi.module.scss";

const cx = classNames.bind(styles);

function LoadingUi() {
  return <div className={cx("loader")}></div>;
}

export default LoadingUi;
