import React, { useState, useEffect } from "react";

import { TabView, TabPanel } from "primereact/tabview";
import { Panel } from "primereact/panel";
import { InputTextarea } from "primereact/inputtextarea";
import { Field, Form } from "react-final-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { getAllInspectionFieldCategorized } from "../../../services/inspection/inspection-fields-categories-service.js";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { getAllCarInspectionReports, getCarInspectionReportById, postCarInspectionReports, updateCarInspectionReports, deleteCarInspectionReportById } from "../../../services/inspection/car-inspection-reports-service.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProgressBar } from "primereact/progressbar";
import { useLocation } from "react-router-dom";
import BreadcrumbNav from "../../../components/general_components/BreadcrumbNav";

const InspectionReportingPage = () => {
    const [categories, setCategories] = useState();
    const [activeIndex, setActiveIndex] = useState(0);
    const queryClient = useQueryClient();

    let { state } = useLocation();
    let selectedCarData = state?.selectedCarData;

    // State for form values
    const [name, setName] = useState(selectedCarData?.name);
    const [details, setDetails] = useState("");
    // State for error messages
    const [errors, setErrors] = useState({});

    //
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const { data, isLoading, isError, error } = useQuery(["inspection-field-categories"], getAllInspectionFieldCategorized, {
        onSuccess: (data) => {
            console.log("data fetched is : ", data);
            if (Array.isArray(data?.data) && data?.data?.length < 1 && !categories) {
                toast.warning("No fields defined yet please contact admin");
            }
            if (!categories) {
                let categoriesWithValue = data?.data?.map((category) => {
                    return {
                        ...category,
                        inspection_fields: category?.inspection_fields.map((field) => ({
                            ...field,
                            value: "",
                        })),
                    };
                });
                setCategories(categoriesWithValue);
            }
        },
    });

    const onSubmit = (values) => {
        console.log("Submitted values:", values);
        // Implement form submission logic here
    };

    const validate = (values) => {
        const errors = {};
        // Add validation logic here for name, description, etc.
        return errors;
    };

    // if (isLoading) return <div>Loading...</div>;
    // if (isError) return <div>Error: {error.message}</div>;

    const handleInputChange = (categoryId, fieldId, newValue) => {
        setCategories((currentCategories) =>
            currentCategories.map((category) =>
                category.id === categoryId
                    ? {
                          ...category,
                          inspection_fields: category.inspection_fields.map((field) =>
                              field.id === fieldId
                                  ? {
                                        ...field,
                                        value: newValue, // Assume you're updating the 'description' property
                                    }
                                  : field
                          ),
                      }
                    : category
            )
        );
    };

    // Handle change for the name field
    const handleNameChange = (e) => {
        setName(e.target.value);
        // Optionally reset errors for this field
        if (errors.name) {
            setErrors({ ...errors, name: null });
        }
    };

    // Handle change for the details field
    const handleDetailsChange = (e) => {
        setDetails(e.target.value);
        // Optionally reset errors for this field
        if (errors.details) {
            setErrors({ ...errors, details: null });
        }
    };

    const validateForm = () => {
        const validationErrors = {};

        // Validate top-level fields
        if (!name.trim()) {
            validationErrors.name = "Title is required";
        }
        if (!details.trim()) {
            validationErrors.details = "Details are required";
        }

        // Validate fields within each category
        categories.forEach((category) => {
            category.inspection_fields.forEach((field) => {
                const fieldKey = `value_${category.id}_${field.id}`;
                if (!field.value.trim()) {
                    validationErrors[fieldKey] = "Value is required for " + field.name;
                }
            });
        });

        setErrors(validationErrors);
        return validationErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submit action

        const validationErrors = validateForm();
        console.log("Validation Errors: ", validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            // Show error messages
            toast.warning("You still have some invalid fields. Please rectify them."); // Replace with your toast/notification logic
            setErrors(validationErrors);
            return; // Stop the function if there are validation issues
        }

        const finalData = {
            name,
            car_id: selectedCarData?.id,
            details,
            categories,
        };

        console.log("Prepared Data for Submission: ", finalData);
        setPendingData(finalData);
        setShowConfirmDialog(true);
    };

    //======================= submit mutate ====================
    const storeReportDataMutation = useMutation(postCarInspectionReports, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["utility-reports"]);

            toast.success("Utility report created successfully");

            console.log("Create utility report success:", data);
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });
    const onConfirm = () => {
        console.log("Confirmed Data: ", pendingData);
        storeReportDataMutation.mutate(pendingData);
        setShowConfirmDialog(false);
        // setPendingData(null);
    };

    const onCancel = () => {
        console.log("Submission Cancelled");
        setPendingData(null);
        setShowConfirmDialog(false);
    };
    return (
        <div>
            <BreadcrumbNav />
            {isLoading && (
                <div className="m-2">
                    <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
                </div>
            )}
            <Card>
                <div style={{ padding: "0.5rem" }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
                                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem", width: "100%" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", width: "100%" }}>
                                        {/* Input for name */}
                                        <label htmlFor="name">Title</label>
                                        <InputText
                                            value={name}
                                            onChange={handleNameChange}
                                            placeholder="Name"
                                            className={classNames({
                                                "p-invalid": errors.name, // Add "p-error" class if there's an error
                                            })}
                                        />
                                        {errors.name && <small className="p-error">{errors.name}</small>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {categories?.map((category) => (
                            <div key={category.id}>
                                <h3>{category.name}</h3>
                                <DataTable value={category.inspection_fields}>
                                    <Column field="name" header="Field Name" />
                                    <Column
                                        field="value"
                                        header="Value"
                                        body={(rowData) => (
                                            <div className="p-field" style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                                <InputTextarea value={rowData.value} rows={1} onChange={(e) => handleInputChange(category.id, rowData.id, e.target.value)} />
                                                {/* <InputText
                                                    value={rowData.value}
                                                    onChange={(e) => handleInputChange(category.id, rowData.id, e.target.value)} // Note the addition of categoryId for proper identification
                                                    className={classNames({ "p-invalid": errors[`value_${category.id}_${rowData.id}`] })}
                                                    // tooltip={errors[`value_${category.id}_${rowData.id}`]}
                                                /> */}
                                                {errors[`value_${category.id}_${rowData.id}`] && <small className="p-error">{errors[`value_${category.id}_${rowData.id}`]}</small>}
                                            </div>
                                        )}
                                    />
                                </DataTable>
                            </div>
                        ))}

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem", width: "100%" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", width: "100%" }}>
                                    {/* Textarea for details */}
                                    <label htmlFor="details">Details</label>
                                    <InputTextarea
                                        value={details}
                                        onChange={handleDetailsChange}
                                        rows={5}
                                        placeholder="Details"
                                        className={classNames({
                                            "p-invalid": errors.details, // Add "p-error" class if there's an error
                                        })}
                                    />
                                    {errors.details && <small className="p-error">{errors.details}</small>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ width: "100%", display: "flex", gap: "1rem" }}>
                            <Button type="submit" onClick={() => {}} label="Submit" style={{ marginTop: "2rem" }} disabled={!data?.data || !Array.isArray(data?.data) || data?.data?.length < 1 || storeReportDataMutation?.isLoading} />
                        </div>

                        {storeReportDataMutation?.isLoading && (
                            <center>
                                {" "}
                                <div className="spinner-container">
                                    <ProgressSpinner
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderWidth: "50px", // Border thickness
                                            borderColor: "blue", // Border color
                                            animationDuration: "1s",
                                        }}
                                        strokeWidth="8"
                                        animationDuration="1s"
                                    />
                                </div>
                            </center>
                        )}
                    </form>
                </div>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog
                header="Confirmation"
                visible={showConfirmDialog}
                maximizable
                onHide={onCancel}
                footer={
                    <div>
                        <Button label="Yes" onClick={onConfirm} />
                        <Button label="No" onClick={onCancel} className="p-button-secondary" />
                    </div>
                }
            >
                Are you sure you want to submit this form?
            </Dialog>
        </div>
    );
};

export default InspectionReportingPage;
