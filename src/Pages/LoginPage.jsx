import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import "../Styles/auth.css"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = login({ email, password })
      if (!res.success) {
        setError(res.message)
        setLoading(false)
        return
      }
      // login ok
      setLoading(false)
      navigate("/", { replace: true })
    } catch (err) {
      setError("Error inesperado. Intentá de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" role="main" aria-labelledby="auth-title">
        <div className="auth-brand" aria-hidden="true">
          <div className="auth-logo-placeholder">WhatsApp</div>
        </div>

        <h2 id="auth-title">Iniciar sesión</h2>
        <p className="auth-sub">Ingrese su email y contraseña</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-label">Email</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              required
              aria-required="true"
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">Contraseña</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              aria-required="true"
            />
          </label>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <div className="auth-actions">
            <button type="submit" className="btn primary auth-btn" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
            <Link to="/forgot-password" className="auth-link">¿Olvidaste tu contraseña?</Link>
          </div>

          <div className="auth-footer">
            ¿No tenés cuenta? <Link to="/register" className="auth-link">Registrate</Link>
          </div>
        </form>
      </div>
    </div>
  )
}