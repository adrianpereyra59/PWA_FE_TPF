import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MoreVertical } from "lucide-react"
import ManageGroupModal from "./ManageGroupModal"

export default function GroupHeader({ group, onBack }) {
    const navigate = useNavigate()
    const [openManage, setOpenManage] = useState(false)

    return (
        <>
            <div className="chat-header">
                <button className="back-button" onClick={onBack} aria-label="Volver">←</button>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "default" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary-color,#25d366)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="chat-header-name" style={{ margin: 0 }}>{group.name}</h3>
                        <p className="chat-header-status" style={{ margin: 0 }}>{group.members.length} miembros</p>
                    </div>
                </div>

                <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem", alignItems: "center" }}>
                    <button className="icon-button" aria-label="Más" onClick={() => setOpenManage(true)}>
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            <ManageGroupModal open={openManage} onClose={() => setOpenManage(false)} group={group} />
        </>
    )
}