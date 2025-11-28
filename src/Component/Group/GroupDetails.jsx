import React, { useState } from "react"
import { useWhatsApp } from "../../Context/WhatsappContext"
import InviteModal from "./InviteModal"

export default function GroupDetails({ group, onClose }) {
    const { getGroupMembers, getPendingInvitationsForGroup, getContact, removeMemberFromGroup, acceptInvitation, currentUser } = useWhatsApp()
    const members = getGroupMembers(group.id)
    const pending = getPendingInvitationsForGroup(group.id)
    const [openInvite, setOpenInvite] = useState(false)

    const handleRemove = (memberId) => {
        if (memberId === currentUser.id) {
            if (!window.confirm("¿Seguro quieres salir del grupo?")) return
        }
        removeMemberFromGroup(group.id, memberId)
    }

    return (
        <div className="group-details">
            <div className="group-details-header">
                <button className="back-button" onClick={onClose}>←</button>
                <h3>{group.name}</h3>
                <div />
            </div>

            <div className="group-details-body">
                <section>
                    <h4>Miembros ({members.length})</h4>
                    <ul className="members-list">
                        {members.map((m) => {
                            const c = getContact(m.id || m) 
                            const memberId = m.id ?? m
                            if (!c) return null
                            return (
                                <li key={memberId} className="member-item">
                                    <img src={c.avatar} alt={c.name} />
                                    <div className="member-info">
                                        <strong>{c.name}</strong>
                                        <div className="member-sub">{c.phone}</div>
                                    </div>
                                    <div className="member-actions">
                                        {group.adminId === currentUser.id && memberId !== currentUser.id && (
                                            <button className="btn small danger" onClick={() => handleRemove(memberId)}>Eliminar</button>
                                        )}
                                        {memberId === currentUser.id && (
                                            <button className="btn small secondary" onClick={() => handleRemove(memberId)}>Salir</button>
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </section>

                <section style={{ marginTop: "1rem" }}>
                    <h4>Invitaciones pendientes ({pending.length})</h4>
                    <ul>
                        {pending.length === 0 && <p>No hay invitaciones pendientes.</p>}
                        {pending.map((inv) => {
                            const c = getContact(inv.toContactId)
                            return (
                                <li key={inv.id} style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: ".5rem" }}>
                                    <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                                        <img src={c?.avatar} alt={c?.name} style={{ width: 36, height: 36, borderRadius: "50%" }} />
                                        <div>
                                            <strong>{c?.name}</strong>
                                            <div style={{ fontSize: ".85rem", color: "var(--text-secondary,#667781)" }}>{inv.status}</div>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem" }}>
                                        <button className="btn small primary" onClick={() => acceptInvitation(inv.id)}>Simular aceptar</button>
                                        <button className="btn small secondary" onClick={() => { acceptInvitation(inv.id, "declined") }}>Declinar</button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </section>

                <div style={{ marginTop: "1rem" }}>
                    <button className="btn" onClick={() => setOpenInvite(true)}>Invitar miembros</button>
                </div>
            </div>

            <InviteModal open={openInvite} onClose={() => setOpenInvite(false)} group={group} />
        </div>
    )
}