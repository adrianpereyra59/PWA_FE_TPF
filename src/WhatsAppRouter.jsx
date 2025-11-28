import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "../Pages/HomePage"
import "../Styles/global.css"
import "../Styles/groups.css"
import { WhatsAppProvider } from "../Context/WhatsappContext"
import ContactInfoPage from "../Pages/ContactInfoPage"
import MessagePage from "../Pages/MessagePage"
import GroupPage from "../Pages/GroupPage"

export default function WhatsAppRouter() {
    return (
        <WhatsAppProvider>
            <Router>
                <div className="whatsapp-app">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/message/:id" element={<MessagePage />} />
                        <Route path="/contactInfo/:id" element={<ContactInfoPage />} />
                        <Route path="/group/:id" element={<GroupPage />} />
                    </Routes>
                </div>
            </Router>
        </WhatsAppProvider>
    )
}