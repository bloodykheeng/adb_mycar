import axiosAPI from "../axiosApi";

export async function getAllCarWashOrders(params = {}) {
    const response = await axiosAPI.get("car-wash-orders", { params: params });
    return response;
}

export async function getCarWashOrderById(id) {
    const response = await axiosAPI.get(`car-wash-orders/` + id);
    return response;
}

export async function postCarWashOrders(data) {
    const response = await axiosAPI.post(`car-wash-orders`, data);
    return response;
}

export async function updateCarWashOrders(id, data) {
    const response = await axiosAPI.put(`car-wash-orders/${id}`, data);
    return response;
}

export async function deleteCarWashOrderById(id) {
    const response = await axiosAPI.delete(`car-wash-orders/${id}`);
    return response;
}
