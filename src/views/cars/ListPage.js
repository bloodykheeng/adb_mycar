import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateForm from "./CreateForm";

import EditForm from "./EditForm";

import moment from "moment";

import { Link } from "react-router-dom";

import { getAllCars, getCarById, postCar, updateCar, deleteCarById } from "../../services/cars/car-service";

import WaterIsLoading from "../../components/general_components/WaterIsLoading";
import MuiTable from "../../components/general_components/MuiTable";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { Image } from "primereact/image";
import { useNavigate } from "react-router-dom";
import { Tag } from "primereact/tag";

function ListPage({ loggedInUserData, ...props }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data, isLoading, isError, error, status } = useQuery(["cars"], getAllCars, {
        onSuccess: (data) => {
            console.log("list of all cars : ", data);
        },
        onError: (error) => {
            console.log("Error fetching getAllcars is : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });
    console.log(data);
    isError && toast.error("There was an error while fetching data");

    const DeleteSelectedItemMutation = useMutation((variables) => deleteCarById(variables), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["cars"]);
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
    // const activeUser = loggedInUserData;

    const onFormClose = () => {
        setShowAddForm(false);
    };

    const onBudjetOutPutFormClose = () => {
        setShowBudjetOutPutAddForm(false);
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
            title: "Price",
            field: "price",
        },
        {
            title: "Price",
            field: "price",
            render: (rowData) => {
                const amount = parseFloat(rowData.price.replace(/,/g, ""));
                return <div>{isNaN(amount) ? rowData.price : amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>;
            },
        },
        {
            title: "Model",
            field: "model",
        },
        {
            title: "inspection_status",
            field: "inspection_status",
            render: (rowData) => {
                return <Tag severity={getTagSeverity(rowData?.inspection_status)} icon="pi pi-file" value={rowData?.inspection_status}></Tag>;
            },
        },
        {
            title: "Photo",
            field: "photo_url",
            render: (rowData) => {
                return rowData.photos ? <Image src={`${rowData?.photos && process.env.REACT_APP_API_BASE_URL}${rowData?.photos[0]?.photo_url}`} alt="Item" width="100" style={{ verticalAlign: "middle" }} preview={true} /> : <div>No Image</div>;
            },
        },

        {
            title: "Date",
            field: "created_at",
            render: (rowData) => {
                return moment(rowData.created_at).format("lll");
            },
        },
    ];

    const activeUser = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;
    return (
        <div style={{ width: "100%" }}>
            <Panel header="Cars" style={{ marginBottom: "20px" }}>
                <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    {activeUser?.permissions.includes("create") && <Button label="Add Car" className="p-button-primary" onClick={() => setShowAddForm(true)} />}
                    <CreateForm show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} projectId={props?.projectId} />
                    {/* <BudgetOutPutsCreateForm show={showBudjetOutPutAddForm} onHide={() => setShowBudjetOutPutAddForm(false)} onClose={onBudjetOutPutFormClose} /> */}
                </div>

                <MuiTable
                    tableTitle="Cars"
                    tableData={data?.data}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showEdit={["Admin", "Vendor"].includes(loggedInUserData?.role) && activeUser?.permissions.includes("update")}
                    showDelete={["Admin", "Vendor"].includes(loggedInUserData?.role) && activeUser?.permissions.includes("delete")}
                    loading={isLoading || status === "loading" || DeleteSelectedItemMutation.isLoading}
                    //
                    handleViewPage={(rowData) => {
                        navigate("car", { state: { carData: rowData } });
                    }}
                    showViewPage={true}
                    hideRowViewPage={false}
                />

                {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}
            </Panel>
        </div>
    );
}

export default ListPage;
