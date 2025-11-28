import React, { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useWhatsApp } from "../Context/WhatsappContext"
import GroupHeader from "../Component/Group/GroupHeader"
import Message from "../Component/Chat/Message"
import GroupMessageInput from "../Component/Group/GroupMessageInput"

export default function GroupPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getGroupById, getGroupMessages, addGroupMessage } = useWhatsApp()
    const messagesEndRef = useRef(null)

    const group = getGroupById(id)
    const messages = getGroupMessages(Number.parseInt(id))

    useEffect(() => {
        if (!group) {
            navigate("/")
        }
    }, [group, navigate])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = (text) => {
        if (!group) return
        addGroupMessage(group.id, text)
    }

    if (!group) return <div className="loading">Cargando...</div>

    return (
        <div className="message-page">
            <GroupHeader group={group} onBack={() => navigate("/")} />
            <div className="messages-container">
                {messages.map((m) => (
                    <Message key={m.id} message={m} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <GroupMessageInput onSend={(text) => handleSend(text)} />
        </div>
    )
}