import React from "react"
import { MessageCircle, Radio, Users, Phone } from "lucide-react"
import { useWhatsApp } from "../../Context/WhatsappContext"


const tabs = [
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "novedades", label: "Novedades", icon: Radio },
    { id: "comunidades", label: "Comunidades", icon: Users },
    { id: "llamadas", label: "Llamadas", icon: Phone },
]

export default function TabNavigation() {
    const { activeTab, dispatch } = useWhatsApp()

    const handleTabChange = (tabId) => {
        dispatch({ type: "SET_ACTIVE_TAB", payload: tabId })
    }

    return (
        <nav className="bottom-nav" role="tablist">
            {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-label={tab.label}
                    >
                        <Icon size={20} aria-hidden="true" />
                        <span>{tab.label}</span>
                    </button>
                )
            })}
        </nav>
    )
}
