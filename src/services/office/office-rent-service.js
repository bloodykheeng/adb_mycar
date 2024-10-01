import axiosAPI from "../axiosApi";

export async function getAllOfficeRents(params = {}) {
    const response = await axiosAPI.get("office-rents", { params: params });
    return response;
}

export async function getOfficeRentById(id) {
    const response = await axiosAPI.get(`office-rents/` + id);
    return response;
}

export async function postOfficeRents(data) {
    const response = await axiosAPI.post(`office-rents`, data);
    return response;
}

export async function updateOfficeRents(id, data) {
    const response = await axiosAPI.put(`office-rents/${id}`, data);
    return response;
}

export async function deleteOfficeRentById(id) {
    const response = await axiosAPI.delete(`office-rents/${id}`);
    return response;
}
