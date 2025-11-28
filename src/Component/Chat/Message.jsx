import React from "react";
export default function Message({ message }) {
    return (
        <div className={`message ${message.sender === "me" ? "message-sent" : "message-received"}`}>
            <div className="message-content">
                <p className="message-text">{message.text}</p>
                <span className="message-time">{message.time}</span>
            </div>
        </div>
    )
}
