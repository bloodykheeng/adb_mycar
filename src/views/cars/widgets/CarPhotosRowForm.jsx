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

import { DisabledByDefaultIcon } from "@mui/icons-material/DisabledByDefault";
import { getAllCars, getCarById, postCar, updateCar, deleteCarById } from "../.././../services/cars/car-service";

function CarPhotosRowForm({ initialData, ...props }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const queryClient = useQueryClient();

    const validateImagesForm = () => {
        let newErrors = {};

        // Validate captions for each uploaded image
        uploadedImages.forEach((image) => {
            if (!imageCaptions[image.id] || imageCaptions[image.id].trim() === "") {
                const key = `caption_${image.id}`;
                newErrors[key] = "A caption is required for each image.";
            }
        });

        return newErrors;
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
        Object.keys(imageCaptions).forEach((key) => {
            if (!imageCaptions[key].trim()) {
                captionErrors[key] = "Caption is required";
            }
        });

        return captionErrors;
    };

    const onSubmitForm = (data, form) => {
        const validateImagesFormErrors = validateImagesForm();
        const captionErrors = validateCaptions();

        const allErrors = { ...validateImagesFormErrors, ...captionErrors };
        if (Object.keys(allErrors).length === 0) {
            // Check for media upload
            if (uploadedImages.length === 0) {
                primereacttoast.current.show({ severity: "warn", summary: "Media Required", detail: "At least one photo or video is required to submit.", life: 3000 });
                return;
            }

            const imagesWithCaptions = uploadedImages.map((image) => ({
                imageName: image.name,
                caption: imageCaptions[image.id] || "",
            }));

            const formData = { ...data, uploadedImages, imageCaptions };
            setPendingData(formData);
            setShowConfirmDialog(true);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });

            toast.warning("Please  upload a photo.");
            // primereacttoast.current.show({ severity: "error", summary: "Validation Error", detail: "You still have some invalid fields. Please rectify them.", life: 3000 });
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

    //=========================== image upload =======================
    const inputClassName = (fieldName) => {
        return errors[fieldName] ? "p-invalid" : "";
    };
    const primereacttoast = useRef(null);
    // Ref for the file upload component
    const fileUploadRef = useRef(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imageCaptions, setImageCaptions] = useState({});
    const [errors, setErrors] = useState({});

    const onImageUpload = (e) => {
        // Create a new array with each file having a unique ID
        const filesWithId = e.files.map((file) => ({
            file,
            id: `${file.name}-${Date.now()}`,
            objectURL: URL.createObjectURL(file),
        }));

        // Append the new files with IDs to the existing uploaded files
        setUploadedImages(uploadedImages.concat(filesWithId));

        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    const removeImage = (idToRemove) => {
        setUploadedImages(uploadedImages.filter((image) => image.id !== idToRemove));

        // Remove the caption associated with the image
        const newCaptions = { ...imageCaptions };
        delete newCaptions[idToRemove];
        setImageCaptions(newCaptions);
    };

    // Function to remove all images
    const removeAllImages = () => {
        setUploadedImages([]);
        setImageCaptions({});
    };

    const handleUploadSuccess = () => {
        // Clear the list of uploaded files
        setUploadedImages([]);
        // Additional success logic
    };

    const onImageSelect = (e) => {
        // Check if the number of files selected exceeds 5
        if (uploadedImages.length + e.files.length > 5) {
            primereacttoast.current.show({ severity: "warn", summary: "Warning", detail: "You can only upload up to 5 images.", life: 3000 });
            e.files = []; // Clear out the files
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
            return;
        }

        // Define allowed image types
        const allowedImageTypes = [".jpg", ".jpeg", ".png", ".gif"];
        const isImageFile = e.files.every((file) => allowedImageTypes.some((type) => file.name.toLowerCase().endsWith(type)));

        if (!isImageFile) {
            // Show warning toast if non-image files are uploaded
            primereacttoast.current.show({ severity: "warn", summary: "Warning", detail: "Only image files are allowed.", life: 3000 });
            e.files = []; // Clear out the non-image files
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
        } else {
            // Append the selected files to the existing uploaded files
            // Assign a unique identifier to each file
            const filesWithId = e.files.map((file) => ({
                file,
                id: `${file.name}-${Date.now()}`,
                objectURL: URL.createObjectURL(file),
            }));
            setUploadedImages([...uploadedImages, ...filesWithId]);

            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
        }
    };

    ///

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

        // Append images with captions
        data.uploadedImages.forEach((item) => {
            // Assuming 'item' is the File object or you have access to the file object here
            const file = item.file; // Direct reference if 'item' is the File
            formData.append(`images[]`, file);
            formData.append(`imageCaptions[${item.id}]`, data.imageCaptions[item.id]); // Append image caption using the custom ID
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
                            {/* FileUpload for photo with validation */}
                            {/* Image Upload*/}
                            <div className="p-field m-4">
                                <FileUpload ref={fileUploadRef} name="images" accept="image/*" customUpload={true} onSelect={onImageSelect} uploadHandler={onImageUpload} multiple emptyTemplate={<p className="m-0">Drag and drop images here to upload , maximum is 5.</p>} />
                                <div className="flex flex-wrap">
                                    {uploadedImages.map((image, index) => {
                                        console.log("image being displayedd : ", image);
                                        return (
                                            <div key={index} className="p-2" style={{ display: "flex", flexDirection: "row", gap: "0.5rem", alignItems: "center", justifyContent: "center" }}>
                                                <Image
                                                    // src={URL.createObjectURL(image)}

                                                    // src={image instanceof File ? URL.createObjectURL(image) : `${process.env.REACT_APP_API_BASE_URL}${image}`}
                                                    // src={image.file instanceof File ? URL.createObjectURL(image.file) : `${process.env.REACT_APP_API_BASE_URL}/${image}`}
                                                    // src={URL.createObjectURL(image?.file)}
                                                    src={image.objectURL ? image.objectURL : `${process.env.REACT_APP_API_BASE_URL}/${image}`}
                                                    alt={`Image ${image.id}`}
                                                    preview
                                                    width="100"
                                                />

                                                <InputTextarea
                                                    value={imageCaptions[image.id] || ""}
                                                    onChange={(e) => {
                                                        setImageCaptions({ ...imageCaptions, [image.id]: e.target.value });
                                                        // Optionally reset caption error
                                                        if (errors[`caption_${image.id}`]) {
                                                            setErrors({ ...errors, [`caption_${image.id}`]: null });
                                                        }
                                                    }}
                                                    rows={3}
                                                    cols={30}
                                                    placeholder="Add a caption..."
                                                    className={inputClassName(`caption_${image.id}`)}
                                                />
                                                {errors[`caption_${image.id}`] && <small className="p-error">{errors[`caption_${image.id}`]}</small>}
                                                <Button
                                                    icon="pi pi-trash"
                                                    className="p-button-rounded p-button-danger p-button-outlined"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeImage(image.id);
                                                    }}
                                                    aria-label="Delete"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                {uploadedImages.length > 0 && <Button label="Remove All Photos" icon="pi pi-times" onClick={removeAllImages} className="p-button-text p-button-danger" />}
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

export default CarPhotosRowForm;
