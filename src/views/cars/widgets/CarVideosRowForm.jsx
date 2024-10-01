import React, { useState, useRef, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { Dropdown } from "primereact/dropdown";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classNames } from "primereact/utils";

import setFieldTouched from "final-form-set-field-touched";
//
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DeleteIcon from "@mui/icons-material/Delete";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";

import { Toast as PrimeReactToast } from "primereact/toast";

//
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";
import { getAllVendors, getVendorById, postVendor, updateVendor, deleteVendorById } from "../../../services/vendors/vendors-service.js";
import { getAllCarBrands, getCarBrandById, postCarBrand, updateCarBrand, deleteCarBrandById } from "../../../services/cars/car-brands-service.js";
import { getAllCarTypes, getCarTypeById, postCarType, updateCarType, deleteCarTypeById } from "../../../services/cars/car-types-service";
import { DisabledByDefaultIcon } from "@mui/icons-material/DisabledByDefault";

import { getAllCars, getCarById, postCar, updateCar, deleteCarById } from "../../../services/cars/car-service";

function CarVideosRowForm({ initialData, ...props }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const queryClient = useQueryClient();

    const [errors, setErrors] = useState({});
    const inputClassName = (fieldName) => {
        return errors[fieldName] ? "p-invalid" : "";
    };

    // const onSubmitForm = (data) => {
    //     const errors = validate(data);
    //     if (Object.keys(errors).length === 0) {
    //         // No validation errors
    //         setPendingData(data);
    //         setShowConfirmDialog(true);
    //     } else {
    //         toast.warning("First Fill In All Required Fields");
    //     }
    // };

    const validateCaptions = () => {
        const captionErrors = {};

        // Validate video captions
        Object.keys(videoCaptions).forEach((key) => {
            if (!videoCaptions[key].trim()) {
                captionErrors[key] = "Caption is required for the video";
            }
        });
        return captionErrors;
    };

    //
    const validateVideosForm = () => {
        let newErrors = {};

        // Validate captions for each uploaded video
        uploadedVideos.forEach((video) => {
            if (!videoCaptions[video.id] || videoCaptions[video.id].trim() === "") {
                const key = `caption_${video.id}`;
                newErrors[key] = "A caption is required for each video.";
            }
        });

        return newErrors;
    };

    const onSubmitForm = (data, form) => {
        const captionErrors = validateCaptions();
        const validateVideosFormErrors = validateVideosForm();
        const allErrors = { ...captionErrors };
        if (Object.keys(allErrors).length === 0) {
            // Check for media upload
            if (uploadedVideos.length === 0) {
                primereacttoast.current.show({ severity: "warn", summary: "Media Required", detail: "At least one  video is required to submit.", life: 3000 });
                return;
            }

            const videosWithCaptions = uploadedVideos.map((video) => ({
                videoName: video.name,
                caption: videoCaptions[video.id] || "",
            }));

            const formData = { ...data, uploadedVideos, videoCaptions };
            setPendingData(formData);
            setShowConfirmDialog(true);
        } else {
            // Mark all fields as touched to show validation errors

            toast.warning("Please fill in all required fields and upload a photo.");
            primereacttoast.current.show({ severity: "error", summary: "Validation Error", detail: "You still have some invalid fields. Please rectify them.", life: 3000 });
            setErrors(allErrors);
        }
    };

    const onConfirm = () => {
        if (pendingData) {
            handleSubmit(pendingData);
            setPendingData(null);
        }
        setShowConfirmDialog(false);
    };

    const onCancel = () => {
        setShowConfirmDialog(false);
    };

    const primereacttoast = useRef(null);
    // Ref for the file upload component

    //==================== upload videos ===========================

    const [uploadedVideos, setUploadedVideos] = useState([]);
    const [videoCaptions, setVideoCaptions] = useState({});
    const videoUploadRef = useRef(null);

    const onVideoUpload = (e) => {
        const filesWithId = e.files.map((file) => ({
            file,
            id: `${file.name}-${Date.now()}`,
            objectURL: URL.createObjectURL(file),
        }));
        setUploadedVideos(uploadedVideos.concat(filesWithId));

        if (videoUploadRef.current) {
            videoUploadRef.current.clear();
        }
    };

    const onVideoSelect = (e) => {
        if (e.files.length + uploadedVideos.length > 5) {
            primereacttoast.current.show({ severity: "warn", summary: "Warning", detail: "You can only upload up to 5 videos.", life: 3000 });
            e.files = [];
            if (videoUploadRef.current) {
                videoUploadRef.current.clear();
            }
            return;
        }

        const allowedVideoTypes = [".mp4", ".mov", ".wmv", ".avi"];
        const isVideoFile = e.files.every((file) => allowedVideoTypes.some((type) => file.name.toLowerCase().endsWith(type)));

        if (!isVideoFile) {
            primereacttoast.current.show({ severity: "warn", summary: "Warning", detail: "Only video files are allowed.", life: 3000 });
            e.files = [];
            if (videoUploadRef.current) {
                videoUploadRef.current.clear();
            }
        } else {
            setUploadedVideos([
                ...uploadedVideos,
                ...e.files.map((file) => ({
                    file,
                    id: `${file.name}-${Date.now()}`,
                    objectURL: URL.createObjectURL(file),
                })),
            ]);

            if (videoUploadRef.current) {
                videoUploadRef.current.clear();
            }
        }
    };

    const removeVideo = (idToRemove) => {
        setUploadedVideos(uploadedVideos.filter((video) => video.id !== idToRemove));
        const newCaptions = { ...videoCaptions };
        delete newCaptions[idToRemove];
        setVideoCaptions(newCaptions);
    };

    //
    const editMutation = useMutation({
        mutationFn: (variables) => updateCar(pendingData?.id, variables),
        onSuccess: () => {
            toast.success("Edited Successfully");
            queryClient.invalidateQueries(["cars"]);
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
        formData.append("visibility", data.visibility);
        formData.append("status", data.status);

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

        editMutation.mutate(formData);
    };

    return (
        <div className="col-12 md:col-12">
            <PrimeReactToast ref={primereacttoast} />
            <div className="card p-fluid">
                <Form
                    onSubmit={onSubmitForm}
                    initialValues={initialData}
                    mutators={{ setFieldTouched }}
                    // validate={validate}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                console.log("values hhh : ", values);
                                console.log("event fffff : ", event);
                                onSubmitForm(values, form);
                                // handleSubmit(event, values);
                            }}
                        >
                            <div className="p-field m-4">
                                <FileUpload ref={videoUploadRef} name="videos" accept="video/*" customUpload={true} onSelect={onVideoSelect} uploadHandler={onVideoUpload} multiple emptyTemplate={<p className="m-0">Drag and drop videos here to upload, maximum is 5.</p>} />
                                <div className="flex flex-wrap">
                                    {uploadedVideos.map((video, index) => (
                                        <div key={video.id} className="p-2" style={{ display: "flex", flexDirection: "row", gap: "0.5rem", alignItems: "center", justifyContent: "center" }}>
                                            <video width="250" controls src={video.objectURL} alt={`Video ${video.id}`} />
                                            <InputTextarea
                                                value={videoCaptions[video.id] || ""}
                                                onChange={(e) => {
                                                    setVideoCaptions({ ...videoCaptions, [video.id]: e.target.value });
                                                    if (errors[`caption_${video.id}`]) {
                                                        setErrors({ ...errors, [`caption_${video.id}`]: null });
                                                    }
                                                }}
                                                rows={3}
                                                cols={30}
                                                placeholder="Add a caption..."
                                                className={inputClassName(`caption_${video.id}`)}
                                            />
                                            {errors[`caption_${video.id}`] && <small className="p-error">{errors[`caption_${video.id}`]}</small>}
                                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined" onClick={() => removeVideo(video.id)} aria-label="Delete" />
                                        </div>
                                    ))}
                                </div>
                                {uploadedVideos.length > 0 && (
                                    <Button
                                        label="Remove All Videos"
                                        icon="pi pi-times"
                                        onClick={() => {
                                            setUploadedVideos([]);
                                            setVideoCaptions({});
                                        }}
                                        className="p-button-text p-button-danger"
                                    />
                                )}
                            </div>

                            <div className="d-grid gap-2">
                                <Button type="submit" label="Save" className="p-button-primary" icon="pi pi-check" />
                            </div>
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
                        </form>
                    )}
                />
                <Dialog
                    header="Confirmation"
                    visible={showConfirmDialog}
                    style={{ width: "30vw" }}
                    onHide={onCancel}
                    footer={
                        <div>
                            <Button label="Yes" onClick={onConfirm} />
                            <Button label="No" onClick={onCancel} className="p-button-secondary" />
                        </div>
                    }
                >
                    Are you sure you want to submit?
                </Dialog>
            </div>
        </div>
    );
}

export default CarVideosRowForm;
