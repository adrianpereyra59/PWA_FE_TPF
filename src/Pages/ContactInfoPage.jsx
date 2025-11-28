import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useWhatsApp } from "../Context/WhatsappContext"
import ContactHeader from "../Component/Contact/ContactHeader"
import ContactDetails from "../Component/Contact/ContactDetails"
import ContactActions from "../Component/Contact/ContactAction"

export default function ContactInfoPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getContact } = useWhatsApp()

    const contact = getContact(id)

    if (!contact) {
        navigate("/")
        return null
    }

    return (
        <div className="contact-info-page">
            <ContactHeader contact={contact} onBack={() => navigate("/")} />
            <div className="contact-content">
                <ContactDetails contact={contact} />
                <ContactActions contact={contact} navigate={navigate} />
            </div>
        </div>
    )
}
