import axiosAPI from "../axiosApi";

export async function getAllParkings(params = {}) {
    const response = await axiosAPI.get("parking", { params: params });
    return response;
}

export async function getParkingById(id) {
    const response = await axiosAPI.get(`parking/` + id);
    return response;
}

export async function postParkings(data) {
    const response = await axiosAPI.post(`parking`, data);
    return response;
}

export async function updateParkings(id, data) {
    const response = await axiosAPI.put(`parking/${id}`, data);
    return response;
}

export async function deleteParkingById(id) {
    const response = await axiosAPI.delete(`parking/${id}`);
    return response;
}
