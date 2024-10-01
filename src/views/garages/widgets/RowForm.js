import React, { useState } from "react";
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
import { AutoComplete } from "primereact/autocomplete";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DeleteIcon from "@mui/icons-material/Delete";
import { FileUpload } from "primereact/fileupload";

import { ProgressSpinner } from "primereact/progressspinner";
import { Checkbox } from "primereact/checkbox";

import { getAllVendors, getVendorById, postVendor, updateVendor, deleteVendorById } from "../../../services/vendors/vendors-service.js";

function RowForm({ handleSubmit, initialData = { name: "", description: "", photoUrl: "" }, ...props }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const queryClient = useQueryClient();

    const [photoError, setPhotoError] = useState(null);
    const [photoTouched, setPhotoTouched] = useState(false);

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Name is required";

        if (!values.name) errors.name = "Name is required";
        if (!values.address) errors.address = "Address is required";
        // if (!values.availability) errors.availability = "Availability is required";
        if (!values.opening_hours) errors.opening_hours = "Opening hours are required";

        return errors;
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
    const onSubmitForm = (data, form) => {
        const errors = validate(data);
        // Check if photo is uploaded
        if (!uploadedFile) {
            setPhotoError("A photo is required");
        }

        if (Object.keys(errors).length === 0 && !photoError && uploadedFile) {
            const formData = { ...data, photo: uploadedFile };
            setPendingData(formData);
            setShowConfirmDialog(true);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });
            setPhotoTouched(true); // Make sure to mark the photo as touched to show the error
            toast.warning("Please fill in all required fields and upload a photo.");
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
    const onFileUpload = (e) => {
        // Clear previous errors
        setPhotoError(null);
        setPhotoTouched(true); // Indicate that the user has interacted with the file input

        const file = e.files && e.files.length > 0 ? e.files[0] : null;
        if (file) {
            if (file.size > 2097152) {
                // Check file size
                setPhotoError("File size should be less than 2MB");
                setUploadedFile(null); // Clear the uploaded file on error
            } else {
                setUploadedFile(file); // Update the state with the new file
            }
        } else {
            setPhotoError("A photo is required");
            setUploadedFile(null); // Clear the uploaded file if no file is selected
        }
    };

    return (
        <div className="col-12 md:col-12">
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

                            <Field name="address">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="address">Address</label>
                                        <InputText {...input} id="address" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>
                            {/*
                            <Field name="availability">
                                {({ input, meta }) => (
                                    <div className="p-field-checkbox m-4">
                                        <Checkbox type="checkbox" inputId="availability" checked={input.value === true || input.value === "true"} onChange={(e) => input.onChange(e.checked)} />
                                        <label htmlFor="availability">Availability</label>
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field> */}

                            <Field name="availability">
                                {({ input, meta }) => (
                                    <div className="p-field-checkbox m-4">
                                        <input type="checkbox" id="availability" {...input} checked={input.value === true || input.value === "true"} onChange={(e) => input.onChange(e.target.checked)} style={{ cursor: "pointer", marginRight: "1rem" }} />
                                        <label htmlFor="availability">Availability</label>
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="opening_hours">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="opening_hours">Opening Hours</label>
                                        <InputText {...input} id="opening_hours" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="special_features">
                                {({ input }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="special_features">Special Features</label>
                                        <InputTextarea {...input} rows={5} cols={30} id="special_features" />
                                        {/* Since 'special_features' is nullable, we won't render a validation error */}
                                    </div>
                                )}
                            </Field>

                            {/* FileUpload for photo with validation */}
                            <div className="p-field m-4">
                                <label htmlFor="photo">Photo</label>
                                <FileUpload name="photo" customUpload uploadHandler={onFileUpload} accept="image/*" maxFileSize={2097152} />
                                {photoTouched && photoError && <small className="p-error">{photoError}</small>}
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
