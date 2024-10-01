import axiosAPI from "../axiosApi";

export async function getAllCars(params = {}) {
    const response = await axiosAPI.get("cars", { params: params });
    return response;
}

export async function getAllCarInspectors(params = {}) {
    const response = await axiosAPI.get("car-inspectors", { params: params });
    return response;
}

export async function getCarById(id) {
    const response = await axiosAPI.get(`cars/` + id);
    return response;
}

export async function postCar(data) {
    const response = await axiosAPI.post(`cars`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function postInspector(data) {
    const response = await axiosAPI.post(`car-inspectors`, data);
    return response;
}

export async function updateCar(id, data) {
    const response = await axiosAPI.post(`cars/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteCarById(id) {
    const response = await axiosAPI.delete(`cars/${id}`);
    return response;
}
