import React from "react"
import Message from "./Message"

export default function MessagesList({ messages, messagesEndRef }) {
    return (
        <div className="messages-container">
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}
