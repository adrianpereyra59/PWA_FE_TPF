import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useWhatsApp } from "../Context/WhatsappContext"
/* import ChatHeader from "./src/Component/Chat/ChatHeader" */
/* import MessagesList from "../components/chat/MessagesList"
import MessageInput from "../components/chat/MessageInput" */
import ChatHeader from "../Component/Chat/ChatHeader"
import MessagesList from "../Component/Chat/MessageList"
import MessageInput from "../Component/Chat/MessageInput"



export default function MessagePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getContact, getMessages, addMessage } = useWhatsApp()
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef(null)

    const contact = getContact(id)
    const messages = getMessages(Number.parseInt(id))

    useEffect(() => {
        if (!contact) {
            navigate("/")
            return
        }
    }, [contact, navigate])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSendMessage = (text) => {
        if (text.trim()) {
            addMessage(Number.parseInt(id), text.trim())
            setNewMessage("")
        }
    }

    if (!contact) {
        return <div className="loading">Cargando...</div>
    }

    return (
        <div className="message-page">
            <ChatHeader contact={contact} onBack={() => navigate("/")} />
            <MessagesList messages={messages} messagesEndRef={messagesEndRef} />
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    )
}
