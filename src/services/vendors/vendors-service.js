import axiosAPI from "../axiosApi";

export async function getAllVendors(params = {}) {
    const response = await axiosAPI.get("vendors", { params: params });
    return response;
}

export async function getVendorById(id) {
    const response = await axiosAPI.get(`vendors/` + id);
    return response;
}

export async function postVendor(data) {
    const response = await axiosAPI.post(`vendors`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateVendor(id, data) {
    const response = await axiosAPI.post(`vendors/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteVendorById(id) {
    const response = await axiosAPI.delete(`vendors/${id}`);
    return response;
}
