import React from "react"
export default function ChatItem({ contact, lastMessage, unreadCount, onClick }) {
    const displayMessage = lastMessage ? lastMessage.text : "No hay mensajes"
    const displayTime = lastMessage ? lastMessage.time : ""

    return (
        <div
            className="chat-item"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
        >
            <div className="chat-avatar">
                <img src={contact.avatar || "/placeholder.svg"} alt={`Avatar de ${contact.name}`} />
                {contact.isOnline && <div className="online-indicator" aria-label="En línea"></div>}
            </div>

            <div className="chat-content">
                <div className="chat-header">
                    <h3 className="chat-name">{contact.name}</h3>
                    <span className="chat-time">{displayTime}</span>
                </div>
                <div className="chat-footer">
                    <p className="chat-message">{displayMessage}</p>
                    {unreadCount > 0 && (
                        <span className="unread-badge" aria-label={`${unreadCount} mensajes no leídos`}>
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
