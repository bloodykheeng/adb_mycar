import React, { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";

import { getAllCars, getCarById, postCar, updateCar, deleteCarById } from "../../services/cars/car-service";

import RowForm from "./widgets/RowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

function CreateForm(props) {
    const [name, setName] = useState();
    const [details, setDetails] = useState();
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [validated, setValidated] = useState(true);

    const queryClient = useQueryClient();

    const creactMutation = useMutation(postCar, {
        onSuccess: () => {
            queryClient.invalidateQueries(["cars"]);
            toast.success("created Successfully");
            props.onClose();
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            console.log("create Cars error : ", error);
        },
    });

    // const handleSubmit = async (data) => {
    //     // event.preventDefault();
    //     console.log("data we are submitting : ", data);
    //     creactMutation.mutate(data);
    // };

    const handleSubmit = async (data) => {
        console.log("Data we are submitting: ", data);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("code", data.code);
        formData.append("description", data.description);
        formData.append("status", data.status);
        formData.append("make", data.make);
        formData.append("model", data.model);
        formData.append("year", data.year);
        formData.append("mileage", data.mileage);
        formData.append("number_plate", data.number_plate);
        formData.append("price", data.price);
        formData.append("quantity", data.quantity);
        formData.append("color", data.color);

        formData.append("fuel_type", data.fuel_type);
        formData.append("drive_type", data.drive_type);
        formData.append("engine_type", data.engine_type);
        formData.append("vin", data.vin);
        formData.append("identifier", data.identifier);

        // Append images with captions
        data.uploadedImages.forEach((item) => {
            // Assuming 'item' is the File object or you have access to the file object here
            const file = item.file; // Direct reference if 'item' is the File
            formData.append(`images[]`, file);
            formData.append(`imageCaptions[${item.id}]`, data.imageCaptions[item.id]); // Append image caption using the custom ID
        });

        // Append videos with captions
        data.uploadedVideos.forEach((item) => {
            // or you have a way to get the `File` object from `item`
            const file = item.file; // Direct reference if 'item' is the File
            formData.append(`videos[]`, file); // Append video file
            formData.append(`videoCaptions[${item.id}]`, data.videoCaptions[item.id]); // Append video caption using the custom ID
        });

        // Append car_brand_id and vendor_id if they are included in your form
        if (data.car_brand_id) {
            formData.append("car_brand_id", data.car_brand_id);
        }

        if (data.car_type_id) {
            formData.append("car_type_id", data.car_type_id);
        }
        if (data.vendor_id) {
            formData.append("vendor_id", data.vendor_id);
        }

        // Log formData keys and values for debugging
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        creactMutation.mutate(formData);
    };

    return (
        <Dialog header="Cars Form" visible={props.show} maximizable={true} onHide={() => props.onHide()}>
            <p>Fill in the form below</p>
            <RowForm handleSubmit={handleSubmit} project_id={props?.projectId} />
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
