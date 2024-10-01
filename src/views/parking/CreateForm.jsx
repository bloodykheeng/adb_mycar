import React, { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";

import { getAllParkings, getParkingById, postParkings, updateParkings, deleteParkingById } from "../../services/parking/parking-service.js";

import RowForm from "./widgets/RowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

function CreateForm({ selectedParentItem, ...props }) {
    const [name, setName] = useState();
    const [details, setDetails] = useState();
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [validated, setValidated] = useState(true);

    const queryClient = useQueryClient();

    const creactMutation = useMutation(postParkings, {
        onSuccess: () => {
            queryClient.invalidateQueries(["parking"]);
            toast.success("created Successfully");
            props.onClose();
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            console.log("create parking error : ", error);
        },
    });

    const handleSubmit = async (data) => {
        // event.preventDefault();
        console.log("data we are submitting : ", data);
        creactMutation.mutate(data);
    };

    return (
        <Dialog header="Parking Service Form" visible={props.show} maximizable={true} onHide={() => props.onHide()}>
            <p>Fill in the form below</p>
            <RowForm selectedParentItem={selectedParentItem} handleSubmit={handleSubmit} project_id={props?.projectId} />
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

export default CreateForm;
