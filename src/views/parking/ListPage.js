import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateForm from "./CreateForm";

import EditForm from "./EditForm";

import moment from "moment";

import { Link } from "react-router-dom";

import { getAllParkings, getParkingById, postParkings, updateParkings, deleteParkingById } from "../../services/parking/parking-service.js";

import MuiTable from "../../components/general_components/MuiTable";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { Image } from "primereact/image";
import { useNavigate } from "react-router-dom";
import { Tag } from "primereact/tag";

function ListPage({ loggedInUserData, selectedParentItem, ...props }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data, isLoading, isError, error, status } = useQuery(["parking"], getAllParkings, {
        onSuccess: (data) => {
            console.log("list of all parking-service : ", data);
        },
        onError: (error) => {
            console.log("Error fetching getAllVendors is : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });
    console.log(data);
    isError && toast.error("There was an error while fetching data");

    const DeleteSelectedItemMutation = useMutation((variables) => deleteParkingById(variables), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["parking"]);
        },
        onError: (error) => {
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

    // const handleDelete = async (event, id) => {
    //     var result = window.confirm("Are you sure you want to delete?");
    //     if (result === true) {
    //         ProgramDeleteMutation.mutate(id);
    //     }
    // };

    const handleDelete = (event, id) => {
        let selectedDeleteId = id;
        confirmDialog({
            message: "Are you sure you want to delete?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => confirmDelete(selectedDeleteId),
            reject: cancelDelete,
        });
    };

    const confirmDelete = (selectedDeleteId) => {
        if (selectedDeleteId !== null) {
            DeleteSelectedItemMutation.mutate(selectedDeleteId);
        }
    };

    const cancelDelete = () => {
        // setDeleteProgramId(null);
    };

    const [selectedItem, setSelectedItem] = useState();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showBudjetOutPutAddForm, setShowBudjetOutPutAddForm] = useState(false);

    const handleShowEditForm = (item) => {
        setSelectedItem(item);
        setShowEditForm(true);
        console.log("handleShowEditForm is : ", item);
    };
    const handleCloseEditForm = () => {
        setSelectedItem({ id: null });
        setShowEditForm(false);
    };

    // const activeUser = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;
    const activeUser = loggedInUserData;

    const onFormClose = () => {
        setShowAddForm(false);
    };

    const onBudjetOutPutFormClose = () => {
        setShowBudjetOutPutAddForm(false);
    };

    let tableId = 0;

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

    const columns = [
        {
            title: "#",
            width: "5%",
            field: "id",
            render: (rowData) => {
                // tableId = rowData.tableData.id;
                tableId = tableId++;
                return <div>{rowData.tableData.index + 1}</div>;
                // return <div>{rowData.tableData.id}</div>;
            },
        },
        {
            title: "Car",
            field: "car.name",
            render: (rowData) => rowData.car?.name || "No Car", // Assuming you have a related car object
        },
        {
            title: "Vendor",
            field: "vendor.name",
            render: (rowData) => rowData.vendor?.name || "No Vendor",
        },
        {
            title: "Currency",
            field: "parking_fee.currency",
            render: (rowData) => rowData?.parking_fee?.currency || "No Currency",
        },
        {
            title: "Billing Cycle",
            field: "parking_fee.billing_cycle",
            render: (rowData) => rowData?.parking_fee?.billing_cycle || "No Billing Cycle",
        },
        // {
        //     title: "Status",
        //     field: "status",
        //     render: (rowData) => rowData.status || "No Status",
        // },
        {
            title: "Current Status",
            field: "status",
            render: (rowData) => {
                let currentStatus = rowData?.status;
                let color = "gray";
                if (currentStatus === "active") {
                    color = "success";
                } else if (currentStatus === "deactive") {
                    color = "danger";
                } else if (currentStatus === "future") {
                    color = "primary";
                }

                return <Tag value={currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} severity={color} />;
            },
        },
        {
            title: "Fee Amount",
            field: "parking_fee.fee_amount",
            render: (rowData) => {
                return rowData?.parking_fee?.fee_amount ? parseFloat(rowData?.parking_fee?.fee_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "No Fee";
            },
        },

        {
            title: "Start Date",
            field: "start_date",
            render: (rowData) => (rowData.start_date ? moment(rowData.start_date).format("YYYY-MM-DD HH:mm:ss") : "No Start Date"),
        },
        {
            title: "End Date",
            field: "end_date",
            render: (rowData) => (rowData.end_date ? moment(rowData.end_date).format("YYYY-MM-DD HH:mm:ss") : "No End Date"),
        },

        {
            title: "Duration",
            field: "duration",
            render: (rowData) => {
                const startDate = new Date(rowData.start_date);
                let endDate = rowData.end_date ? new Date(rowData.end_date) : new Date(); // Default to now if no end date

                if (rowData.status === "active" && !rowData.end_date) {
                    endDate = new Date(); // Set to now if active and no end date is set
                }
                return calculatePeriod(startDate, endDate) || "Duration not available";
            },
        },
        {
            title: "Total Charge",
            field: "parking_charge",
            render: (rowData) => {
                return rowData.parking_charge ? parseFloat(rowData.parking_charge).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "No Charge";
            },
        },
        {
            title: "Details",
            field: "details",
            hidden: true,
            render: (rowData) => rowData.details || "No Details",
        },
        {
            title: "Created By",
            field: "created_by",
            hidden: true,
            render: (rowData) => rowData.createdBy?.name || "No Creator", // Assuming you have a related createdBy object
        },
        {
            title: "Updated By",
            field: "updated_by",
            hidden: true,
            render: (rowData) => rowData.updatedBy?.name || "No Updater", // Assuming you have a related updatedBy object
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            {/* <div className="col-12 xl:col-12">
                <div className="card">
                    <p>Funders Are Attched onto subprojects</p>
                </div>
            </div> */}
            <Panel header="Parking" style={{ marginBottom: "20px" }}>
                <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    {activeUser?.permissions.includes("create") && <Button label="Add Parking Service" className="p-button-primary" onClick={() => setShowAddForm(true)} />}
                    <CreateForm selectedParentItem={selectedParentItem} show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} />
                    {/* <BudgetOutPutsCreateForm show={showBudjetOutPutAddForm} onHide={() => setShowBudjetOutPutAddForm(false)} onClose={onBudjetOutPutFormClose} /> */}
                </div>

                <MuiTable
                    tableTitle="Parking Services"
                    tableData={data?.data}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showEdit={activeUser?.permissions.includes("update")}
                    showDelete={activeUser?.permissions.includes("delete")}
                    loading={isLoading || status === "loading" || DeleteSelectedItemMutation.isLoading}
                    //
                    exportButton={true}
                    pdfExportTitle="Parking Services"
                    csvExportTitle="Parking Services"

                    //
                    // handleViewPage={(rowData) => {
                    //     navigate("vendor_service", { state: { vendorData: rowData } });
                    // }}
                    // showViewPage={true}
                    // hideRowViewPage={false}
                />

                {selectedItem && <EditForm selectedParentItem={selectedParentItem} rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}
            </Panel>
        </div>
    );
}

export default ListPage;
