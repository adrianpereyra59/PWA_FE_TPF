import React, { useState } from "react"
import { useAuth } from "../Context/AuthContext"
import { Link } from "react-router-dom"
import "../Styles/auth.css"

export default function ForgotPasswordPage() {
  const { sendResetEmail } = useAuth()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    const res = sendResetEmail(email)
    setLoading(false)
    if (!res.success) {
      setMessage({ type: "error", text: res.message })
      setToken(null)
      return
    }
    setMessage({ type: "info", text: "Token de recuperación creado (simulado)." })
    setToken(res.token)
  }

  return (
    <div className="auth-container">
      <div className="auth-card" role="main" aria-labelledby="forgot-title">
        <div className="auth-brand" aria-hidden="true">
          <div className="auth-logo-placeholder">WhatsApp</div>
        </div>

        <h2 id="forgot-title">Recuperar contraseña</h2>
        <p className="auth-sub">Ingrese el email con el que se registró. Recibirá un enlace simulado.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-label">Email</span>
            <input className="auth-input" type="email" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          {message && <div className={`auth-notice ${message.type === "error" ? "auth-error" : "auth-success"}`}>{message.text}</div>}

          <div className="auth-actions">
            <button type="submit" className="btn primary auth-btn" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>
            <Link to="/login" className="auth-link">Volver a iniciar sesión</Link>
          </div>

          {token && (
            <div className="auth-token">
              <div>Enlace simulado:</div>
              <Link to={`/reset-password/${token}`} className="auth-token-link">/reset-password/{token}</Link>
              <div className="auth-note">Este token expira en 1 hora (simulado).</div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}