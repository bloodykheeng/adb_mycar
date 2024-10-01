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

function CarDetailsRowForm({ initialData, ...props }) {
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

        const allErrors = { ...errors };
        if (Object.keys(allErrors).length === 0) {
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

    const editCarDetailsMutation = useMutation({
        mutationFn: (variables) => updateCar(initialData?.id, variables),
        onSuccess: () => {
            toast.success("Edited Successfully");
            queryClient.invalidateQueries(["cars"]);
        },
        onError: (error) => {
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

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

        formData.append("fuel_type", data.fuel_type);
        formData.append("drive_type", data.drive_type);
        formData.append("engine_type", data.engine_type);
        formData.append("vin", data.vin);
        formData.append("identifier", data.identifier);

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

        editCarDetailsMutation.mutate(formData);
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

                            <div className="d-grid gap-2">
                                <Button type="submit" label="Save" className="p-button-primary" icon="pi pi-check" />
                            </div>

                            {editCarDetailsMutation.isLoading && (
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

export default CarDetailsRowForm;
