import React, { useState, useEffect } from "react";

import { getAllGarages, getGarageById, postGarage, updateGarage, deleteGarageById } from "../../services/garages/garages-service.js";

import RowForm from "./widgets/RowForm";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

function EditForm(props) {
    const queryClient = useQueryClient();

    const editMutation = useMutation({
        mutationFn: (variables) => updateGarage(props?.rowData?.id, variables),
        onSuccess: () => {
            props.onClose();
            toast.success("Edited Successfully");
            queryClient.invalidateQueries(["garages"]);
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

    // const handleSubmit = (data) => {
    //     console.log(data);

    //     editMutation.mutate(data);
    // };

    const handleSubmit = async (data) => {
        console.log("Data we are submitting: ", data);

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", data.name);
        formData.append("address", data.address);
        formData.append("availability", data.availability);
        formData.append("opening_hours", data.opening_hours);
        formData.append("special_features", data.special_features || ""); // handle nullable field
        formData.append("description", data.description);
        formData.append("photo", data.photo); // Assuming 'photo' is the field name for the file upload

        // Add any additional fields as needed

        // Log formData keys and values for debugging
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        editMutation.mutate(formData);
    };

    return (
        <Dialog header="Garages Form" visible={props.show} onHide={() => props.onHide()}>
            {/* <h3>Programs Edit Form</h3> */}
            <p>Edit Data Below</p>
            <RowForm initialData={props.rowData} handleSubmit={handleSubmit} />
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
