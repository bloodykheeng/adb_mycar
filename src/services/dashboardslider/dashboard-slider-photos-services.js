import axiosAPI from "../axiosApi";

export async function getAllDashboardSliderPhotos(params = {}) {
    const response = await axiosAPI.get("dashboard-slider-photos", { params: params });
    return response;
}

export async function getDashboardSliderPhotoById(id) {
    const response = await axiosAPI.get(`dashboard-slider-photos/` + id);
    return response;
}

export async function postDashboardSliderPhotos(data) {
    const response = await axiosAPI.post(`dashboard-slider-photos`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateDashboardSliderPhotos(id, data) {
    const response = await axiosAPI.put(`dashboard-slider-photos/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteDashboardSliderPhotoById(id) {
    const response = await axiosAPI.delete(`dashboard-slider-photos/${id}`);
    return response;
}
