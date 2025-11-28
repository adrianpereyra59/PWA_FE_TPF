import React, { createContext, useContext, useEffect, useReducer } from "react"

const WhatsAppContext = createContext()

const seedContacts = [
    { id: 1, name: "María García", phone: "+34 612 345 678", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face", isOnline: true },
    { id: 2, name: "Juan Pérez", phone: "+34 687 654 321", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", isOnline: false },
    { id: 3, name: "Familia", phone: "Grupo", avatar: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=100&h=100&fit=crop&crop=face", isOnline: true },
    { id: 4, name: "Ana López", phone: "+34 654 987 123", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", isOnline: false },
    { id: 5, name: "Trabajo - Equipo", phone: "Grupo", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face", isOnline: false },
    { id: 6, name: "Pedro Martínez", phone: "+34 698 741 852", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", isOnline: false },
]

const initialGroups = [
    {
        id: 1001,
        name: "Equipo Proyecto X",
        adminId: "me",
        members: [1, 2, 5],
        roles: { "me": "admin", "1": "member", "2": "member", "5": "member" },
        createdAt: new Date().toISOString(),
    },
]

const initialMessages = {
    1001: [
        { id: 1, senderId: 1, senderName: "María García", text: "Bienvenidos al grupo.", time: "09:00", date: "Hoy" },
        { id: 2, senderId: "me", senderName: "Yo", text: "Perfecto, gracias. Arrancamos.", time: "09:05", date: "Hoy" },
    ],
}

const initialInvitations = []

const initialState = {
    contacts: seedContacts,
    groups: initialGroups,
    messages: initialMessages,
    invitations: initialInvitations,
    activeTab: "chats",
    searchTerm: "",
    currentUser: {
        id: "me",
        name: "Yo",
        phone: "+34 600 000 000",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    },
}

function reducer(state, action) {
    switch (action.type) {
        case "SET_ACTIVE_TAB":
            return { ...state, activeTab: action.payload }
        case "SET_SEARCH_TERM":
            return { ...state, searchTerm: action.payload }

        case "CREATE_GROUP": {
            const { group } = action.payload
            return { ...state, groups: [...state.groups, group] }
        }

        case "ADD_MEMBER": {
            const { groupId, memberId } = action.payload
            return {
                ...state,
                groups: state.groups.map((g) =>
                    g.id === groupId
                        ? {
                              ...g,
                              members: Array.from(new Set([...(g.members || []), memberId])),
                              roles: { ...(g.roles || {}), [memberId]: g.roles && g.roles[memberId] ? g.roles[memberId] : "member" },
                          }
                        : g,
                ),
            }
        }

        case "REMOVE_MEMBER": {
            const { groupId, memberId } = action.payload
            return {
                ...state,
                groups: state.groups.map((g) =>
                    g.id === groupId
                        ? {
                              ...g,
                              members: (g.members || []).filter((m) => m !== memberId),
                              roles: Object.keys(g.roles || {})
                                  .filter((k) => Number(k) !== Number(memberId))
                                  .reduce((acc, k) => ({ ...acc, [k]: g.roles[k] }), {}),
                              adminId: g.adminId === memberId ? null : g.adminId,
                          }
                        : g,
                ),
            }
        }

        case "ASSIGN_ROLE": {
            const { groupId, memberId, role } = action.payload
            return {
                ...state,
                groups: state.groups.map((g) => {
                    if (g.id !== groupId) return g
                    const newRoles = { ...(g.roles || {}) }
                    newRoles[memberId] = role
                    let newAdminId = g.adminId
                    if (role === "admin") {
                        newAdminId = memberId
                        if (g.adminId && newRoles[g.adminId]) newRoles[g.adminId] = "member"
                    }
                    return { ...g, roles: newRoles, adminId: newAdminId }
                }),
            }
        }

        case "SEND_INVITATION":
            return { ...state, invitations: [...state.invitations, action.payload.invitation] }

        case "UPDATE_INVITATION":
            return {
                ...state,
                invitations: state.invitations.map((inv) => (inv.id === action.payload.id ? { ...inv, ...action.payload.updates } : inv)),
            }

        case "ADD_GROUP_MESSAGE": {
            const { groupId, message } = action.payload
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [groupId]: [...(state.messages[groupId] || []), message],
                },
            }
        }

        case "LOAD_SAVED":
            return { ...state, ...action.payload }

        default:
            return state
    }
}

export function WhatsAppProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        try {
            const raw = localStorage.getItem("groupchat-state")
            if (raw) {
                const parsed = JSON.parse(raw)
                const merged = {
                    ...state,
                    contacts: parsed.contacts || state.contacts,
                    groups: parsed.groups || state.groups,
                    messages: parsed.messages || state.messages,
                    invitations: parsed.invitations || state.invitations,
                }
                dispatch({ type: "LOAD_SAVED", payload: merged })
            }
        } catch (e) {
            console.error("Error al analizar el estado guardado", e)
        }
    }, [])

    useEffect(() => {
        const toSave = {
            contacts: state.contacts,
            groups: state.groups,
            messages: state.messages,
            invitations: state.invitations,
        }
        try {
            localStorage.setItem("groupchat-state", JSON.stringify(toSave))
        } catch (e) {
            console.error("Error saving state", e)
        }
    }, [state.groups, state.messages, state.invitations, state.contacts])

    const createGroup = ({ name, memberIds = [] }) => {
        const id = Date.now()
        const members = Array.from(new Set([...(memberIds || []), state.currentUser.id]))
        const roles = members.reduce((acc, mid) => {
            acc[mid] = mid === state.currentUser.id ? "admin" : "member"
            return acc
        }, {})
        const group = {
            id,
            name,
            adminId: state.currentUser.id,
            members,
            roles,
            createdAt: new Date().toISOString(),
        }
        dispatch({ type: "CREATE_GROUP", payload: { group } })
        return group
    }

    const addMemberToGroup = (groupId, memberId) => {
        dispatch({ type: "ADD_MEMBER", payload: { groupId, memberId } })
    }

    const removeMemberFromGroup = (groupId, memberId) => {
        dispatch({ type: "REMOVE_MEMBER", payload: { groupId, memberId } })
    }

    const assignRole = (groupId, memberId, role) => {
        dispatch({ type: "ASSIGN_ROLE", payload: { groupId, memberId, role } })
    }

    const sendInvitation = (groupId, toContactId) => {
        const invitation = {
            id: Date.now(),
            groupId,
            toContactId,
            fromId: state.currentUser.id,
            status: "pending",
            sentAt: new Date().toISOString(),
        }
        dispatch({ type: "SEND_INVITATION", payload: { invitation } })
        return invitation
    }

    const acceptInvitation = (invitationId) => {
        const inv = state.invitations.find((i) => i.id === invitationId)
        if (!inv) return null
        dispatch({ type: "UPDATE_INVITATION", payload: { id: invitationId, updates: { status: "accepted", respondedAt: new Date().toISOString() } } })
        dispatch({ type: "ADD_MEMBER", payload: { groupId: inv.groupId, memberId: inv.toContactId } })
        return inv
    }

    const addGroupMessage = (groupId, text) => {
        const contactsMap = new Map(state.contacts.map((c) => [c.id, c]))
        const sender = state.currentUser
        const message = {
            id: Date.now(),
            senderId: sender.id,
            senderName: sender.name,
            text,
            time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            date: "Hoy",
        }
        dispatch({ type: "ADD_GROUP_MESSAGE", payload: { groupId, message } })

        const group = state.groups.find((g) => g.id === groupId)
        if (group) {
            const otherMembers = group.members.filter((m) => m !== state.currentUser.id)
            if (otherMembers.length > 0) {
                setTimeout(() => {
                    const randomMemberId = otherMembers[Math.floor(Math.random() * otherMembers.length)]
                    const randomMember = contactsMap.get(randomMemberId)
                    const responses = ["Perfecto", "Ok", "Lo veo", "Gracias", "Confirmo", "👍", "Lo hacemos así"]
                    const responseMessage = {
                        id: Date.now() + 1,
                        senderId: randomMemberId,
                        senderName: randomMember ? randomMember.name : "Miembro",
                        text: responses[Math.floor(Math.random() * responses.length)],
                        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
                        date: "Hoy",
                    }
                    dispatch({ type: "ADD_GROUP_MESSAGE", payload: { groupId, message: responseMessage } })
                }, 1200 + Math.random() * 2000)
            }
        }
    }

    // GETTERS
    const getGroups = () => state.groups
    const getGroupById = (id) => state.groups.find((g) => g.id === Number.parseInt(id))
    const getGroupMessages = (groupId) => state.messages[groupId] || []
    const getGroupMembers = (groupId) => {
        const g = state.groups.find((x) => x.id === Number.parseInt(groupId))
        if (!g) return []
        return g.members.map((mid) => state.contacts.find((c) => c.id === mid)).filter(Boolean)
    }
    const getGroupRoles = (groupId) => {
        const g = state.groups.find((x) => x.id === Number.parseInt(groupId))
        return (g && g.roles) || {}
    }
    const getPendingInvitationsForGroup = (groupId) => state.invitations.filter((inv) => inv.groupId === groupId && inv.status === "pendiente")
    const getPendingInvitationsForContact = (contactId) => state.invitations.filter((inv) => inv.toContactId === contactId && inv.status === "pendiente")

    const filteredContacts = state.contacts.filter((contact) =>
        contact.name.toLowerCase().includes(state.searchTerm.toLowerCase()),
    )

    const value = {
        ...state,
        dispatch,
        createGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        assignRole,
        sendInvitation,
        acceptInvitation,
        addGroupMessage,
        getGroups,
        getGroupById,
        getGroupMessages,
        getGroupMembers,
        getGroupRoles,
        getPendingInvitationsForGroup,
        getPendingInvitationsForContact,
        filteredContacts,
    }

    return <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>
}

export function useWhatsApp() {
    const ctx = useContext(WhatsAppContext)
    if (!ctx) throw new Error("useWhatsApp debe usarse dentro de WhatsAppProvider")
    return ctx
}