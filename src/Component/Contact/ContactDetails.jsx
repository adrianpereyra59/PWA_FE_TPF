import React from "react"
export default function ContactDetails({ contact }) {
    return (
        <div className="contact-details">
            <div className="contact-avatar-section">
                <img
                    src={contact.avatar || "/placeholder.svg"}
                    alt={`Avatar de ${contact.name}`}
                    className="contact-large-avatar"
                />
                <h2 className="contact-name">{contact.name}</h2>
                <p className="contact-phone">{contact.phone}</p>
                <p className="contact-status">{contact.lastSeen}</p>
            </div>

            <div className="contact-info-section">
                <div className="info-item">
                    <h3>Información</h3>
                    <p className="contact-about">{contact.about}</p>
                </div>

                <div className="info-item">
                    <h3>Número de teléfono</h3>
                    <p className="contact-phone-detail">{contact.phone}</p>
                </div>
            </div>
        </div>
    )
}
