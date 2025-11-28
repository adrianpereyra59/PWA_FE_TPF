import React, { useState } from "react"
import { useWhatsApp } from "../../Context/WhatsappContext"


export default function ManageGroupModal({ open, onClose, group }) {
    const {
        getGroupMembers,
        getGroupRoles,
        getPendingInvitationsForGroup,
        filteredContacts,
        getContact,
        removeMemberFromGroup,
        assignRole,
        addMemberToGroup,
        sendInvitation,
        currentUser,
    } = useWhatsApp()

    const members = getGroupMembers(group.id)
    const roles = getGroupRoles(group.id)
    const pending = getPendingInvitationsForGroup(group.id)
    const [tab, setTab] = useState("info")
    const [selectedToAdd, setSelectedToAdd] = useState([])
    const [selectedToInvite, setSelectedToInvite] = useState([])

    if (!open) return null

    const isAdmin = group.adminId === currentUser.id

    const toggleSelectAdd = (id) => setSelectedToAdd((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
    const toggleSelectInvite = (id) => setSelectedToInvite((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

    const handleAddMembers = () => {
        if (!isAdmin) {
            alert("Solo el administrador puede añadir miembros directamente.")
            return
        }
        selectedToAdd.forEach((id) => addMemberToGroup(group.id, id))
        setSelectedToAdd([])
    }

    const handleSendInvitations = () => {
        selectedToInvite.forEach((id) => sendInvitation(group.id, id))
        setSelectedToInvite([])
    }

    const handleAssignRole = (memberId, role) => {
        if (!isAdmin) {
            alert("Solo el administrador puede asignar roles.")
            return
        }
        assignRole(group.id, memberId, role)
    }

    const handleRemove = (memberId) => {
        if (memberId === currentUser.id) {
            if (!window.confirm("¿Seguro quieres salir del grupo?")) return
            removeMemberFromGroup(group.id, memberId)
            return
        }

        if (!isAdmin) {
            alert("Solo el administrador puede eliminar a otros miembros.")
            return
        }

        if (!window.confirm("¿Confirmas eliminar a este miembro del grupo?")) return
        removeMemberFromGroup(group.id, memberId)
    }

    const memberIds = members.map((m) => m.id)
    const available = filteredContacts.filter((c) => !memberIds.includes(c.id))

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal" style={{ maxWidth: 760 }}>
                <header className="modal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
                        <h3 style={{ margin: 0 }}>{group.name}</h3>
                        <div style={{ fontSize: ".85rem", color: "var(--text-secondary,#667781)" }}>{group.members.length} miembros</div>
                    </div>
                    <div>
                        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
                    </div>
                </header>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <nav style={{ minWidth: 140, borderRight: "1px solid var(--border-color,#e9edef)" }}>
                        <ul style={{ listStyle: "none", padding: "1rem", margin: 0, display: "flex", flexDirection: "column", gap: ".5rem" }}>
                            <li><button className={`btn ${tab === "info" ? "primary" : ""}`} onClick={() => setTab("info")}>Información</button></li>
                            <li><button className={`btn ${tab === "members" ? "primary" : ""}`} onClick={() => setTab("members")}>Miembros</button></li>
                            <li><button className={`btn ${tab === "invite" ? "primary" : ""}`} onClick={() => setTab("invite")}>Invitar / Añadir</button></li>
                            <li><button className={`btn ${tab === "pending" ? "primary" : ""}`} onClick={() => setTab("pending")}>Invitaciones</button></li>
                        </ul>
                    </nav>

                    <div style={{ flex: 1, padding: "1rem", maxHeight: "60vh", overflowY: "auto" }}>
                        {!isAdmin && (
                            <div style={{ marginBottom: "1rem", padding: ".5rem", borderRadius: 6, background: "rgba(0,0,0,0.03)", color: "var(--text-secondary,#667781)" }}>
                                <strong>Nota:</strong> sólo el administrador puede asignar roles, eliminar miembros (excepto tú) y añadir miembros directamente.
                            </div>
                        )}

                        {tab === "info" && (
                            <section>
                                <h4>Información del grupo</h4>
                                <p><strong>Nombre:</strong> {group.name}</p>
                                <p><strong>Creado:</strong> {new Date(group.createdAt).toLocaleString()}</p>
                                <p><strong>Admin:</strong> {group.adminId === "me" ? "Tú" : (getContact(group.adminId)?.name || group.adminId)}</p>
                                <p><strong>Miembros:</strong> {group.members.length}</p>
                            </section>
                        )}

                        {tab === "members" && (
                            <section>
                                <h4>Miembros</h4>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {members.map((m) => {
                                        const role = roles[m.id] || "member"
                                        const isSelf = m.id === currentUser.id
                                        return (
                                            <li key={m.id} className="member-item" style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".5rem" }}>
                                                <img src={m.avatar} alt={m.name} style={{ width: 40, height: 40, borderRadius: "50%" }} />
                                                <div style={{ flex: 1 }}>
                                                    <strong>{m.name}</strong>
                                                    <div style={{ fontSize: ".85rem", color: "var(--text-secondary,#667781)" }}>{m.phone}</div>
                                                </div>

                                                <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                                                    {isAdmin ? (
                                                        <select value={role} onChange={(e) => handleAssignRole(m.id, e.target.value)} aria-label={`Rol de ${m.name}`}>
                                                            <option value="admin">Admin</option>
                                                            <option value="moderator">Moderator</option>
                                                            <option value="member">Member</option>
                                                        </select>
                                                    ) : (
                                                        <div style={{ padding: ".25rem .5rem", borderRadius: 6, background: "#f5f5f5" }}>
                                                            {role}
                                                        </div>
                                                    )}

                                                    {isSelf ? (
                                                        <button className="btn small secondary" onClick={() => handleRemove(m.id)}>Salir</button>
                                                    ) : (
                                                        <button
                                                            className="btn small danger"
                                                            onClick={() => handleRemove(m.id)}
                                                            disabled={!isAdmin}
                                                            title={!isAdmin ? "Sólo el administrador puede eliminar a otros miembros" : ""}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </section>
                        )}

                        {tab === "invite" && (
                            <section>
                                <h4>Añadir miembros directamente</h4>
                                <p>Selecciona contactos para añadir al grupo (añadirá sin invitación). Esta acción está reservada al administrador.</p>
                                <div className="contacts-select" style={{ marginTop: ".5rem" }}>
                                    {available.length === 0 && <div>No hay contactos disponibles para añadir.</div>}
                                    {available.map((c) => (
                                        <label key={c.id} className="contact-checkbox" style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                                            <input type="checkbox" checked={selectedToAdd.includes(c.id)} onChange={() => toggleSelectAdd(c.id)} disabled={!isAdmin} />
                                            <img src={c.avatar} alt={c.name} style={{ width: 36, height: 36, borderRadius: "50%" }} />
                                            <span>{c.name}</span>
                                        </label>
                                    ))}
                                </div>

                                <div style={{ marginTop: ".75rem", display: "flex", gap: ".5rem" }}>
                                    <button className="btn primary" onClick={handleAddMembers} disabled={!isAdmin || selectedToAdd.length === 0}>Añadir seleccionados</button>
                                    <button className="btn secondary" onClick={() => setSelectedToAdd([])}>Cancelar</button>
                                </div>

                                <hr style={{ margin: "1rem 0" }} />

                                <h4>Enviar invitaciones</h4>
                                <p>Selecciona contactos para enviar invitación (pendiente hasta que el contacto acepte).</p>
                                <div className="contacts-select" style={{ marginTop: ".5rem" }}>
                                    {available.length === 0 && <div>No hay contactos disponibles para invitar.</div>}
                                    {available.map((c) => (
                                        <label key={c.id} className="contact-checkbox" style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                                            <input type="checkbox" checked={selectedToInvite.includes(c.id)} onChange={() => toggleSelectInvite(c.id)} />
                                            <img src={c.avatar} alt={c.name} style={{ width: 36, height: 36, borderRadius: "50%" }} />
                                            <span>{c.name}</span>
                                        </label>
                                    ))}
                                </div>

                                <div style={{ marginTop: ".75rem", display: "flex", gap: ".5rem" }}>
                                    <button className="btn primary" onClick={handleSendInvitations} disabled={selectedToInvite.length === 0}>Enviar invitaciones</button>
                                    <button className="btn secondary" onClick={() => setSelectedToInvite([])}>Cancelar</button>
                                </div>
                            </section>
                        )}

                        {tab === "pending" && (
                            <section>
                                <h4>Invitaciones pendientes</h4>
                                {pending.length === 0 && <p>No hay invitaciones pendientes.</p>}
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {pending.map((inv) => {
                                        const c = getContact(inv.toContactId)
                                        return (
                                            <li key={inv.id} style={{ display: "flex", gap: ".75rem", alignItems: "center", marginBottom: ".5rem" }}>
                                                <img src={c?.avatar} alt={c?.name} style={{ width: 36, height: 36, borderRadius: "50%" }} />
                                                <div>
                                                    <strong>{c?.name}</strong>
                                                    <div style={{ fontSize: ".85rem", color: "var(--text-secondary,#667781)" }}>{inv.status}</div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>

                <footer className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem" }}>
                    <button className="btn secondary" onClick={onClose}>Cerrar</button>
                </footer>
            </div>
        </div>
    )
}