import { Input, Button } from "antd";
import styles from "../../styles/chat.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function ChatWindow() {
  return (
    <div className={cx("chat-window")}>
      <div className={cx("messages")}>
        {/* Replace with dynamic messages later */}
        <div className={cx("message", "me")}>Hello</div>
        <div className={cx("message", "other")}>Hi!</div>
      </div>
      <div className={cx("input-area")}>
        <Input.TextArea rows={1} placeholder="Nhập tin nhắn..." />
        <Button type="primary">Gửi</Button>
      </div>
    </div>
  );
}
