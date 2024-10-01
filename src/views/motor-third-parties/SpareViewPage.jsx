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

import { ProgressBar } from "primereact/progressbar";
import { Image } from "primereact/image";

//
import { getAllVendors, getVendorById, postVendor, updateVendor, deleteVendorById } from "../../services/vendors/vendors-service.js";

//
import UserList from "./vendor-users/UserList";
import VendorServicesPage from "./vendor-services/VendorServicesPage";

const SpareViewPage = ({ loggedInUserData }) => {
    const queryClient = useQueryClient();
    //
    let { state } = useLocation();
    let vendorData = state?.vendorData ? state?.vendorData : null;

    //===================== getDepartmentById by id =================
    const fetchVendorById = useQuery(["vendors", "getById", vendorData?.id], () => getVendorById(vendorData?.id), {
        onSuccess: (data) => {
            console.log("vendorData onsuccess fetching : ", data);
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            console.log("get list of Vendors by Id : ", error);
        },
    });

    //
    vendorData = vendorData ?? fetchVendorById?.data?.data;

    const [selectedItem, setSelectedItem] = useState();

    const activeUser = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;

    return (
        <div style={{ width: "100%" }}>
            <BreadcrumbNav />
            <div className="projects-view-page">
                {fetchVendorById.isLoading && fetchVendorById.isFetching && !vendorData && (
                    <div className="m-2">
                        <ProgressBar mode="indeterminate" style={{ height: "4px" }} />
                    </div>
                )}
                <Panel header={`Vendor ${vendorData?.name} Details`} style={{ marginBottom: "20px" }}>
                    {/* Nested TabView inside Overview */}
                    <TabView scrollable={true}>
                        <TabPanel header="Details">
                            <div className="flex flex-wrap">
                                <div className="w-full px-2 mb-4">
                                    <Image src={`${process.env.REACT_APP_API_BASE_URL}${vendorData.photo_url}`} alt={`${vendorData?.name} photo`} width="100" preview style={{ verticalAlign: "middle" }} />
                                </div>

                                {/* Column 1 */}
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <p>
                                        <strong>Name:</strong> {vendorData?.name}
                                    </p>
                                </div>

                                {/* Column 2 */}
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <p>
                                        <strong>Code:</strong> {vendorData?.code}
                                    </p>
                                </div>

                                <div className="w-full px-2">
                                    <strong>Details</strong>
                                    <p>{vendorData?.description}</p>
                                </div>
                            </div>

                            {/* <Divider /> */}
                        </TabPanel>
                        <TabPanel header="Users">
                            <UserList loggedInUserData={loggedInUserData} selectedParentItem={vendorData} />
                        </TabPanel>
                        <TabPanel header="Services">
                            <VendorServicesPage loggedInUserData={loggedInUserData} selectedParentItem={vendorData} />
                        </TabPanel>
                    </TabView>
                </Panel>
            </div>
        </div>
    );
};

export default SpareViewPage;
