/* eslint-disable react/prop-types */
import React from "react";
import "./Chat.scss";

function Chat({
  outMessage,
  messages,
  isButtonActive,
  handleSendMessage,
  handleKeyDown,
  onOutMessageChange,
}) {
  return (
    <div className="chat">
      <div className="chat__container">
        <ul className="chat__dialog-window">
          {messages
            .slice()
            .reverse()
            .map((message, index) => (
              <li
                className={`chat__dialog-window-item chat__dialog-window-item--${message.type}`}
                key={index}
              >
                <img src={message.avatar} className="avatar" alt="avatar" />
                {message.text}
              </li>
            ))}
        </ul>
        <div className="chat__input-area">
          <input
            type="text"
            className="chat__input-message"
            placeholder="Введите сообщение"
            maxLength="1000"
            value={outMessage}
            onChange={onOutMessageChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`chat__button-submit ${isButtonActive ? "active" : ""}`}
            onClick={handleSendMessage}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
