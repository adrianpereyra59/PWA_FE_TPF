import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import api from "../Services/api";
import { useAuth } from "./AuthContext";


const WhatsAppContext = createContext();

const initialState = {
  contacts: [
    { id: 1, name: "María García", phone: "+34 612 345 678", email: "maria@example.com", avatar: "" },
    { id: 2, name: "Juan Pérez", phone: "+34 687 654 321", email: "juan@example.com", avatar: "" },
  ],
  groups: [],
  messages: {}, 
  invitations: [],
  activeTab: "chats",
  searchTerm: "",
  currentUser: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "SET_GROUPS":
      return { ...state, groups: action.payload };
    case "ADD_GROUP":
      return { ...state, groups: [...state.groups, action.payload] };
    case "UPDATE_GROUP":
      return { ...state, groups: state.groups.map((g) => (g.id === action.payload.id ? action.payload : g)) };
    case "ADD_GROUP_MESSAGE": {
      const { groupId, message } = action.payload;
      return {
        ...state,
        messages: { ...state.messages, [groupId]: [...(state.messages[groupId] || []), message] },
      };
    }
    case "SET_MESSAGES":
      return { ...state, messages: { ...state.messages, [action.payload.groupId]: action.payload.messages } };
    case "SET_INVITATIONS":
      return { ...state, invitations: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_CONTACTS":
      return { ...state, contacts: action.payload };
    default:
      return state;
  }
}

export function WhatsAppProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, { ...initialState, currentUser: user || null });

  // sync auth user
  useEffect(() => {
    dispatch({ type: "SET_CURRENT_USER", payload: user ?? null });
  }, [user]);

  const parseWorkspaceList = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data.workspaces)) return res.data.workspaces;
    if (res.data && Array.isArray(res.data)) return res.data;
    if (res.data && res.data.workspaces && Array.isArray(res.data.workspaces)) return res.data.workspaces;
    if (res.data && res.data.workspace) return [res.data.workspace];
    return [];
  };

  const parseCreatedWorkspace = (res) => {
    if (!res) return null;
    if (res.data && res.data.workspace) return res.data.workspace;
    if (res.data && res.data.workspaces && res.data.workspaces.length > 0) return res.data.workspaces[0];
    if (res.data && (typeof res.data === "object")) {

      const cand = res.data;
      if (cand._id || cand.id || cand.name) return cand;
    }
    if (res._id || res.id || res.name) return res;
    return null;
  };

  const fetchGroups = useCallback(async () => {
    try {
      const res = await api.get("/workspace");
      const list = parseWorkspaceList(res) || [];
      const normalized = list.map((w) => ({
        id: w._id ?? w.id ?? (w._id ? String(w._id) : Date.now()),
        name: w.name ?? w.title ?? "Workspace",
        raw: w,
      }));
      dispatch({ type: "SET_GROUPS", payload: normalized });
      return { success: true, data: normalized };
    } catch (err) {
      console.warn("fetchGroups error:", err);
      return { success: false, message: err?.message || "Error al obtener grupos" };
    }
  }, []);

  const createGroup = useCallback(
    async ({ name, memberIds = [], url_img = "" }) => {
      // local fallback helper
      const createLocal = () => {
        const id = Date.now();
        const group = { id, name, members: memberIds, adminId: state.currentUser?.id ?? "me", createdAt: new Date().toISOString() };
        dispatch({ type: "ADD_GROUP", payload: group });
        return group;
      };

      try {
        const payload = { name, url_img };
        const res = await api.post("/workspace", payload);
        const created = parseCreatedWorkspace(res);
        if (created) {
          const normalized = {
            id: created._id ?? created.id ?? Date.now(),
            name: created.name ?? name,
            raw: created,
          };
          dispatch({ type: "ADD_GROUP", payload: normalized });

          for (const memberId of memberIds || []) {
            const contact = state.contacts.find((c) => c.id === memberId || String(c.id) === String(memberId));
            if (contact && contact.email) {
              try {
                await api.post(`/workspace/${created._id ?? created.id}/invite`, { invited_email: contact.email });
              } catch (e) {
                console.warn("La invitación falló para", contact.email, e);
              }
            }
          }

          return { success: true, data: normalized };
        } else {
          await fetchGroups();
          return { success: true, message: "Grupo creado (sin respuesta explícita), lista actualizada." };
        }
      } catch (err) {
        console.error("Error en createGroup API:", err);
        const local = createLocal();
        return { success: false, message: err?.message || "Error creando grupo, creado localmente", data: local };
      }
    },
    [state.contacts, state.currentUser, fetchGroups],
  );

  const getGroupById = useCallback(
    (id) => {
      const numericId = id;
      const found = state.groups.find((g) => String(g.id) === String(numericId) || String(g.id) === String(numericId));
      return found || null;
    },
    [state.groups],
  );

  const fetchMessagesForGroup = useCallback(
    async (groupId, channelId) => {
      try {
        const res = await api.get(`/workspace/${groupId}/channels/${channelId}/messages`);
        const msgs = (res?.data?.messages) ?? (res?.data ?? []);
        dispatch({ type: "SET_MESSAGES", payload: { groupId, messages: msgs } });
        return { success: true, data: msgs };
      } catch (err) {
        console.warn("fetchMessagesForGroup error:", err);
        return { success: false, message: err?.message || "Error obteniendo mensajes" };
      }
    },
    [],
  );

  const addGroupMessage = useCallback(
    async (groupId, text, opts = {}) => {
      const msg = {
        id: Date.now(),
        senderId: state.currentUser?.id ?? "me",
        senderName: state.currentUser?.name ?? "You",
        text,
        time: new Date().toLocaleTimeString(),
      };
      dispatch({ type: "ADD_GROUP_MESSAGE", payload: { groupId, message: msg } });

      if (opts.channelId) {
        try {
          await api.post(`/workspace/${groupId}/channels/${opts.channelId}/messages`, { content: text });
          return { success: true };
        } catch (err) {
          console.warn("Error en el mensaje persistente", err);
          return { success: false, message: err?.message || "Error persistiendo mensaje" };
        }
      }
      return { success: true };
    },
    [state.currentUser],
  );

  const inviteToGroup = useCallback(async (groupId, invited_email) => {
    try {
      const res = await api.post(`/workspace/${groupId}/invite`, { invited_email });
      return { success: true, data: res };
    } catch (err) {
      console.warn("Error de invitación al grupo:", err);
      return { success: false, message: err?.message || "Error invitando al usuario" };
    }
  }, []);

  useEffect(() => {
    fetchGroups().catch(() => {});
  }, []);

  const value = {
    ...state,
    fetchGroups,
    createGroup,
    getGroupById,
    fetchMessagesForGroup,
    addGroupMessage,
    inviteToGroup,
    setSearchTerm: (term) => dispatch({ type: "SET_SEARCH_TERM", payload: term }),
    setContacts: (contacts) => dispatch({ type: "SET_CONTACTS", payload: contacts }),
  };

  return <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>;
}

export function useWhatsApp() {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) throw new Error("useWhatsApp debe usarse dentro de WhatsAppProvider");
  return ctx;
}

export default WhatsAppProvider;