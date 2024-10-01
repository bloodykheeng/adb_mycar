import React, { useState, useEffect } from "react";
// import { Card } from "primereact/card";
import { Tree } from "primereact/tree";
import { Divider } from "primereact/divider";
import { useLocation } from "react-router-dom";
import { Panel } from "primereact/panel";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import { Button } from "primereact/button";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { Fieldset } from "primereact/fieldset";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { TabView, TabPanel } from "primereact/tabview";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Dialog } from "primereact/dialog";

import { ProgressBar } from "primereact/progressbar";
import { Image } from "primereact/image";
import { Galleria } from "primereact/galleria";
import { Carousel } from "primereact/carousel";

import { Tag } from "primereact/tag";

//
import { getAllCars, getAllCarInspectors, getCarById, postCar, updateCar, deleteCarById } from "../../services/cars/car-service";

//
import InspectorRowForm from "./widgets/InspectorRowForm";
import CarDetailsRowForm from "./widgets/CarDetailsRowForm";
import CarPhotosRowForm from "./widgets/CarPhotosRowForm";
import CarVideosRowForm from "./widgets/CarVideosRowForm";

import { ProgressSpinner } from "primereact/progressspinner";

import CarReportPage from "./reports/CarReportPage";
import ApprovalPage from "./approvals/ApprovalPage";

//
// import UserList from "./vendor-users/UserList";
// import VendorServicesPage from "./vendor-services/VendorServicesPage";

const CarsViewPage = ({ loggedInUserData }) => {
    const queryClient = useQueryClient();
    const [showEditDetailsDialog, setShowEditDetailsDialog] = useState(false);
    const [showPublishCarDialog, setShowPublishCarDialog] = useState(false);
    const [showAttachInspectorDialog, setShowAttachInspectorDialog] = useState(false);
    const [showEditPhotosDialog, setShowEditPhotosDialog] = useState(false);
    const [showEditVideosDialog, setShowEditVideosDialog] = useState(false);

    //
    const [showPublishDialog, setShowPublishDialog] = useState(false);

    //
    let { state } = useLocation();
    let parentDataFormState = state?.carData ? state?.carData : null;

    //===================== getDepartmentById by id =================
    const fetchParentById = useQuery(["cars", "getById", parentDataFormState?.id], () => getCarById(parentDataFormState?.id), {
        onSuccess: (data) => {
            console.log("parentData products onsuccess fetching : ", data);
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            console.log("get list of products by Id : ", error);
        },
    });

    //
    let parentData = fetchParentById?.data?.data;

    console.log("Product view page data parentData : ", parentData);

    const [selectedItem, setSelectedItem] = useState();

    const activeUser = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;

    const itemTemplate = (item) => {
        return <img src={`${process.env.REACT_APP_API_BASE_URL}${item.photo_url}`} alt={item.caption} style={{ width: "100%" }} />;
    };

    const thumbnailTemplate = (item) => {
        return <img src={`${process.env.REACT_APP_API_BASE_URL}${item.photo_url}`} alt={item.caption} style={{ width: "80px", height: "56px" }} />;
    };

    const videoItemTemplate = (video) => {
        return (
            <div>
                <video controls style={{ width: "100%", maxHeight: "300px" }}>
                    <source src={`${process.env.REACT_APP_API_BASE_URL}${video.video_url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <p>{video.caption}</p>
            </div>
        );
    };

    // Define responsive options if needed
    const galleriaResponsiveOptions = [
        {
            breakpoint: "1024px",
            numVisible: 5,
        },
        {
            breakpoint: "768px",
            numVisible: 3,
        },
        {
            breakpoint: "560px",
            numVisible: 1,
        },
    ];

    const editToPublishCarMutation = useMutation({
        mutationFn: (variables) => updateCar(parentData?.id, variables),
        onSuccess: () => {
            toast.success("Car Published Successfully");
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

    const handlePublish = () => {
        console.log("Data we are submitting: ", parentData);

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", parentData.name);
        formData.append("code", parentData.code);
        formData.append("description", parentData.description);
        formData.append("status", parentData.status);
        formData.append("make", parentData.make);
        formData.append("model", parentData.model);
        formData.append("year", parentData.year);
        formData.append("mileage", parentData.mileage);
        formData.append("number_plate", parentData.number_plate);
        formData.append("price", parentData.price);
        formData.append("quantity", parentData.quantity);
        formData.append("color", parentData.color);
        formData.append("visibility", "public");
        formData.append("status", "sale");

        formData.append("fuel_type", parentData.fuel_type);
        formData.append("drive_type", parentData.drive_type);
        formData.append("engine_type", parentData.engine_type);
        formData.append("vin", parentData.vin);
        formData.append("identifier", parentData.identifier);

        // Append car_brand_id and vendor_id if they are included in your form
        if (parentData.car_brand_id) {
            formData.append("car_brand_id", parentData.car_brand_id);
        }

        if (parentData.car_type_id) {
            formData.append("car_type_id", parentData.car_type_id);
        }
        if (parentData.vendor_id) {
            formData.append("vendor_id", parentData.vendor_id);
        }

        // Log formData keys and values for debugging
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        console.log("Publishing Car:");
        editToPublishCarMutation.mutate(formData);
        setShowPublishDialog(false); // Close the dialog after action
    };

    const getTagSeverity = (status) => {
        switch (status) {
            case "approved":
                return "success"; // Green
            case "rejected":
                return "danger"; // Red
            case "inspected":
                return "warning"; // Orange or Yellow
            default:
                return "neutral"; // Grey or a neutral color
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <BreadcrumbNav />
            <div className="projects-view-page">
                {fetchParentById.isLoading && fetchParentById.isFetching && !parentData && (
                    <div className="m-2">
                        <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
                    </div>
                )}
                <Panel header={`Car ${parentData?.name} Details`} style={{ marginBottom: "20px" }}>
                    {/* Nested TabView inside Overview */}

                    {parentData && (
                        <TabView scrollable={true}>
                            <TabPanel header="Details">
                                {["Admin", "Vendor"].includes(loggedInUserData?.role) && (
                                    <div style={{ margin: "1rem", display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "1rem", width: "100%" }}>
                                        <Button label="Edit Car Details" onClick={() => setShowEditDetailsDialog(true)} />
                                        <Button label={editToPublishCarMutation?.isLoading ? "" : "Publish Car"} onClick={() => setShowPublishDialog(true)} icon={editToPublishCarMutation?.isLoading ? "" : "pi pi-check"} className={editToPublishCarMutation?.isLoading ? "p-button-text" : ""}>
                                            {editToPublishCarMutation?.isLoading && <ProgressSpinner style={{ width: "20px", height: "20px" }} />}
                                        </Button>
                                        <Button label="Attach Inspector" onClick={() => setShowAttachInspectorDialog(true)} />
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                    {/* Column 1 */}
                                    <div style={{ minWidth: "300px" }}>
                                        <p>
                                            <strong>Name:</strong> {parentData?.name}
                                        </p>
                                        <p>
                                            <strong>Make:</strong> {parentData?.make}
                                        </p>
                                        <p>
                                            <strong>Model: </strong> {parentData?.model}
                                        </p>
                                        <p>
                                            <strong>Year: </strong> {parentData?.year}
                                        </p>
                                        <p>
                                            <strong>Mileage: </strong> {parentData?.mileage}
                                        </p>
                                        <p>
                                            <strong>Number Plate: </strong> {parentData?.number_plate}
                                        </p>
                                        <p>
                                            <strong>Fuel Type:</strong> {parentData?.fuel_type}
                                        </p>
                                        <p>
                                            <strong>Drive Type:</strong> {parentData?.drive_type}
                                        </p>
                                        <p>
                                            <strong>Engine Type:</strong> {parentData?.engine_type}
                                        </p>
                                        <p>
                                            <strong>VIN:</strong> {parentData?.vin}
                                        </p>
                                        <p>
                                            <strong>Identifier:</strong> {parentData?.identifier}
                                        </p>
                                        <p>
                                            <strong>Visibility: </strong> {parentData?.visibility}
                                        </p>
                                        <p>
                                            <strong>Status: </strong> {parentData?.status}
                                        </p>
                                        <p>
                                            <strong>Inspector: </strong>
                                            <Tag className="mr-2" icon="pi pi-user" value={parentData?.inspector?.name}></Tag>
                                        </p>
                                        <p>
                                            <strong>Inspection Status: </strong>
                                            <Tag severity={getTagSeverity(parentData?.inspection_status)} icon="pi pi-file" value={parentData?.inspection_status}></Tag>
                                        </p>
                                    </div>

                                    {/* Column 2 */}
                                    <div style={{ minWidth: "300px" }}>
                                        <p>
                                            <strong>Price: </strong> {parentData?.price ? parseInt(parentData?.price).toLocaleString() : "N/A"}
                                        </p>
                                        <p>
                                            <strong>Color: </strong> {parentData?.color}
                                        </p>
                                        <p>
                                            <strong>Quantity: </strong> {parentData?.quantity}
                                        </p>
                                        <p>
                                            <strong>Description: </strong> {parentData?.description}
                                        </p>
                                        <p>
                                            <strong>Vendor: </strong> {parentData?.vendor?.name}
                                        </p>
                                        <p>
                                            <strong>Brand: </strong> {parentData?.brand?.name}
                                        </p>
                                        <p>
                                            <strong>Type: </strong> {parentData?.type?.name}
                                        </p>
                                    </div>
                                </div>
                                {/* <Divider /> */}
                            </TabPanel>
                            <TabPanel header="Photos">
                                {["Admin", "Vendor"].includes(loggedInUserData?.role) && (
                                    <div style={{ margin: "1rem", display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "1rem", width: "100%" }}>
                                        {" "}
                                        <Button label="Edit Photos" onClick={() => setShowEditPhotosDialog(true)} />
                                    </div>
                                )}

                                <div className="card">
                                    <center>
                                        {parentData?.photos && parentData?.photos.length > 0 ? (
                                            <Galleria value={parentData.photos} responsiveOptions={galleriaResponsiveOptions} numVisible={5} circular autoPlay transitionInterval={3000} item={itemTemplate} thumbnail={thumbnailTemplate} style={{ maxWidth: "640px" }} />
                                        ) : (
                                            <p>No photos available.</p>
                                        )}
                                    </center>
                                </div>
                            </TabPanel>
                            <TabPanel header="Videos">
                                {["Admin", "Vendor"].includes(loggedInUserData?.role) && (
                                    <div style={{ margin: "1rem", display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "1rem", width: "100%" }}>
                                        <Button label="Edit Videos" onClick={() => setShowEditVideosDialog(true)} />
                                    </div>
                                )}

                                {parentData?.videos && parentData?.videos.length > 0 ? <Carousel value={parentData.videos} numVisible={3} numScroll={1} itemTemplate={videoItemTemplate} /> : <p>No videos available.</p>}
                            </TabPanel>
                            <TabPanel header="Reports">
                                <CarReportPage loggedInUserData={loggedInUserData} selectedCarData={parentData} />
                            </TabPanel>
                            {["Admin"].includes(loggedInUserData?.role) && (
                                <TabPanel header="Approvals">
                                    <ApprovalPage loggedInUserData={loggedInUserData} selectedCarData={parentData} />
                                </TabPanel>
                            )}

                            {/* <TabPanel header="Users">
                            <UserList loggedInUserData={loggedInUserData} selectedParentItem={parentData} />
                        </TabPanel> */}
                            {/* <TabPanel header="Services">
                            <VendorServicesPage loggedInUserData={loggedInUserData} selectedParentItem={parentData} />
                        </TabPanel> */}
                        </TabView>
                    )}
                </Panel>
                <Dialog maximizable header="Edit Car Details" visible={showEditDetailsDialog} onHide={() => setShowEditDetailsDialog(false)} modal>
                    <CarDetailsRowForm initialData={parentData} />
                </Dialog>

                <Dialog
                    maximizable
                    header="Confirm Publish"
                    visible={showPublishDialog}
                    onHide={() => setShowPublishDialog(false)}
                    modal
                    footer={
                        <div>
                            <Button label="Yes" icon="pi pi-check" onClick={handlePublish} className="p-button-text" />
                            <Button label="No" icon="pi pi-times" onClick={() => setShowPublishDialog(false)} className="p-button-text" />
                        </div>
                    }
                >
                    Are you sure you want to publish this car?
                </Dialog>

                <Dialog maximizable header="Attach Inspector" visible={showAttachInspectorDialog} onHide={() => setShowAttachInspectorDialog(false)} modal>
                    <InspectorRowForm initialData={parentData} />
                </Dialog>
                <Dialog maximizable header="Edit Photos" visible={showEditPhotosDialog} onHide={() => setShowEditPhotosDialog(false)} modal>
                    <CarPhotosRowForm initialData={parentData} />
                </Dialog>
                <Dialog maximizable header="Edit Videos" visible={showEditVideosDialog} onHide={() => setShowEditVideosDialog(false)} modal>
                    <CarVideosRowForm initialData={parentData} />
                </Dialog>
            </div>
        </div>
    );
};

export default CarsViewPage;
