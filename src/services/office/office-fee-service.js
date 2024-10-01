import axiosAPI from "../axiosApi";

export async function getAllOfficeFees(params = {}) {
    const response = await axiosAPI.get("office-fees", { params: params });
    return response;
}

export async function getOfficeFeeById(id) {
    const response = await axiosAPI.get(`office-fees/` + id);
    return response;
}

export async function postOfficeFees(data) {
    const response = await axiosAPI.post(`office-fees`, data);
    return response;
}

export async function updateOfficeFees(id, data) {
    const response = await axiosAPI.put(`office-fees/${id}`, data);
    return response;
}

export async function deleteOfficeFeeById(id) {
    const response = await axiosAPI.delete(`office-fees/${id}`);
    return response;
}
