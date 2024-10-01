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

import { Toast as PrimeReactToast } from "primereact/toast";

//
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";

import { DisabledByDefaultIcon } from "@mui/icons-material/DisabledByDefault";

import { getAllUsers, getUserById, getApproverRoles, createUser, updateUser, deleteUserById, getAssignableRoles } from "../../../services/auth/user-service";
//
import { getAllCars, postInspector, getAllCarInspectors, getCarById, postCar, updateCar, deleteCarById } from "../../../services/cars/car-service";

function InspectorRowForm({ initialData }) {
    const primereacttoast = useRef(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    //
    const [selectedInspector, setSelectedInspector] = useState(initialData?.inspector);
    const [filteredInspectors, setFilteredInspectors] = useState([]);

    const getListOfInspectors = useQuery(["inspectors"], () => getAllUsers({ role: "Inspector" }), {
        onSuccess: (data) => {
            // Optional: Handle any actions on successful fetch
        },
        onError: (error) => {
            console.error("Error fetching inspectors: ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

    // Define validation functions
    const validate = (data) => {
        const errors = {};
        if (!data.inspector_id) errors.inspector_id = "Inspector selection is required";
        return errors;
    };

    // Handle form submission with validation
    const onSubmitForm = (data, form) => {
        const errors = validate(data);
        if (Object.keys(errors).length === 0) {
            setPendingData(data);
            setShowConfirmDialog(true);
        } else {
            // Show validation errors
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });
            primereacttoast.current.show({ severity: "error", summary: "Validation Error", detail: "Please correct the errors before submitting.", life: 3000 });
        }
    };

    // Finalize submission after confirmation
    const onConfirm = () => {
        if (pendingData) {
            // Assume handleSubmit is your final submission logic
            handleSubmit(pendingData);
            setPendingData(null);
        }
        setShowConfirmDialog(false);
    };

    // Handle cancellation of submission
    const onCancel = () => {
        setShowConfirmDialog(false);
    };

    const queryClient = useQueryClient();

    const creactMutation = useMutation(postInspector, {
        onSuccess: () => {
            queryClient.invalidateQueries(["cars"]);
            toast.success("Inspector attached Successfully");
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            console.log("create Cars error : ", error);
        },
    });

    const handleSubmit = async (data) => {
        // event.preventDefault();
        console.log("data we are submitting : ", data);
        creactMutation.mutate({ car_id: initialData?.id, ...data });
    };

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
                            {" "}
                            <Field name="inspector_id">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="inspector_id">Inspector</label>
                                        <AutoComplete
                                            value={selectedInspector?.name || ""}
                                            suggestions={filteredInspectors}
                                            disabled={getListOfInspectors.isLoading}
                                            completeMethod={(e) => {
                                                const results = getListOfInspectors.data?.data?.filter((item) => {
                                                    return item.name.toLowerCase().includes(e.query.toLowerCase());
                                                });
                                                setFilteredInspectors(results);
                                            }}
                                            field="name"
                                            dropdown={true}
                                            onChange={(e) => {
                                                if (typeof e.value === "string") {
                                                    // Update the display value to the typed string and reset the selected item
                                                    setSelectedInspector({ name: e.value });
                                                    input.onChange("");
                                                } else if (typeof e.value === "object" && e.value !== null) {
                                                    // Update the selected item and set the form state with the selected item's ID
                                                    setSelectedInspector(e.value);
                                                    input.onChange(e.value.id);
                                                }
                                            }}
                                            id="inspector_id"
                                            selectedItemTemplate={(value) => <div>{value ? value.name : "Select an Inspector"}</div>}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        {getListOfInspectors.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                    </div>
                                )}
                            </Field>
                            <div className="d-grid gap-2">
                                <Button type="submit" label="Save" className="p-button-primary" icon="pi pi-check" />
                            </div>
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
                            <Dialog
                                visible={showConfirmDialog}
                                onHide={onCancel}
                                footer={
                                    <div>
                                        <Button label="Yes" onClick={onConfirm} />
                                        <Button label="No" onClick={onCancel} />
                                    </div>
                                }
                            >
                                <p>Are you sure you want to submit these details?</p>
                            </Dialog>
                        </form>
                    )}
                />
            </div>
        </div>
    );
}

export default InspectorRowForm;
