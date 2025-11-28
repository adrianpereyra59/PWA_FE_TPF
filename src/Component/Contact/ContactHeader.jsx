import React from "react"
import { ArrowLeft, MoreVertical } from "lucide-react"

export default function ContactHeader({ contact, onBack }) {
    return (
        <div className="contact-header">
            <button className="back-button" onClick={onBack} aria-label="Volver">
                <ArrowLeft size={24} />
            </button>
            <h2>Información del contacto</h2>
            <button className="icon-button" aria-label="Más opciones">
                <MoreVertical size={20} />
            </button>
        </div>
    )
}
