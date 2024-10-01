import axiosAPI from "../axiosApi";

export async function getAllActivityLogs() {
  const response = await axiosAPI.get("activity-logs");
  return response;
}

// export async function getProgramById(id) {
//   const response = await axiosAPI.get(`activity-logs/` + id);
//   return response;
// }

// export async function postPrograms(data) {
//   const response = await axiosAPI.post(`activity-logs`, data);
//   return response;
// }

// export async function updatePrograms(id, data) {
//   const response = await axiosAPI.put(`activity-logs/${id}`, data);
//   return response;
// }

export async function deletActivityLogById(id) {
  const response = await axiosAPI.delete(`activity-logs/${id}`);
  return response;
}
// "activity-logs";
