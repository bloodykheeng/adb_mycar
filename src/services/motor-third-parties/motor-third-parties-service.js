import axiosAPI from "../axiosApi";

export async function getAllMotorThirdParties(params = {}) {
    const response = await axiosAPI.get("motor-third-parties", { params: params });
    return response;
}

export async function getMotorThirdPartieById(id) {
    const response = await axiosAPI.get(`motor-third-parties/` + id);
    return response;
}

export async function postMotorThirdPartie(data) {
    const response = await axiosAPI.post(`motor-third-parties`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateMotorThirdPartie(id, data) {
    const response = await axiosAPI.post(`motor-third-parties/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteMotorThirdPartieById(id) {
    const response = await axiosAPI.delete(`motor-third-parties/${id}`);
    return response;
}
