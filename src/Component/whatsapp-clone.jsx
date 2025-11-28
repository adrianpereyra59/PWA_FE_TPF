import React from "react"
import { useState } from "react"
import "./whatsapp-clone.css"

export default function WhatsAppClone() {
    const [activeTab, setActiveTab] = useState("chats")
    const [searchTerm, setSearchTerm] = useState("")
    const [activeChat, setActiveChat] = useState(null)
    const [newMessage, setNewMessage] = useState("")

    const [chatMessages, setChatMessages] = useState({
        1: [
            { id: 1, text: "Hola, ¿cómo estás?", sender: "contact", time: "10:30" },
            { id: 2, text: "¡Hola! Todo bien, ¿y tú?", sender: "me", time: "10:32" },
        ],
        2: [{ id: 1, text: "¿Vamos al cine esta noche?", sender: "contact", time: "09:45" }],
        3: [
            { id: 1, text: "No olviden la cena de mañana", sender: "contact", time: "08:20" },
            { id: 2, text: "¿A qué hora es?", sender: "me", time: "08:25" },
            { id: 3, text: "A las 7pm", sender: "contact", time: "08:26" },
            { id: 4, text: "Perfecto, ahí estaremos", sender: "me", time: "08:27" },
            { id: 5, text: "¿Llevamos algo?", sender: "me", time: "08:28" },
        ],
        4: [{ id: 1, text: "Gracias por tu ayuda 😊", sender: "contact", time: "Ayer" }],
        5: [{ id: 1, text: "La reunión es a las 3pm", sender: "contact", time: "Ayer" }],
        6: [{ id: 1, text: "¿Has visto el partido?", sender: "contact", time: "Lun" }],
    })

    const chats = [
        {
            id: 1,
            name: "María García",
            lastMessage: "¡Hola! Todo bien, ¿y tú?",
            time: "10:32",
            unread: 0,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
            status: "en línea",
        },
        {
            id: 2,
            name: "Juan Pérez",
            lastMessage: "¿Vamos al cine esta noche?",
            time: "09:45",
            unread: 1,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
            status: "última vez hoy a las 09:45",
        },
        {
            id: 3,
            name: "Familia 👨‍👩‍👧‍👦",
            lastMessage: "¿Llevamos algo?",
            time: "08:28",
            unread: 0,
            avatar: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=50&h=50&fit=crop&crop=face",
            status: "en línea",
        },
        {
            id: 4,
            name: "Ana López",
            lastMessage: "Gracias por tu ayuda 😊",
            time: "Ayer",
            unread: 0,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
            status: "última vez ayer a las 16:20",
        },
        {
            id: 5,
            name: "Trabajo - Equipo",
            lastMessage: "La reunión es a las 3pm",
            time: "Ayer",
            unread: 1,
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face",
            status: "última vez ayer a las 15:00",
        },
        {
            id: 6,
            name: "Pedro Martínez",
            lastMessage: "¿Has visto el partido?",
            time: "Lun",
            unread: 0,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
            status: "última vez el lunes a las 20:15",
        },
    ]

    const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleChatClick = (chat) => {
        setActiveChat(chat)
        const updatedChats = chats.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
    }

    const handleSendMessage = () => {
        if (newMessage.trim() && activeChat) {
            const currentTime = new Date().toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            })

            const newMsg = {
                id: Date.now(),
                text: newMessage.trim(),
                sender: "me",
                time: currentTime,
            }

            setChatMessages((prev) => ({
                ...prev,
                [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
            }))

            setNewMessage("")

            setTimeout(() => {
                const responses = [
                    "¡Genial!",
                    "Perfecto 👍",
                    "Entendido",
                    "¡Gracias!",
                    "De acuerdo",
                    "¡Excelente!",
                    "👌",
                    "¡Perfecto!",
                    "Sí, claro",
                    "¡Por supuesto!",
                ]
                const randomResponse = responses[Math.floor(Math.random() * responses.length)]

                const responseMsg = {
                    id: Date.now() + 1,
                    text: randomResponse,
                    sender: "contact",
                    time: new Date().toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                }

                setChatMessages((prev) => ({
                    ...prev,
                    [activeChat.id]: [...(prev[activeChat.id] || []), responseMsg],
                }))
            }, 2000)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const renderChatView = () => {
        const messages = chatMessages[activeChat.id] || []

        return (
            <div className="chat-view">
                <div className="chat-header">
                    <button className="back-button" onClick={() => setActiveChat(null)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                        </svg>
                    </button>
                    <div className="chat-header-info">
                        <img src={activeChat.avatar || "/placeholder.svg"} alt={activeChat.name} className="chat-header-avatar" />
                        <div className="chat-header-details">
                            <h3 className="chat-header-name">{activeChat.name}</h3>
                            <p className="chat-header-status">{activeChat.status}</p>
                        </div>
                    </div>
                    <div className="chat-header-actions">
                        <button className="icon-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                            </svg>
                        </button>
                        <button className="icon-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                            </svg>
                        </button>
                        <button className="icon-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="messages-container">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.sender === "me" ? "message-sent" : "message-received"}`}
                        >
                            <div className="message-content">
                                <p className="message-text">{message.text}</p>
                                <span className="message-time">{message.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="message-input-container">
                    <button className="attachment-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z" />
                        </svg>
                    </button>
                    <div className="message-input-wrapper">
                        <input
                            type="text"
                            placeholder="Escribe un mensaje"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="message-input"
                        />
                        <button className="emoji-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10.9,2 10.9,2 12,2ZM21,9V7L15,1H5C3.89,1 3 1.89 3,3V21C3 22.11 3.89,23 5,23H19C20.11,23 21,22.11 21,21V9M19,21H5V3H13V9H19Z" />
                            </svg>
                        </button>
                    </div>
                    <button className="send-button" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                        </svg>
                    </button>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        if (activeChat) {
            return renderChatView()
        }

        switch (activeTab) {
            case "chats":
                return (
                    <div className="chats-container">
                        {filteredChats.map((chat) => (
                            <div key={chat.id} className="chat-item" onClick={() => handleChatClick(chat)}>
                                <div className="chat-avatar">
                                    <img src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                                </div>
                                <div className="chat-content">
                                    <div className="chat-header">
                                        <h3 className="chat-name">{chat.name}</h3>
                                        <span className="chat-time">{chat.time}</span>
                                    </div>
                                    <div className="chat-footer">
                                        <p className="chat-message">{chat.lastMessage}</p>
                                        {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            case "novedades":
                return (
                    <div className="tab-content">
                        <div className="empty-state">
                            <div className="empty-icon">📰</div>
                            <h3>Novedades</h3>
                            <p>Mantente al día con las actualizaciones de tus contactos</p>
                        </div>
                    </div>
                )
            case "comunidades":
                return (
                    <div className="tab-content">
                        <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <h3>Comunidades</h3>
                            <p>Conéctate con grupos de personas con intereses similares</p>
                        </div>
                    </div>
                )
            case "llamadas":
                return (
                    <div className="tab-content">
                        <div className="empty-state">
                            <div className="empty-icon">📞</div>
                            <h3>Llamadas</h3>
                            <p>Historial de llamadas recientes</p>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="whatsapp-container">
            {!activeChat && (
                <>
                    <header className="whatsapp-header">
                        <h1>WhatsApp</h1>
                        <div className="header-icons">
                            <button className="icon-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10.9 2 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19Z" />
                                </svg>
                            </button>
                            <button className="icon-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                                </svg>
                            </button>
                        </div>
                    </header>

                    {/* Search Bar */}
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                </>
            )}

            <main className="main-content">{renderContent()}</main>

            {!activeChat && (
                <nav className="bottom-nav">
                    <button className={`nav-item ${activeTab === "chats" ? "active" : ""}`} onClick={() => setActiveTab("chats")}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z" />
                        </svg>
                        <span>Chats</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === "novedades" ? "active" : ""}`}
                        onClick={() => setActiveTab("novedades")}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                        </svg>
                        <span>Novedades</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === "comunidades" ? "active" : ""}`}
                        onClick={() => setActiveTab("comunidades")}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                        </svg>
                        <span>Comunidades</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === "llamadas" ? "active" : ""}`}
                        onClick={() => setActiveTab("llamadas")}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                        </svg>
                        <span>Llamadas</span>
                    </button>
                </nav>
            )}
        </div>
    )
}
