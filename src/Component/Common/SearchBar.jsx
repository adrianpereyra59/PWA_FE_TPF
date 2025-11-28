import React from "react"
import { Search } from "lucide-react"
import { useWhatsApp } from "../../Context/WhatsappContext"


export default function SearchBar() {
    const { searchTerm, dispatch } = useWhatsApp()

    const handleSearchChange = (e) => {
        dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
    }

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <Search className="search-icon" size={18} aria-hidden="true" />
                <input
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                    aria-label="Buscar contactos"
                />
            </div>
        </div>
    )
}
