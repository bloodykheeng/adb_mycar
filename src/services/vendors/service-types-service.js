import axiosAPI from "../axiosApi";

export async function getAllServiceTypes(params = {}) {
    const response = await axiosAPI.get("service-types", { params: params });
    return response;
}

export async function getServiceTypeById(id) {
    const response = await axiosAPI.get(`service-types/` + id);
    return response;
}

export async function postServiceType(data) {
    const response = await axiosAPI.post(`service-types`, data);
    return response;
}

export async function updateServiceType(id, data) {
    const response = await axiosAPI.put(`service-types/${id}`, data);
    return response;
}

export async function deleteServiceTypeById(id) {
    const response = await axiosAPI.delete(`service-types/${id}`);
    return response;
}
