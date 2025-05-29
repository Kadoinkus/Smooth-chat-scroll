import React from 'react';
import styles from '../styles/ChatWindow.module.css';

export default function Message({ author, text, fontSize }) {
  return (
    <div
      className={`${styles.message} ${author === 'user' ? styles.user : ''}`}
      style={{ fontSize }}
    >
      {text}
    </div>
  );
}