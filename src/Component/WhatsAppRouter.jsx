import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "../Pages/HomePage"
import "../Styles/global.css"
import "../Styles/groups.css"
import { WhatsAppProvider } from "../Context/WhatsappContext"
import ContactInfoPage from "../Pages/ContactInfoPage"
import MessagePage from "../Pages/MessagePage"
import GroupPage from "../Pages/GroupPage"

import { AuthProvider } from "../Context/AuthContext"
import ProtectedRoute from "./Common/ProtectedRoute"
import LoginPage from "../Pages/LoginPage"
import RegisterPage from "../Pages/RegisterPage"
import ForgotPasswordPage from "../Pages/ForgotPasswordPage"
import ResetPasswordPage from "../Pages/ResetPasswordPage"



export default function WhatsAppRouter() {
    return (
        <AuthProvider>
            <WhatsAppProvider>
                <Router>
                    <div className="whatsapp-app">
                        <Routes>
                            {/* Public auth routes */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                            
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <HomePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/message/:id"
                                element={
                                    <ProtectedRoute>
                                        <MessagePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/contactInfo/:id"
                                element={
                                    <ProtectedRoute>
                                        <ContactInfoPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/group/:id"
                                element={
                                    <ProtectedRoute>
                                        <GroupPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </WhatsAppProvider>
        </AuthProvider>
    )
}