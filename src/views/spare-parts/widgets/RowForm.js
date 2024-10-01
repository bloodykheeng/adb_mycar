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

import { getAllVendors, getVendorById, postVendor, updateVendor, deleteVendorById } from "../../../services/vendors/vendors-service.js";
import { getAllSparePartTypeTypes, getSparePartTypeById, postSparePartType, updateSparePartType, deleteSparePartTypeById } from "../../../services/spare-parts/spare-parts--types-service.js";

function RowForm({ handleSubmit, initialData, ...props }) {
    console.log("spare part initial data : ", initialData);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const queryClient = useQueryClient();

    const [photoError, setPhotoError] = useState(null);
    const [photoTouched, setPhotoTouched] = useState(false);

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Name is required";
        if (!values.price) errors.price = "Price is required";
        if (!values.description) errors.description = "Description is required";
        if (!values.vendor_id) errors.vendor_id = "Vendor is required";
        if (!values.approval_status) errors.approval_status = "Status is required";
        if (!values.identifier) errors.identifier = "Identifier is required";
        if (!values.quantity) errors.quantity = "Quantity is required";
        // Ensure the quantity is a positive integer
        if (values.quantity && (isNaN(values.quantity) || Number(values.quantity) <= 0 || !Number.isInteger(Number(values.quantity)))) {
            errors.quantity = "Quantity must be a positive integer";
        }

        // Assuming you handle the photo as part of the form submission and require it
        // if (!values.photo) errors.photo = "Photo is required";

        return errors;
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

    //================= spare part type  =======================

    // Assume initialData is available in your component scope
    const [selectedSparePartType, setSelectedSparePartType] = useState(initialData?.spare_part_type);
    const [filteredSparePartType, setFilteredSparePartType] = useState();

    const getListOfSparePartTypes = useQuery(["sparePartTypes"], () => getAllSparePartTypeTypes(), {
        onSuccess: (data) => {
            // Handle the success state if needed
        },
        onError: (error) => {
            console.log("Error fetching Years : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

    if (initialData) {
        initialData.spare_part_type_id = initialData?.spare_part_type?.id;
    }
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
        if (!uploadedFile && !initialData) {
            setPhotoError("A photo is required");
        }

        if (Object.keys(errors).length === 0 && !photoError) {
            const formData = { ...data, photo: uploadedFile };
            setPendingData(formData);
            setShowConfirmDialog(true);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });
            setPhotoTouched(true); // Make sure to mark the photo as touched to show the error
            toast.warning("Please fill in all required fields.");
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

                            <Field name="identifier">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="identifier">Identifier</label>
                                        <InputText {...input} id="identifier" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="spare_part_type_id">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="spare_part_type_id">Spare Part Type</label>
                                        <AutoComplete
                                            value={selectedSparePartType?.name || ""}
                                            suggestions={filteredSparePartType}
                                            disabled={getListOfSparePartTypes.isLoading}
                                            completeMethod={(e) => {
                                                const results = getListOfSparePartTypes.data?.data?.filter((item) => {
                                                    return item.name.toLowerCase().includes(e.query.toLowerCase());
                                                });
                                                setFilteredSparePartType(results);
                                            }}
                                            field="name"
                                            dropdown={true}
                                            onChange={(e) => {
                                                if (typeof e.value === "string") {
                                                    setSelectedSparePartType({ name: e.value });
                                                    input.onChange("");
                                                } else if (typeof e.value === "object" && e.value !== null) {
                                                    setSelectedSparePartType(e.value);
                                                    input.onChange(e.value.id);
                                                    // Handle any related field updates if necessary
                                                }
                                            }}
                                            id="spare_part_type_id"
                                            selectedItemTemplate={(value) => <div>{value ? value.name : "Select a Spare Part Type"}</div>}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        {getListOfSparePartTypes.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                    </div>
                                )}
                            </Field>

                            <Field name="price">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="price">Price</label>
                                        <InputText {...input} id="price" type="number" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="quantity">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="quantity">Quantity</label>
                                        <InputText {...input} id="quantity" type="number" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

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

                            <Field name="approval_status">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="approval_status">Approval Status</label>
                                        <Dropdown
                                            {...input}
                                            id="approval_status"
                                            options={[
                                                { label: "Pending", value: "pending" },
                                                { label: "Approved", value: "approved" },
                                                { label: "Rejected", value: "rejected" },
                                            ]}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="description">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="description">Description</label>
                                        <InputTextarea {...input} rows={5} cols={30} id="description" className={classNames({ "p-invalid": meta.touched && meta.error })} />
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
