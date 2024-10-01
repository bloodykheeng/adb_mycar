import axiosAPI from "../axiosApi";

export async function getAllParkingFees(params = {}) {
    const response = await axiosAPI.get("parking-fees", { params: params });
    return response;
}

export async function getParkingFeeById(id) {
    const response = await axiosAPI.get(`parking-fees/` + id);
    return response;
}

export async function postParkingFees(data) {
    const response = await axiosAPI.post(`parking-fees`, data);
    return response;
}

export async function updateParkingFees(id, data) {
    const response = await axiosAPI.put(`parking-fees/${id}`, data);
    return response;
}

export async function deleteParkingFeeById(id) {
    const response = await axiosAPI.delete(`parking-fees/${id}`);
    return response;
}
