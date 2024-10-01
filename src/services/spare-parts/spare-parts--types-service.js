import axiosAPI from "../axiosApi";

export async function getAllSparePartTypeTypes(params = {}) {
    const response = await axiosAPI.get("spare-part-types", { params: params });
    return response;
}

export async function getSparePartTypeById(id) {
    const response = await axiosAPI.get(`spare-part-types/` + id);
    return response;
}

export async function postSparePartType(data) {
    const response = await axiosAPI.post(`spare-part-types`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateSparePartType(id, data) {
    const response = await axiosAPI.post(`spare-part-types/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteSparePartTypeById(id) {
    const response = await axiosAPI.delete(`spare-part-types/${id}`);
    return response;
}
