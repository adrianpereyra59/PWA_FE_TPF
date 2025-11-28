import React, { useState } from "react"
import { useWhatsApp } from "../../Context/WhatsappContext"

export default function CreateGroupModal({ open, onClose }) {
    const { filteredContacts, createGroup } = useWhatsApp()
    const [name, setName] = useState("")
    const [selected, setSelected] = useState([])

    if (!open) return null

    const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

    const handleCreate = (e) => {
        e.preventDefault()
        if (!name.trim()) return
        createGroup({ name: name.trim(), memberIds: selected })
        setName("")
        setSelected([])
        onClose()
    }

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
                <header className="modal-header">
                    <h3>Crear grupo</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
                </header>

                <form className="modal-body" onSubmit={handleCreate}>
                    <label className="field">
                        <span>Nombre del grupo</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Equipo Backend" />
                    </label>

                    <div className="field">
                        <span>Seleccionar miembros</span>
                        <div className="contacts-select">
                            {filteredContacts.map((c) => (
                                <label key={c.id} className="contact-checkbox">
                                    <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
                                    <img src={c.avatar} alt={c.name} />
                                    <span>{c.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <footer className="modal-footer">
                        <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn primary" disabled={!name.trim()}>Crear</button>
                    </footer>
                </form>
            </div>
        </div>
    )
}