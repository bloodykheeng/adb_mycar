import axiosAPI from "../axiosApi";

export async function getAllCarTypes(params = {}) {
    const response = await axiosAPI.get("car-types", { params: params });
    return response;
}

export async function getCarTypeById(id) {
    const response = await axiosAPI.get(`car-types/` + id);
    return response;
}

export async function postCarType(data) {
    const response = await axiosAPI.post(`car-types`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateCarType(id, data) {
    const response = await axiosAPI.post(`car-types/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteCarTypeById(id) {
    const response = await axiosAPI.delete(`car-types/${id}`);
    return response;
}
