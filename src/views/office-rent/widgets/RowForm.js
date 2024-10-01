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

//
import { Calendar } from "primereact/calendar";
import moment from "moment";

//
import { ProgressSpinner } from "primereact/progressspinner";
import { getAllVendors, getVendorById, postVendor, updateVendor, deleteVendorById } from "../../../services/vendors/vendors-service.js";
import { getAllOfficeFees, getOfficeFeeById, postOfficeFees, updateOfficeFees, deleteOfficeFeeById } from "../../../services/office/office-fee-service.js";

function RowForm({ handleSubmit, selectedParentItem, initialData = { name: "", details: "", photoUrl: "" }, ...props }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const queryClient = useQueryClient();

    const [photoError, setPhotoError] = useState(null);
    const [photoTouched, setPhotoTouched] = useState(false);

    const validate = (values) => {
        const errors = {};

        if (!values.vendor_id) errors.vendor_id = "Vendor is required";

        if (!values.office_id) errors.office_id = "office is required";
        if (!values.details) errors.details = "Details are required";

        if (!values.start_date) errors.start_date = "Start date is required";
        if (values.start_date && values.end_date) {
            const startDate = new Date(values.start_date);
            const endDate = new Date(values.end_date);
            if (endDate <= startDate) {
                errors.end_date = "End date must be after the start date.";
            }
        }

        // Additional validation could be performed here, e.g., format checking

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
            // const service_fee = typeof data?.service_fee === "string" ? parseFloat(data.service_fee.replace(/,/g, "")) : data?.service_fee;
            const formData = { ...data };
            setPendingData(formData);
            setShowConfirmDialog(true);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });

            toast.warning("Please fill in all required fields");
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

    //
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

    if (selectedParentItem) {
        initialData = { ...initialData, vendor_id: selectedParentItem?.id };
    }

    //==================== Offices ============
    const [selectedOffice, setSelectedOffice] = useState(initialData?.office);
    const [filteredOffice, setFilteredOffice] = useState();

    const getListOfOffices = useQuery(["offices"], () => getAllOfficeFees(), {
        onSuccess: (data) => {},
        onError: (error) => {
            console.log("Error fetching Offices : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occurred Please Contact Admin");
        },
    });

    if (selectedParentItem) {
        initialData = { ...initialData, office_id: selectedParentItem?.id };
    }
    // Function to calculate the period between two dates
    // const calculatePeriod = (startDate, endDate) => {
    //     if (startDate && endDate) {
    //         const start = moment(startDate);
    //         const end = moment(endDate);
    //         const duration = moment.duration(end.diff(start));
    //         const days = duration.asDays();
    //         return `${days.toFixed(0)} day(s)`; // or return duration for more detailed calculations
    //     }
    //     return "N/A"; // Or any default text when dates are not set
    // };

    // function calculatePeriod(startDate, endDate) {
    //     if (startDate && endDate) {
    //         const start = moment(startDate);
    //         const end = moment(endDate);
    //         const duration = moment.duration(end.diff(start));
    //         return duration.humanize();
    //     }
    //     return "N/A";
    // }

    function calculatePeriod(startDate, endDate) {
        if (startDate && endDate) {
            const start = moment(startDate);
            const end = moment(endDate);

            // Calculate total years between dates
            const totalYears = end.diff(start, "years");
            start.add(totalYears, "years"); // Move the start date forward by the total years

            // Calculate remaining months after accounting for years
            const remainingMonths = end.diff(start, "months");
            start.add(remainingMonths, "months"); // Move the start date forward by the remaining months

            // Calculate remaining days after accounting for years and months
            const remainingDays = end.diff(start, "days");

            let result = "";
            if (totalYears > 0) {
                result += `${totalYears} year${totalYears > 1 ? "s" : ""} `;
            }
            if (remainingMonths > 0) {
                result += `${remainingMonths} month${remainingMonths > 1 ? "s" : ""} `;
            }
            if (remainingDays > 0) {
                result += `${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
            }

            return result || "0 days";
        }
        return "N/A";
    }

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
                            <Field name="office_id">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="office_id">Office</label>
                                        <AutoComplete
                                            value={selectedOffice?.name || ""}
                                            suggestions={filteredOffice}
                                            disabled={getListOfOffices.isLoading}
                                            completeMethod={(e) => {
                                                const results = getListOfOffices.data?.data?.filter((item) => {
                                                    return item.name.toLowerCase().includes(e.query.toLowerCase());
                                                });
                                                setFilteredOffice(results);
                                            }}
                                            field="name"
                                            dropdown={true}
                                            onChange={(e) => {
                                                if (typeof e.value === "string") {
                                                    // Update the display value to the typed string and reset the selected item
                                                    setSelectedOffice({ name: e.value });
                                                    input.onChange("");
                                                } else if (typeof e.value === "object" && e.value !== null) {
                                                    // Update the selected item and set the form state with the selected item's ID
                                                    setSelectedOffice(e.value);
                                                    input.onChange(e.value.id);
                                                }
                                            }}
                                            id="office_id"
                                            selectedItemTemplate={(value) => <div>{value ? value.name : "Select an Office"}</div>}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        {getListOfOffices.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
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
                                            selectedItemTemplate={(value) => <div>{value ? value.value : "Select a Vendor"}</div>}
                                        />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        {getListOfVendors.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
                                    </div>
                                )}
                            </Field>

                            <Field name="start_date">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="start_date">Start Date</label>
                                        <Calendar
                                            {...input}
                                            touchUI
                                            hideOnDateTimeSelect={true}
                                            value={input.value ? new Date(input.value) : null} // Set the Calendar value
                                            showIcon
                                            showTime
                                            dateFormat="dd-mm-yy"
                                            hourFormat="24"
                                            className={classNames({ "p-invalid": meta.touched && meta.error })}
                                            onSelect={(e) => {
                                                // Format the date when selected and update the input value
                                                const formattedDate = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
                                                input.onChange(formattedDate);
                                            }}
                                            onChange={(e) => {
                                                // Update the input field only if the value is a valid date
                                                if (e.value instanceof Date) {
                                                    const formattedDate = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
                                                    input.onChange(formattedDate);
                                                }
                                            }}
                                        />
                                        {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>
                            <Field name="end_date">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label>End Date</label>
                                        <Calendar
                                            {...input}
                                            value={input.value ? new Date(input.value) : null}
                                            touchUI
                                            hideOnDateTimeSelect={true}
                                            showIcon
                                            showTime
                                            className={classNames({ "p-invalid": meta.touched && meta.error })}
                                            dateFormat="dd-mm-yy"
                                            hourFormat="24"
                                            onChange={(e) => {
                                                // Update the input field only if the value is a valid date
                                                if (e.value instanceof Date) {
                                                    const formattedDate = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
                                                    input.onChange(formattedDate);
                                                }
                                            }}
                                            onSelect={(e) => {
                                                // Format the date when selected and update the input value
                                                const formattedDate = moment(e.value).format("YYYY-MM-DD HH:mm:ss");
                                                input.onChange(formattedDate);
                                            }}
                                        />
                                        {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            {/* Display the calculated period */}
                            {/* <div className="p-field m-4">
                                <label>Duration</label>
                                <InputText
                                    value={calculatePeriod(values.start_date, values.end_date)}
                                    disabled={true} // Make the field read-only
                                />
                            </div> */}

                            <Field name="details">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="details">details</label>
                                        <InputTextarea {...input} rows={5} cols={30} id="details" className={classNames({ "p-invalid": meta.touched && meta.error })} />
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
