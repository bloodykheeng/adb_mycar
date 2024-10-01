import axiosAPI from "../axiosApi";

export async function getAllEventNotifications(params = {}) {
    const response = await axiosAPI.get("event-notifications", { params: params });
    return response;
}

export async function getEventNotificationById(id) {
    const response = await axiosAPI.get(`event-notifications/` + id);
    return response;
}

export async function postEventNotification(data) {
    const response = await axiosAPI.post(`event-notifications`, data);
    return response;
}

export async function updateEventNotification(id, data) {
    const response = await axiosAPI.post(`event-notifications/${id}`, data);
    return response;
}

export async function deleteEventNotificationById(id) {
    const response = await axiosAPI.delete(`event-notifications/${id}`);
    return response;
}
