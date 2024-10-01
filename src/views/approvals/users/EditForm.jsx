import React, { useState, useEffect } from "react";

import { getAllUsers, getUserById, getApproverRoles, createUser, updateUser, deleteUserById, getAssignableRoles } from "../../../services/auth/user-service";

import RowForm from "./widgets/RowForm";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

function EditForm({ loggedInUserData, ...props }) {
    const queryClient = useQueryClient();

    const editMutation = useMutation({
        mutationFn: (variables) => updateUser(props?.rowData?.id, variables),
        onSuccess: () => {
            props.onClose();
            toast.success("Edited Successfully");
            queryClient.invalidateQueries(["users"]);
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            console.log("create programs error : ", error);
        },
    });

    // const handleSubmit = (data) => {
    //     console.log("updating user : ", data);

    //     editMutation.mutate(data);
    // };

    const handleSubmit = async (data) => {
        console.log("Updating user: ", data);

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("status", data.status);

        formData.append("nin_no", data.nin_no);
        formData.append("dateOfBirth", data.dateOfBirth);
        formData.append("phone_number", data.phone_number);
        formData.append("agree_to_terms", data.agree_to_terms);

        // Only append the password if it's provided, to avoid updating it unintentionally
        if (data.password) {
            formData.append("password", data.password);
        }

        if (data.vendor_id) {
            formData.append("vendor_id", data.vendor_id);
        }
        // Assuming 'role' is a text field and not a file
        if (data.role) {
            formData.append("role", data.role);
        }

        // Assuming 'photo' is a file field; it should be handled by the onFileUpload function
        if (data.photo) {
            formData.append("photo", data.photo);
        }

        // Log formData keys and values for debugging
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        editMutation.mutate(formData);
    };

    return (
        <Dialog header="Users Form" visible={props.show} maximizable={true} onHide={() => props.onHide()}>
            {/* <h3>Programs Edit Form</h3> */}
            <p>Edit Data Below</p>
            <RowForm loggedInUserData={loggedInUserData} initialData={props.rowData} handleSubmit={handleSubmit} selectedParentItem={props?.selectedParentItem} />
            {/* <h4>{creactProgramsMutation.status}</h4> */}

            {editMutation.isLoading && (
                <center>
                    <ProgressSpinner
                        style={{
                            width: "50px",
                            height: "50px",
                            borderWidth: "8px", // Border thickness
                            borderColor: "blue", // Border color
                            animationDuration: "1s",
                        }}
                        strokeWidth="8"
                        animationDuration="1s"
                    />
                </center>
            )}
        </Dialog>
    );
}

export default EditForm;
