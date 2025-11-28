import React from "react"

export default function GroupItem({ group, onOpen }) {
    return (
        <div className="group-item" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => e.key === "Enter" && onOpen()}>
            <div className="group-avatar">
                <div className="group-placeholder">{group.name.charAt(0).toUpperCase()}</div>
            </div>
            <div className="group-content">
                <div className="group-header">
                    <h3 className="group-name">{group.name}</h3>
                    <span className="group-count">{group.members.length} miembros</span>
                </div>
                <p className="group-meta">Creado por {group.adminId === "me" ? "tú" : group.adminId}</p>
            </div>
        </div>
    )
}