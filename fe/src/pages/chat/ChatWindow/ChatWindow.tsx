import { useEffect, useRef, useState } from "react";
import { Input, Button, Avatar, message } from "antd";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ChatWindow.module.scss";
import { getMessages, sendMessage } from "../../../services/chat.service";
import LoadingUi from "../../../components/LoadingUi/LoadingUi";

const { TextArea } = Input;
const cx = classNames.bind(styles);

export default function ChatWindow() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<any | null>(null);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId) fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getMessages(roomId!);
      setMessages(res.data.result);
    } catch (err) {
      message.error("Không thể lấy tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!content.trim()) return;
    setSending(true);
    try {
      const newMessage = {
        room_chat_id: roomId!,
        content: content.trim(),
        reply_chat_id: replyTo?._id,
      };
      const res = await sendMessage(newMessage);
      const sentMsg = {
        ...res.data.result,
        user_id: {
          _id: userData.id,
          avatar: userData.avatar,
          fullName: userData.fullName,
        },
        reply_chat_id: replyTo,
      };
      setMessages((prev) => [...prev, sentMsg]);
      setContent("");
      setReplyTo(null);
    } catch (err) {
      message.error("Không thể gửi tin nhắn");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={cx("chat-window")}>
      <div className={cx("messages")}>
        {loading ? (
          <LoadingUi />
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.user_id?._id === userData.id;
            return (
              <div key={index} className={cx("message-row", { me: isMe })}>
                {!isMe && <Avatar src={msg.user_id?.avatar} className={cx("avatar")} />}

                {isMe && (
                  <div className={cx("message-actions")}>
                    <button onClick={() => console.log("Reaction", msg._id)}>😊</button>
                    <button onClick={() => setReplyTo(msg)}>↩</button>
                    <button onClick={() => console.log("More", msg._id)}>⋯</button>
                  </div>
                )}

                <div className={cx("message-bubble")}>
                  {msg.reply_chat_id && (
                    <div className={cx("reply-content")}>
                      <div className={cx("reply-author")}>{msg.reply_chat_id.user_id?.fullName || "Ẩn danh"}</div>
                      <div className={cx("reply-text")}>{msg.reply_chat_id.content}</div>
                    </div>
                  )}
                  <span>{msg.content}</span>
                </div>

                {!isMe && (
                  <div className={cx("message-actions")}>
                    <button onClick={() => console.log("Reaction", msg._id)}>😊</button>
                    <button onClick={() => setReplyTo(msg)}>↩</button>
                    <button onClick={() => console.log("More", msg._id)}>⋯</button>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      <div className={cx("input-area")}>
        <div className={cx("reply")}>
          {replyTo && (
            <div className={cx("reply-preview")}>
              <strong>Đang trả lời {replyTo.user_id?.fullName || "..."}</strong>: {replyTo.content}
              <Button size="small" onClick={() => setReplyTo(null)} style={{ marginLeft: 8 }}>
                Hủy
              </Button>
            </div>
          )}
        </div>

        <div className={cx("submit")}>
          <TextArea
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button type="primary" onClick={handleSend} loading={sending}>
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
}
