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

function RowForm({ handleSubmit, initialData, ...props }) {
    console.log("🚀 ~ RowForm ~ initialData:", initialData);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const queryClient = useQueryClient();

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Name is required";
        if (!values.make) errors.make = "Make is required";
        if (!values.model) errors.model = "Model is required";
        if (!values.year) errors.year = "Year is required";
        if (!!values.mileage === false) errors.mileage = "Mileage is required";
        if (!values.number_plate) errors.number_plate = "Number Plate is required";
        if (!values.price) errors.price = "Price is required";
        if (!values.color) errors.color = "Color is required";
        // if (!values.quantity) errors.quantity = "Quantity is required";
        if (!values.description) errors.description = "Description is required";
        if (!values.vendor_id) errors.vendor_id = "Vendor is required";
        if (!values.car_brand_id) errors.car_brand_id = "Car Brand is required";
        if (!values.car_type_id) errors.car_type_id = "Car Type is required";
        if (!values.visibility) errors.visibility = "visibility is required";
        if (!values.condition) errors.condition = "condition is required";
        if (!values.status) errors.status = "Status is required";

        if (!values.fuel_type) errors.fuel_type = "Fuel type is required";
        if (!values.drive_type) errors.drive_type = "Drive type is required";
        if (!values.engine_type) errors.engine_type = "Engine type is required";
        if (!values.vin) errors.vin = "VIN is required";
        if (!values.identifier) errors.identifier = "Identifier is required";

        // Additional validation can be added as needed
        // For example, validating the year to be a four-digit number
        if (values.year && !/^\d{4}$/.test(values.year)) {
            errors.year = "Year must be a 4-digit number";
        }

        // Ensure the price is a positive number
        if ((values.price && isNaN(values.price)) || Number(values.price) <= 0) {
            errors.price = "Price must be a positive number";
        }

        // Ensure the quantity is a positive integer
        if (values.quantity && (isNaN(values.quantity) || Number(values.quantity) <= 0 || !Number.isInteger(Number(values.quantity)))) {
            errors.quantity = "Quantity must be a positive integer";
        }

        return errors;
    };

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
        const errors = validate(data);

        const validateImagesFormErrors = validateImagesForm();
        const captionErrors = validateCaptions();
        const validateVideosFormErrors = validateVideosForm();
        const allErrors = { ...errors, ...validateImagesFormErrors, ...captionErrors };
        if (Object.keys(allErrors).length === 0) {
            // Check for media upload
            if (uploadedImages.length === 0 && uploadedVideos.length === 0) {
                primereacttoast.current.show({ severity: "warn", summary: "Media Required", detail: "At least one photo or video is required to submit.", life: 3000 });
                return;
            }

            const imagesWithCaptions = uploadedImages.map((image) => ({
                imageName: image.name,
                caption: imageCaptions[image.id] || "",
            }));

            const videosWithCaptions = uploadedVideos.map((video) => ({
                videoName: video.name,
                caption: videoCaptions[video.id] || "",
            }));

            const formData = { ...data, uploadedImages, imageCaptions, uploadedVideos, videoCaptions };
            setPendingData(formData);
            setShowConfirmDialog(true);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });

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

    //==================== Vendors ============
    const [selectedVendor, setSelectedVendor] = useState(initialData?.vendor);
    const [filteredVendor, setFilteredVendor] = useState();

    const getListOfVendors = useQuery(["vendors"], () => getAllVendors(), {
        onSuccess: (data) => {},
        onError: (error) => {
            console.log("Error fetching Years : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

    // ====================  For Car Brands =====================
    const [selectedCarBrand, setSelectedCarBrand] = useState(initialData?.brand);
    const [filteredCarBrand, setFilteredCarBrand] = useState();

    const getListOfCarBrands = useQuery(["carBrands"], getAllCarBrands, {
        onSuccess: (data) => {},
        onError: (error) => {
            // Handle errors
        },
    });

    // ========================  For Car Types ======================
    const [selectedCarType, setSelectedCarType] = useState(initialData?.type);
    const [filteredCarType, setFilteredCarType] = useState();

    const getListOfCarTypes = useQuery(["carTypes"], getAllCarTypes, {
        onSuccess: (data) => {},
        onError: (error) => {
            // Handle errors
        },
    });

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

    //===================== new dropdowns ======================================
    const fuelTypes = [
        { label: "Gasoline", value: "Gasoline" },
        { label: "Diesel", value: "Diesel" },
        { label: "Electric", value: "Electric" },
        { label: "Hybrid", value: "Hybrid" },
    ];

    const driveTypes = [
        { label: "FWD", value: "FWD" },
        { label: "RWD", value: "RWD" },
        { label: "AWD", value: "AWD" },
    ];

    const engineTypes = [
        { label: "V6", value: "V6" },
        { label: "Electric", value: "Electric" },
        // Add more engine types if necessary
    ];

    //==========================================================================

    return (
        <div className="col-12 md:col-12">
            <PrimeReactToast ref={primereacttoast} />
            <div className="card p-fluid">
                <Form
                    onSubmit={onSubmitForm}
                    initialValues={initialData}
                    mutators={{ setFieldTouched }}
                    validate={validate}
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
                            <Field name="name">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="name">Name</label>
                                        <InputText {...input} id="name" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>
                            <Field name="identifier">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="identifier">Identifier</label>
                                        <InputText {...input} id="identifier" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="make">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="make">Make</label>
                                        <InputText {...input} id="make" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="model">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="model">Model</label>
                                        <InputText {...input} id="model" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="year">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="year">Year</label>
                                        <InputText {...input} id="year" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="mileage">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="mileage">Mileage</label>
                                        <InputText {...input} id="mileage" type="number" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="number_plate">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="number_plate">Number Plate</label>
                                        <InputText {...input} id="number_plate" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="price">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="price">Price</label>
                                        <InputText {...input} id="price" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="color">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="color">Color</label>
                                        <InputText {...input} id="color" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* <Field name="quantity">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="quantity">Quantity</label>
                                        <InputText {...input} id="quantity" type="number" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field> */}

                            <Field name="condition">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="condition">condition</label>
                                        <Dropdown
                                            {...input}
                                            id="condition"
                                            options={[
                                                { label: "New", value: "new" },
                                                { label: "Old", value: "old" },
                                            ]}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="visibility">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="visibility">Visibility</label>
                                        <Dropdown
                                            {...input}
                                            id="visibility"
                                            options={[
                                                { label: "Private", value: "private" },
                                                { label: "Public", value: "public" },
                                                { label: "featured", value: "featured" },
                                            ]}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="status">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="status">Status</label>
                                        <Dropdown
                                            {...input}
                                            id="status"
                                            options={[
                                                { label: "Sale", value: "sale" },
                                                { label: "Auction", value: "auction" },
                                            ]}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="vendor_id">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="vendor_id">Vendor</label>
                                        <AutoComplete
                                            value={selectedVendor?.name || ""}
                                            suggestions={filteredVendor}
                                            disabled={getListOfVendors.isLoading}
                                            completeMethod={(e) => {
                                                const results = getListOfVendors.data?.data?.filter((item) => {
                                                    return item.name.toLowerCase().includes(e.query.toLowerCase());
                                                });
                                                setFilteredVendor(results);
                                            }}
                                            field="name"
                                            dropdown={true}
                                            onChange={(e) => {
                                                if (typeof e.value === "string") {
                                                    // Update the display value to the typed string and reset the selected item
                                                    setSelectedVendor({ name: e.value });
                                                    input.onChange("");
                                                } else if (typeof e.value === "object" && e.value !== null) {
                                                    // Update the selected item and set the form state with the selected items's ID
                                                    setSelectedVendor(e.value);
                                                    input.onChange(e.value.id);
                                                    // Clear the values of the children
                                                    // setSelectedFinancialYear(null);
                                                    // form.change("utility_id", undefined);
                                                }
                                            }}
                                            id="vendor_id"
                                            selectedItemTemplate={(value) => <div>{value ? value.value : "Select a Department"}</div>}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        {getListOfVendors.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                    </div>
                                )}
                            </Field>

                            <Field name="car_brand_id">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="car_brand_id">Car Brand</label>
                                        <AutoComplete
                                            value={selectedCarBrand?.name || ""}
                                            suggestions={filteredCarBrand}
                                            disabled={getListOfCarBrands.isLoading}
                                            completeMethod={(e) => {
                                                const results = getListOfCarBrands.data?.data?.filter((item) => {
                                                    return item.name.toLowerCase().includes(e.query.toLowerCase());
                                                });
                                                setFilteredCarBrand(results);
                                            }}
                                            field="name"
                                            dropdown={true}
                                            onChange={(e) => {
                                                if (typeof e.value === "string") {
                                                    setSelectedCarBrand({ name: e.value });
                                                    input.onChange("");
                                                } else if (typeof e.value === "object" && e.value !== null) {
                                                    setSelectedCarBrand(e.value);
                                                    input.onChange(e.value.id);
                                                }
                                            }}
                                            id="car_brand_id"
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="car_type_id">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="car_type_id">Car Type</label>
                                        <AutoComplete
                                            value={selectedCarType?.name || ""}
                                            suggestions={filteredCarType}
                                            disabled={getListOfCarTypes.isLoading}
                                            completeMethod={(e) => {
                                                const results = getListOfCarTypes?.data?.data?.filter((item) => {
                                                    return item.name.toLowerCase().includes(e.query.toLowerCase());
                                                });
                                                setFilteredCarType(results);
                                            }}
                                            field="name"
                                            dropdown={true}
                                            onChange={(e) => {
                                                if (typeof e.value === "string") {
                                                    setSelectedCarType({ name: e.value });
                                                    input.onChange("");
                                                } else if (typeof e.value === "object" && e.value !== null) {
                                                    setSelectedCarType(e.value);
                                                    input.onChange(e.value.id);
                                                }
                                            }}
                                            id="car_type_id"
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* ====================================== New Fields ========================================*/}

                            <Field name="fuel_type">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="fuel_type">Fuel Type</label>
                                        <Dropdown {...input} id="fuel_type" options={fuelTypes} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="drive_type">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="drive_type">Drive Type</label>
                                        <Dropdown {...input} id="drive_type" options={driveTypes} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="engine_type">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="engine_type">Engine Type</label>
                                        <Dropdown {...input} id="engine_type" options={engineTypes} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="vin">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="vin">VIN</label>
                                        <InputText {...input} id="vin" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* ====================================== New Fields end ========================================*/}

                            <Field name="description">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="description">Description</label>
                                        <InputTextarea {...input} rows={5} cols={30} id="description" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

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

export default RowForm;
