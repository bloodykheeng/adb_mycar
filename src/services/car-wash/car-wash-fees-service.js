import axiosAPI from "../axiosApi";

export async function getAllCarWashFees(params = {}) {
    const response = await axiosAPI.get("car-wash-fees", { params: params });
    return response;
}

export async function getCarWashFeeById(id) {
    const response = await axiosAPI.get(`car-wash-fees/` + id);
    return response;
}

export async function postCarWashFees(data) {
    const response = await axiosAPI.post(`car-wash-fees`, data);
    return response;
}

export async function updateCarWashFees(id, data) {
    const response = await axiosAPI.put(`car-wash-fees/${id}`, data);
    return response;
}

export async function deleteCarWashFeeById(id) {
    const response = await axiosAPI.delete(`car-wash-fees/${id}`);
    return response;
}
