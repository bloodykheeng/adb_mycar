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
import { getAllInspectionFieldCategories, getInspectionFieldCategorieById, postInspectionFieldCategories, updateInspectionFieldCategories, deleteInspectionFieldCategorieById } from "../../../../services/inspection/inspection-fields-categories-service.js";
import { ProgressSpinner } from "primereact/progressspinner";

function RowForm({ handleSubmit, initialData = { name: "", description: "", photoUrl: "" }, ...props }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const queryClient = useQueryClient();

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Name is required";
        if (!values.description) errors.description = "Description are required";
        if (!values.status) {
            errors.status = "Status is required";
        }

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

        if (Object.keys(errors).length === 0) {
            const formData = { ...data };
            setPendingData(formData);
            setShowConfirmDialog(true);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });

            toast.warning("Please fill in all required fields ");
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

    const [selectedCategory, setSelectedCategory] = useState(initialData?.category);
    const [filteredCategories, setFilteredCategories] = useState();

    const getListOfCategories = useQuery(["inspectionFieldCategories"], getAllInspectionFieldCategories, {
        onSuccess: (data) => {
            // Additional actions after successful data fetch can be handled here
        },
        onError: (error) => {
            console.log("Error fetching Inspection Field Categories: ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occurred Please Contact Admin");
        },
    });

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

                            <Field name="status">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="status">Status</label>
                                        <Dropdown
                                            {...input}
                                            options={[
                                                { id: "active", name: "Active" },
                                                { id: "deactive", name: "Deactive" },
                                            ].map((role) => ({ label: role.name, value: role.id }))}
                                            placeholder="Select a Status"
                                            className={classNames({ "p-invalid": meta.touched && meta.error })}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="car_inspection_field_categories_id">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="car_inspection_field_categories_id">Category</label>
                                        <AutoComplete
                                            value={selectedCategory?.name || ""}
                                            suggestions={filteredCategories}
                                            disabled={getListOfCategories.isLoading}
                                            completeMethod={(e) => {
                                                const results = getListOfCategories.data?.data?.filter((item) => {
                                                    return item.name.toLowerCase().includes(e.query.toLowerCase());
                                                });
                                                setFilteredCategories(results);
                                            }}
                                            field="name"
                                            dropdown={true}
                                            onChange={(e) => {
                                                if (typeof e.value === "string") {
                                                    // User is typing a new value directly
                                                    setSelectedCategory({ name: e.value });
                                                    input.onChange("");
                                                } else if (typeof e.value === "object" && e.value !== null) {
                                                    // User selected an item from the dropdown
                                                    setSelectedCategory(e.value);
                                                    input.onChange(e.value.id);
                                                }
                                            }}
                                            id="car_inspection_field_categories_id"
                                            selectedItemTemplate={(value) => <div>{value ? value.name : "Select a Category"}</div>}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        {getListOfCategories.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                    </div>
                                )}
                            </Field>

                            <Field name="field_type">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="field_type">Field Type</label>
                                        <Dropdown
                                            {...input}
                                            options={[
                                                { id: "text", name: "Text" },
                                                { id: "number", name: "Number" },
                                                { id: "boolean", name: "boolean" },
                                                { id: "date", name: "Date" },
                                            ].map((option) => ({ label: option.name, value: option.id }))}
                                            placeholder="Select a Field Type"
                                            className={classNames({ "p-invalid": meta.touched && meta.error })}
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
