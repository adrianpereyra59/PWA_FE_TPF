import React, { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import "../Styles/auth.css"

export default function ResetPasswordPage() {
  const { token } = useParams()
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage(null)
    if (!password || password.length < 4) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 4 caracteres." })
      return
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden." })
      return
    }
    setLoading(true)
    const res = resetPassword(token, password)
    setLoading(false)
    if (!res.success) {
      setMessage({ type: "error", text: res.message })
      return
    }
    setMessage({ type: "success", text: res.message })
    setTimeout(() => navigate("/login"), 900)
  }

  return (
    <div className="auth-container">
      <div className="auth-card" role="main" aria-labelledby="reset-title">
        <div className="auth-brand" aria-hidden="true">
          <div className="auth-logo-placeholder">WhatsApp</div>
        </div>

        <h2 id="reset-title">Restablecer contraseña</h2>
        <p className="auth-sub">Ingresa una nueva contraseña.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-label">Nueva contraseña</span>
            <input className="auth-input" type="password" placeholder="Nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          <label className="auth-field">
            <span className="auth-label">Confirmar contraseña</span>
            <input className="auth-input" type="password" placeholder="Confirmar contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </label>

          {message && <div className={`auth-notice ${message.type === "error" ? "auth-error" : "auth-success"}`}>{message.text}</div>}

          <div className="auth-actions">
            <button className="btn primary auth-btn" type="submit" disabled={loading}>{loading ? "Procesando..." : "Restablecer"}</button>
            <Link to="/login" className="auth-link">Volver a iniciar sesión</Link>
          </div>
        </form>
      </div>
    </div>
  )
}