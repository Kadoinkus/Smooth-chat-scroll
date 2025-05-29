import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import styles from "../styles/ChatWindow.module.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function mock() {
  const t = [
    "Hi there! 👋",
    "Hello! How can I assist you today?",
    "Could you tell me more about your services?",
    "Sure! We create 3D‑animated chatbot mascots that boost engagement.",
    "Sounds great! Do you support multilingual content?",
    "Absolutely — we can localise to any language you need.",
    "Cool, what’s the pricing for a small business package?",
    "It starts at €1,600 per year, including basic animations.",
    "Nice! And do you integrate with Shopify?",
    "Yes, integration is straightforward with our embed snippet.",
    "Awesome — can I see a demo?",
    "Of course! I can set one up for you.",
    "Thanks!",
    "You’re welcome! Anything else?",
    "Not right now.",
    "Feel free to reach out anytime.",
    "Will do. Bye!",
    "Have a great day! 😊",
    "👋",
    "End of simulated chat.",
  ];
  return t.map((txt, i) => ({
    id: i,
    author: i % 2 === 0 ? "bot" : "user",
    text: txt,
    fontSize: (0.9 + Math.random() * 0.5).toFixed(2) + "rem",
  }));
}

export default function ChatWindow() {
  const messages = mock();
  const newest = messages.length - 1;
  const [cursor, setCursor] = useState(newest);
  const idle = useRef(null);

  const clamp = (i) => Math.min(newest, Math.max(1, i));

  const step = (dir) => setCursor((c) => clamp(c + dir));

  const wheel = (e) => {
    e.preventDefault();
    step(e.deltaY < 0 ? -1 : 1);
    reset();
  };
  const enter = () => clearTimeout(idle.current);
  const leave = () => snapBack();

  const snapBack = () => setCursor(newest);
  const reset = () => {
    clearTimeout(idle.current);
    idle.current = setTimeout(snapBack, 800);
  };

  useEffect(() => snapBack(), []);

  const visible = [messages[cursor - 1], messages[cursor]];

  return (
    <div className={styles.window}>
      <div
        className={styles.viewport}
        onWheel={wheel}
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        <TransitionGroup className={styles.messageWrapper}>
          {visible.map((m) => (
            <CSSTransition key={m.id} timeout={250} classNames="msg">
              <Message author={m.author} text={m.text} fontSize={m.fontSize} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <div className={styles.inputBar}>
        <input type="text" placeholder="Type your message…" disabled />
        <button disabled>Send</button>
      </div>
    </div>
  );
}
