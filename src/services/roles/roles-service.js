import axiosAPI from "../axiosApi";
export async function getAllRoles(params = {}) {
  const response = await axiosAPI.get("users-roles", { params: params });
  return response;
}

// takes in
// role_id;
// permission_ids;
// {
//   "role_id": 1,
//   "permission_ids": [2, 3, 4]
// }
export async function addPermissionsToRole(data) {
  const response = await axiosAPI.post(
    `users-roles-addPermissionsToRole`,
    data
  );
  return response;
}

// takes in role_id;
// permission_id;
export async function deletePermissionFromRole(data) {
  const response = await axiosAPI.post(
    `users-roles-deletePermissionFromRole`,
    data
  );
  return response;
}
// export async function getUserById(id) {
//   const response = await axiosAPI.get(`users/${id}`);
//   return response;
// }

// export async function getApproverRoles() {
//   const response = await axiosAPI.get(`approver-roles`);
//   return response;
// }

// export async function createUser(data) {
//   const response = await axiosAPI.post(`users`, data);
//   return response;
// }

// export async function updateUser(id, data) {
//   const response = await axiosAPI.put(`users/${id}`, data);
//   return response;
// }

// export async function deleteUserById(id) {
//   console.log("deleting user endpoint");
//   const response = await axiosAPI.delete(`users/${id}`);
//   console.log("deleting user response is : ", response);
//   return response;
// }

// export async function getAssignableRoles() {
//   const response = await axiosAPI.get("roles");
//   return response;
// }
