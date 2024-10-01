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
import { getAllCarTypes, getCarTypeById, postCarType, updateCarType, deleteCarTypeById } from "../../../../services/cars/car-types-service";

function RowForm({ handleSubmit, initialData = { name: "", description: "" }, ...props }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const queryClient = useQueryClient();

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Name is required";
        if (!values.car_type_id) errors.car_type_id = "Car Type is required";
        if (!values.currency) errors.currency = "Currency is required";
        if (!values.billing_cycle) errors.billing_cycle = "Billing cycle is required";
        if (!values.status) errors.status = "Status is required";
        if (!values.fee_amount) errors.fee_amount = "Fee amount is required";

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

    // ========================  For Car Types ======================
    const [selectedCarType, setSelectedCarType] = useState(initialData?.car_type);
    const [filteredCarType, setFilteredCarType] = useState();

    const getListOfCarTypes = useQuery(["carTypes"], getAllCarTypes, {
        onSuccess: (data) => {},
        onError: (error) => {
            // Handle errors
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

                            <Field name="currency">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="currency">Currency</label>
                                        <InputText {...input} id="currency" />
                                        {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="billing_cycle">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="billing_cycle">Billing Cycle</label>
                                        <Dropdown
                                            {...input}
                                            id="billing_cycle"
                                            options={[
                                                { label: "Daily", value: "Daily" },
                                                { label: "Weekly", value: "Weekly" },
                                                { label: "Monthly", value: "monthly" },
                                                { label: "Yearly", value: "yearly" },
                                            ]}
                                            onChange={(e) => input.onChange(e.value)}
                                        />
                                        {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
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

                            <Field name="fee_amount">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="fee_amount">fee</label>
                                        <InputText {...input} id="fee_amount" type="text" />
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
