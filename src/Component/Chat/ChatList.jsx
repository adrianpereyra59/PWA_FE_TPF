import React from "react"
import { useNavigate } from "react-router-dom"
import ChatItem from "./ChatItem"
import { useWhatsApp } from "../../Context/WhatsappContext"

export default function ChatsList() {
    const navigate = useNavigate()
    const { filteredContacts, getLastMessage, getUnreadCount } = useWhatsApp()

    const handleChatClick = (contactId) => {
        navigate(`/message/${contactId}`)
    }

    if (filteredContacts.length === 0) {
        return (
            <div className="empty-chats">
                <p>No se encontraron chats</p>
            </div>
        )
    }

    return (
        <div className="chats-container">
            {filteredContacts.map((contact) => {
                const lastMessage = getLastMessage(contact.id)
                const unreadCount = getUnreadCount(contact.id)

                return (
                    <ChatItem
                        key={contact.id}
                        contact={contact}
                        lastMessage={lastMessage}
                        unreadCount={unreadCount}
                        onClick={() => handleChatClick(contact.id)}
                    />
                )
            })}
        </div>
    )
}
