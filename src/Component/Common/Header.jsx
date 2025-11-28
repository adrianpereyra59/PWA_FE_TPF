import React from "react"
import { Camera, MoreVertical, LogOut } from "lucide-react"
import { useAuth } from "../../Context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Header() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login", { replace: true })
    }

    return (
        <header className="whatsapp-header" role="banner">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <h1 style={{ margin: 0 }}>WhatsApp</h1>
                {user && (
                    <div className="header-user" aria-live="polite" style={{ fontSize: ".95rem", color: "var(--text-secondary,#667781)" }}>
                        Hola, {user.name}
                    </div>
                )}
            </div>

            <div className="header-icons" style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <button className="icon-button" aria-label="Cámara">
                    <Camera size={20} />
                </button>
                <button className="icon-button" aria-label="Más opciones">
                    <MoreVertical size={20} />
                </button>

                {user && (
                    <button
                        className="icon-button"
                        aria-label="Cerrar sesión"
                        title="Cerrar sesión"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </header>
    )
}