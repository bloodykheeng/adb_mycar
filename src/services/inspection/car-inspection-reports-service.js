import axiosAPI from "../axiosApi";

export async function getAllCarInspectionReports(params = {}) {
    const response = await axiosAPI.get("car-inspection-reports", { params: params });
    return response;
}

export async function getCarInspectionReportById(id) {
    const response = await axiosAPI.get(`car-inspection-reports/` + id);
    return response;
}

export async function postCarInspectionReports(data) {
    const response = await axiosAPI.post(`car-inspection-reports`, data);
    return response;
}

export async function postToUpdateCarInspectionReportStatus(data) {
    const response = await axiosAPI.post(`update-car-report-status`, data);
    return response;
}

export async function updateCarInspectionReports(id, data) {
    const response = await axiosAPI.put(`car-inspection-reports/${id}`, data);
    return response;
}

export async function deleteCarInspectionReportById(id) {
    const response = await axiosAPI.delete(`car-inspection-reports/${id}`);
    return response;
}
