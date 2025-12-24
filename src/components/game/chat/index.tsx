import { useEffect } from "preact/hooks";
import { useChat } from "../../../hooks/chat";
import styles from "./index.module.css";

export function Chat() {
  const {
    messages,
    chatMessagesRef,
    inputRef,
    onBlur,
    onFocus,
    onScroll,
    style,
  } = useChat();

  useEffect(() => {
    onScroll();
  }, []);

  return (
    <>
      <div style={style} class={styles.chat}>
        <div
          class={styles.chatMessages}
          onScroll={() => onScroll()}
          ref={chatMessagesRef}
        >
          {messages.map((value, index) => (
            <div class={styles.chatMessage} key={index}>
              <span>{value.author}</span>: {value.msg}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Hey! Chat here..."
          maxLength={4000}
          autocomplete="off"
          onFocus={onFocus}
          onBlur={onBlur}
          ref={inputRef}
          class={`bg-white text-black p-0.5 font-["Open Sans"]`}
        />
      </div>
    </>
  );
}
