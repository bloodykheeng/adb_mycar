import axiosAPI from "../axiosApi";

export async function getAllVendorServices(params = {}) {
    const response = await axiosAPI.get("services", { params: params });
    return response;
}

export async function getVendorServiceById(id) {
    const response = await axiosAPI.get(`services/` + id);
    return response;
}

export async function postVendorService(data) {
    const response = await axiosAPI.post(`services`, data);
    return response;
}

export async function updateVendorService(id, data) {
    const response = await axiosAPI.post(`services/${id}`, data);
    return response;
}

export async function deleteVendorServiceById(id) {
    const response = await axiosAPI.delete(`services/${id}`);
    return response;
}
