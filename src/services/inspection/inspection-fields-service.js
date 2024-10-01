import axiosAPI from "../axiosApi";

export async function getAllInspectionFields(params = {}) {
    const response = await axiosAPI.get("inspection-fields", { params: params });
    return response;
}

export async function getInspectionFieldById(id) {
    const response = await axiosAPI.get(`inspection-fields/` + id);
    return response;
}

export async function postInspectionFields(data) {
    const response = await axiosAPI.post(`inspection-fields`, data);
    return response;
}

export async function updateInspectionFields(id, data) {
    const response = await axiosAPI.put(`inspection-fields/${id}`, data);
    return response;
}

export async function deleteInspectionFieldById(id) {
    const response = await axiosAPI.delete(`inspection-fields/${id}`);
    return response;
}
