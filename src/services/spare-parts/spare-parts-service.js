import axiosAPI from "../axiosApi";

export async function getAllSpareParts(params = {}) {
    const response = await axiosAPI.get("spare-parts", { params: params });
    return response;
}

export async function getSparePartById(id) {
    const response = await axiosAPI.get(`spare-parts/` + id);
    return response;
}

export async function postSparePart(data) {
    const response = await axiosAPI.post(`spare-parts`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateSparePart(id, data) {
    const response = await axiosAPI.post(`spare-parts/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteSparePartById(id) {
    const response = await axiosAPI.delete(`spare-parts/${id}`);
    return response;
}
