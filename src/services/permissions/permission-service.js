import axiosAPI from "../axiosApi";

export async function getAllPermissions(params = {}) {
  const response = await axiosAPI.get("users-permissions", {
    params: params
  });
  return response;
}

export async function getPermissionNotInCurrentRole(id) {
  console.log("idccccc : ", id);
  const response = await axiosAPI.get(
    `users-permissions-permissionNotInCurrentRole/${id}`
  );
  return response;
}

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
