import React from "react"
import { MessageCircle, Phone, Video, UserMinus } from "lucide-react"

export default function ContactActions({ contact, navigate }) {
    const handleMessage = () => {
        navigate(`/message/${contact.id}`)
    }

    return (
        <div className="contact-actions">
            <button className="action-button primary" onClick={handleMessage} aria-label="Enviar mensaje">
                <MessageCircle size={20} />
                <span>Mensaje</span>
            </button>

            <button className="action-button" aria-label="Llamar">
                <Phone size={20} />
                <span>Llamar</span>
            </button>

            <button className="action-button" aria-label="Videollamada">
                <Video size={20} />
                <span>Video</span>
            </button>

            <button className="action-button danger" aria-label="Eliminar contacto">
                <UserMinus size={20} />
                <span>Eliminar</span>
            </button>
        </div>
    )
}
