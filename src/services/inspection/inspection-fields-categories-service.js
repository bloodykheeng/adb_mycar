import axiosAPI from "../axiosApi";

export async function getAllInspectionFieldCategories(params = {}) {
    const response = await axiosAPI.get("inspection-field-categories", { params: params });
    return response;
}

export async function getAllInspectionFieldCategorized(params = {}) {
    const response = await axiosAPI.get("categorized-inspection-fields", { params: params });
    return response;
}

export async function getInspectionFieldCategorieById(id) {
    const response = await axiosAPI.get(`inspection-field-categories/` + id);
    return response;
}

export async function postInspectionFieldCategories(data) {
    const response = await axiosAPI.post(`inspection-field-categories`, data);
    return response;
}

export async function updateInspectionFieldCategories(id, data) {
    const response = await axiosAPI.put(`inspection-field-categories/${id}`, data);
    return response;
}

export async function deleteInspectionFieldCategorieById(id) {
    const response = await axiosAPI.delete(`inspection-field-categories/${id}`);
    return response;
}
