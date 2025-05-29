import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import styles from "../styles/ChatWindow.module.css";

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && <ChatWindow />}
      <button className={styles.launcher} onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Chatbot"}
      </button>
    </>
  );
}
