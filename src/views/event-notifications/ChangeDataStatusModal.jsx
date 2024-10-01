import React, { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";

import { postToUpdateUserStatus } from "../../services/auth/user-service";

import ApprovalRowForm from "./widgets/ApprovalRowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

function ChangeDataStatusModal({ loggedInUserData, ...props }) {
    const queryClient = useQueryClient();

    const creactMutation = useMutation(postToUpdateUserStatus, {
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            toast.success("Updated User Status Successfully");
            props.onClose();
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            console.log("create programs error : ", error);
        },
    });

    const handleSubmit = async (data) => {
        console.log("🚀 ~ handleSubmit ~ data incomming :", data);
        // event.preventDefault();
        let finalData = { user_id: props.selectedItem?.id, status: data?.status };
        console.log("🚀 ~ handleSubmit ~ finalData:", finalData);
        creactMutation.mutate(finalData);
    };

    return (
        <Dialog header="Change Account Status Form" visible={props.show} maximizable={true} onHide={() => props.onClose()}>
            <p>Fill in the form below</p>
            <ApprovalRowForm loggedInUserData={loggedInUserData} initialData={props.selectedItem} handleSubmit={handleSubmit} project_id={props?.projectId} selectedParentItem={props?.selectedParentItem} />
            {/* <h4>{creactProgramsMutation.status}</h4> */}
            {creactMutation.isLoading && (
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
            {/* <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Program Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
        </Modal> */}
        </Dialog>
    );
}

export default ChangeDataStatusModal;
