import React from "react";
import ChatLauncher from "./components/ChatLauncher";
import placeholder from "/placeholder.png";

export default function App() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${placeholder})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />
      <ChatLauncher />
    </>
  );
}
