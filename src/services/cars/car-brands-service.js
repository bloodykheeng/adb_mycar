import axiosAPI from "../axiosApi";

export async function getAllCarBrands(params = {}) {
    const response = await axiosAPI.get("car-brands", { params: params });
    return response;
}

export async function getCarBrandById(id) {
    const response = await axiosAPI.get(`car-brands/` + id);
    return response;
}

export async function postCarBrand(data) {
    const response = await axiosAPI.post(`car-brands`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateCarBrand(id, data) {
    const response = await axiosAPI.post(`car-brands/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteCarBrandById(id) {
    const response = await axiosAPI.delete(`car-brands/${id}`);
    return response;
}
