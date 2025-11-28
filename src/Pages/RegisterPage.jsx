import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import "../Styles/auth.css"

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await register({ name, email, password })
      if (!res.success) {
        setError(res.message)
        setSuccess(null)
        return
      }
      setError(null)
      setSuccess(res.message || "Registro exitoso")
      setTimeout(() => navigate("/login"), 900)
    } catch (err) {
      setError("Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" role="main" aria-labelledby="register-title">
        <div className="auth-brand" aria-hidden="true">
          <div className="auth-logo-placeholder">WhatsApp</div>
        </div>

        <h2 id="register-title">Registro</h2>
        <p className="auth-sub">Crea una cuenta para acceder al chat</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-label">Nombre</span>
            <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
          </label>

          <label className="auth-field">
            <span className="auth-label">Email</span>
            <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@ejemplo.com" required />
          </label>

          <label className="auth-field">
            <span className="auth-label">Contraseña</span>
            <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 4 caracteres" required />
          </label>

          {error && <div className="auth-error" role="alert">{error}</div>}
          {success && <div className="auth-success" role="status">{success}</div>}

          <div className="auth-actions">
            <button type="submit" className="btn primary auth-btn" disabled={loading}>
              {loading ? "Procesando..." : "Registrarme"}
            </button>
            <Link to="/login" className="auth-link">Ir a iniciar sesión</Link>
          </div>
        </form>
      </div>
    </div>
  )
}