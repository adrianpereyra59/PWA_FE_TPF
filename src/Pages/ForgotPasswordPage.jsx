import React, { useState } from "react"
import { useAuth } from "../Context/AuthContext"
import { Link } from "react-router-dom"
import "../Styles/auth.css"

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg(null)
    if (!email || !email.includes("@")) { setMsg({ type: "error", text: "Email inválido" }); return }
    setLoading(true)
    try {
      const res = await forgotPassword({ email })
      if (res.success) setMsg({ type: "success", text: res.message })
      else setMsg({ type: "error", text: res.message || "Error" })
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" role="main" aria-labelledby="forgot-title">
        <div className="auth-brand" aria-hidden="true">
          <div className="auth-logo-placeholder">WhatsApp</div>
        </div>

        <h2 id="forgot-title">Recuperar contraseña</h2>
        <p className="auth-sub">Ingrese el email con el que se registró. Recibirá un correo con instrucciones.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-label">Email</span>
            <input className="auth-input" type="email" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          {msg && <div className={`auth-notice ${msg.type === "error" ? "auth-error" : "auth-success"}`}>{msg.text}</div>}

          <div className="auth-actions">
            <button type="submit" className="btn primary auth-btn" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>
            <Link to="/login" className="auth-link">Volver a iniciar sesión</Link>
          </div>
        </form>
      </div>
    </div>
  )
}