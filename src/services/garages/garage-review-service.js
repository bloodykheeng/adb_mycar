import axiosAPI from "../axiosApi";

export async function getAllGarageReviews(params = {}) {
    const response = await axiosAPI.get("garage-review", { params: params });
    return response;
}

export async function getGarageReviewById(id) {
    const response = await axiosAPI.get(`garage-review/` + id);
    return response;
}

export async function postGarageReview(data) {
    const response = await axiosAPI.post(`garage-review`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function updateGarageReview(id, data) {
    const response = await axiosAPI.post(`garage-review/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function deleteGarageReviewById(id) {
    const response = await axiosAPI.delete(`garage-review/${id}`);
    return response;
}
