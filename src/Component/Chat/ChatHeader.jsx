import React from "react"
import { ArrowLeft, Video, Phone, MoreVertical } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Icon } from 'lucide-react';

export default function ChatHeader({ contact, onBack }) {
    const navigate = useNavigate()

    const handleContactInfo = () => {
        navigate(`/contactInfo/${contact.id}`)
    }

    return (
        <div className="chat-header">
            <button className="back-button" onClick={onBack} aria-label="Volver">
                <ArrowLeft size={24} />
            </button>

            <div className="chat-header-info" onClick={handleContactInfo} role="button" tabIndex={0}>
                <img
                    src={contact.avatar || "/placeholder.svg"}
                    alt={`Avatar de ${contact.name}`}
                    className="chat-header-avatar"
                />
                <div className="chat-header-details">
                    <h3 className="chat-header-name">{contact.name}</h3>
                    <p className="chat-header-status">{contact.status}</p>
                </div>
            </div>

            <div className="chat-header-actions">
                <button className="icon-button" aria-label="Videollamada">
                    <Video size={20} />
                </button>
                <button className="icon-button" aria-label="Llamar">
                    <Phone size={20} />
                </button>
                <button className="icon-button" aria-label="Más opciones">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    )
}
