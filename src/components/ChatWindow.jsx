import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import styles from "../styles/ChatWindow.module.css";
import { motion, AnimatePresence } from "framer-motion";

function mock() {
  const t = [
    "Hi there! 👋",
    "Hello! How can I assist you today?",
    "Could you tell me more about your services?",
    "Sure! We create 3D‑animated chatbot mascots that boost engagement.",
    "Sounds great! Do you support multilingual content?",
    "Absolutely — we can localise to any language you need.",
    "Cool, what's the pricing for a small business package?",
    "It starts at €1,600 per year, including basic animations.",
    "Nice! And do you integrate with Shopify?",
    "Yes, integration is straightforward with our embed snippet.",
    "Awesome — can I see a demo?",
    "Of course! I can set one up for you.",
    "Thanks!",
    "You're welcome! Anything else?",
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
  }));
}

export default function ChatWindow() {
  const messages = mock();
  const newest = messages.length - 1;
  const [cursor, setCursor] = useState(newest);
  const scrollTimeout = useRef(null);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(Date.now());

  const clamp = (i) => Math.min(newest, Math.max(1, i));

  const handleScroll = (e) => {
    e.preventDefault();
    lastScrollTime.current = Date.now();

    if (!isScrolling.current) {
      isScrolling.current = true;
      requestAnimationFrame(() => smoothScroll(e.deltaY));
    }
  };

  const smoothScroll = (deltaY) => {
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTime.current;

    if (timeSinceLastScroll > 100) {
      // Slightly faster response
      isScrolling.current = false;
      if (deltaY > 0) {
        setCursor((c) => clamp(c + 1));
      } else if (deltaY < 0) {
        setCursor((c) => clamp(c - 1));
      }
    } else {
      requestAnimationFrame(() => smoothScroll(deltaY));
    }
  };

  const handleMouseLeave = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    if (cursor === newest) return;

    scrollTimeout.current = setTimeout(() => {
      const returnToNewest = async () => {
        const steps = newest - cursor;
        for (let i = 0; i < steps; i++) {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Reduced from 300 to 100ms
          setCursor((c) => c + 1);
        }
      };
      returnToNewest();
    }, 300); // Reduced from 500 to 300ms for faster start
  };

  const handleMouseEnter = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
  };

  useEffect(() => {
    setCursor(newest);
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const visible = [messages[cursor - 1], messages[cursor]];

  return (
    <div className={styles.window}>
      <div
        className={styles.viewport}
        onWheel={handleScroll}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <div className={styles.messageWrapper}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((m) => (
              <motion.div
                key={m.id}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: m.author === "user" ? 50 : -50,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  x: m.author === "user" ? 50 : -50,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.8,
                  duration: 0.15, // Added shorter duration for faster animations
                }}
                layout
              >
                <Message author={m.author} text={m.text} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className={styles.inputBar}>
        <input type="text" placeholder="Type your message…" disabled />
        <button disabled>Send</button>
      </div>
    </div>
  );
}
