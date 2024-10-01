import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateForm from "./CreateForm";

import EditForm from "./EditForm";

import moment from "moment";

import { Link } from "react-router-dom";

import { getAllParkingFees, getParkingFeeById, postParkingFees, updateParkingFees, deleteParkingFeeById } from "../../../services/parking/parking-fee-service.js";

import WaterIsLoading from "../../../components/general_components/WaterIsLoading";
import MuiTable from "../../../components/general_components/MuiTable";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { Image } from "primereact/image";

function ListPage({ loggedInUserData, ...props }) {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error, status } = useQuery(["parking-fees"], getAllParkingFees, {
        onSuccess: (data) => {
            console.log("list of all parking-fees : ", data);
        },
        onError: (error) => {
            console.log("Error fetching getAllcar is : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });
    console.log(data);
    isError && toast.error("There was an error while fetching data");

    const DeleteSelectedItemMutation = useMutation((variables) => deleteParkingFeeById(variables), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["parking-fees"]);
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
    const columns = [
        {
            title: "#",
            width: "5%",
            field: "name",
            render: (rowData) => {
                // tableId = rowData.tableData.id;
                tableId = tableId++;
                return <div>{rowData.tableData.index + 1}</div>;
                // return <div>{rowData.tableData.id}</div>;
            },
        },
        {
            title: "Name",
            field: "name",
        },

        {
            title: "Currency",
            field: "currency",
        },
        {
            title: "Billing Cycle",
            field: "billing_cycle",
        },
        {
            title: "Status",
            field: "status",
        },
        {
            title: "Fee Amount",
            field: "fee_amount",
            render: (rowData) => (rowData.fee_amount ? Number(rowData.fee_amount).toLocaleString() : "0"),
        },
        {
            title: "Car Type",
            field: "car_type.name",
            // Assuming you have the car type name available, adjust as needed
            render: (rowData) => <div>{rowData?.car_type?.name || "No Car Type"}</div>,
        },

        {
            title: "Date",
            field: "created_at",
            render: (rowData) => {
                return moment(rowData.created_at).format("lll");
            },
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            {/* <div className="col-12 xl:col-12">
                <div className="card">
                    <p>Funders Are Attched onto subprojects</p>
                </div>
            </div> */}
            <Panel header="Parking Fees" style={{ marginBottom: "20px" }}>
                <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    {activeUser?.permissions.includes("create") && <Button label="Add Parking Fee" className="p-button-primary" onClick={() => setShowAddForm(true)} />}
                    <CreateForm show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} projectId={props?.projectId} />
                    {/* <BudgetOutPutsCreateForm show={showBudjetOutPutAddForm} onHide={() => setShowBudjetOutPutAddForm(false)} onClose={onBudjetOutPutFormClose} /> */}
                </div>

                <MuiTable
                    tableTitle="Parking Fees"
                    tableData={data?.data}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showEdit={activeUser?.permissions.includes("update")}
                    showDelete={activeUser?.permissions.includes("delete")}
                    loading={isLoading || status === "loading" || DeleteSelectedItemMutation.isLoading}
                />

                {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}
            </Panel>
        </div>
    );
}

export default ListPage;
