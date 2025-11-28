import React, { createContext, useContext, useEffect, useState } from "react"


const AuthContext = createContext()

const USERS_KEY = "auth-users"
const CURRENT_KEY = "auth-current"
const RESET_KEY = "auth-reset-tokens"

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}

function writeJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error("localStorage write error", e)
    }
}

function ensureSeedUsers() {
    const users = readJSON(USERS_KEY, [])
    if (!users || users.length === 0) {
        const seed = [
            { id: 1, name: "Administrador", email: "admin@example.com", password: "admin123" },
            { id: 2, name: "Usuario Demo", email: "user@example.com", password: "password" },
        ]
        writeJSON(USERS_KEY, seed)
        return seed
    }
    return users
}

export function AuthProvider({ children }) {
    const [users, setUsers] = useState(() => ensureSeedUsers())
    const [user, setUser] = useState(() => readJSON(CURRENT_KEY, null))

    useEffect(() => {
        writeJSON(USERS_KEY, users)
    }, [users])

    useEffect(() => {
        writeJSON(CURRENT_KEY, user)
    }, [user])

    const findUserByEmail = (email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    const register = ({ name, email, password }) => {
        if (!name || !email || !password) return { success: false, message: "Completa todos los campos." }
        if (findUserByEmail(email)) return { success: false, message: "Ya existe un usuario con ese email." }
        const newUser = { id: Date.now(), name, email, password }
        const next = [...users, newUser]
        setUsers(next)
        return { success: true, message: "Registro exitoso. Podés iniciar sesión ahora." }
    }

    const login = ({ email, password }) => {
        const found = findUserByEmail(email)
        if (!found) return { success: false, message: "Email no registrado." }
        if (found.password !== password) return { success: false, message: "Contraseña incorrecta." }
        setUser({ id: found.id, name: found.name, email: found.email })
        return { success: true, message: "Inicio de sesión correcto.", user: { id: found.id, name: found.name, email: found.email } }
    }

    const logout = () => {
        setUser(null)
    }

    const sendResetEmail = (email) => {
        const found = findUserByEmail(email)
        if (!found) return { success: false, message: "Email no registrado." }
        // create token (simple)
        const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
        const expires = Date.now() + 1000 * 60 * 60 // 1h
        const tokens = readJSON(RESET_KEY, {})
        tokens[token] = { email: found.email, expires }
        writeJSON(RESET_KEY, tokens)
        return { success: true, message: "Token de reset creado. (Simulado)", token }
    }

    const resetPassword = (token, newPassword) => {
        const tokens = readJSON(RESET_KEY, {})
        const data = tokens[token]
        if (!data) return { success: false, message: "Token inválido o expirado." }
        if (Date.now() > data.expires) {
            // remove token
            delete tokens[token]
            writeJSON(RESET_KEY, tokens)
            return { success: false, message: "Token expirado." }
        }
        const u = findUserByEmail(data.email)
        if (!u) return { success: false, message: "Usuario no encontrado." }
        const updated = users.map((usr) => (usr.email === u.email ? { ...usr, password: newPassword } : usr))
        setUsers(updated)
        // remove token
        delete tokens[token]
        writeJSON(RESET_KEY, tokens)
        return { success: true, message: "Contraseña actualizada. Podés iniciar sesión." }
    }

    const value = {
        users,
        user,
        register,
        login,
        logout,
        sendResetEmail,
        resetPassword,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}