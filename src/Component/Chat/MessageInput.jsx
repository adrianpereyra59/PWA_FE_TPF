import React from "react"
import { useState } from "react"
import { Paperclip, Smile, Send } from "lucide-react"

export default function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.trim()) {
            onSendMessage(message)
            setMessage("")
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form className="message-input-container" onSubmit={handleSubmit}>
            <button type="button" className="attachment-button" aria-label="Adjuntar archivo">
                <Paperclip size={20} />
            </button>

            <div className="message-input-wrapper">
                <input
                    type="text"
                    placeholder="Escribe un mensaje"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="message-input"
                    aria-label="Escribir mensaje"
                />
                <button type="button" className="emoji-button" aria-label="Emojis">
                    <Smile size={20} />
                </button>
            </div>

            <button type="submit" className="send-button" disabled={!message.trim()} aria-label="Enviar mensaje">
                <Send size={20} />
            </button>
        </form>
    )
}
