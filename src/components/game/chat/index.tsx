import { useEffect } from "preact/hooks";
import { useChat } from "../../../hooks/chat";
import styles from "./index.module.css";
import { useAssetsStore } from "../../../stores/assets";

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
          {messages.map((value, index) => {
            const color =
              useAssetsStore.getState().worlds[value.world].properties
                ?.fillStyle;
            return (
              <div
                class={styles.chatMessage}
                key={index}
                style={"color: " + color}
              >
                <span>{value.author}</span>: {value.content}
              </div>
            );
          })}
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
