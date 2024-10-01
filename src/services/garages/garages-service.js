import axiosAPI from "../axiosApi";

export async function getAllGarages(params = {}) {
    const response = await axiosAPI.get("garages", { params: params });
    return response;
}

export async function getGarageById(id) {
    const response = await axiosAPI.get(`garages/` + id);
    return response;
}

export async function postGarage(data) {
    const response = await axiosAPI.post(`garages`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateGarage(id, data) {
    const response = await axiosAPI.post(`garages/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteGarageById(id) {
    const response = await axiosAPI.delete(`garages/${id}`);
    return response;
}
