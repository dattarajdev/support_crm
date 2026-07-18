import apiClient from "./apiClient";

// Get all tickets
export const getTickets = async () => {
    const response = await apiClient.get("/tickets");
    return response.data;
};

// Get a single ticket
export const getTicket = async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}`);
    return response.data;
};

// Create a ticket
export const createTicket = async (ticketData) => {
    const response = await apiClient.post("/tickets", ticketData);
    return response.data;
};

// Update a ticket
export const updateTicket = async (ticketId, updateData) => {
    const response = await apiClient.put(`/tickets/${ticketId}`, updateData);
    return response.data;
};

// Delete a ticket
export const deleteTicket = async (ticketId) => {
    const response = await apiClient.delete(`/tickets/${ticketId}`);
    return response.data;
};