import React, { useState } from "react"
import { useWhatsApp } from "../../Context/WhatsappContext"

export default function InviteModal({ open, onClose, group }) {
    const { filteredContacts, sendInvitation } = useWhatsApp()
    const [selected, setSelected] = useState([])

    if (!open) return null

    const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

    const handleSend = () => {
        selected.forEach((contactId) => sendInvitation(group.id, contactId))
        setSelected([])
        onClose()
    }

    const available = filteredContacts.filter((c) => !group.members.includes(c.id))

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
                <header className="modal-header">
                    <h3>Invitar a {group.name}</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
                </header>

                <div className="modal-body">
                    <div className="field">
                        <span>Contactos</span>
                        <div className="contacts-select">
                            {available.length === 0 && <p>No hay contactos para invitar.</p>}
                            {available.map((c) => (
                                <label key={c.id} className="contact-checkbox">
                                    <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
                                    <img src={c.avatar} alt={c.name} />
                                    <span>{c.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="modal-footer">
                    <button className="btn secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn primary" onClick={handleSend} disabled={selected.length === 0}>Enviar invitaciones</button>
                </footer>
            </div>
        </div>
    )
}