import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateForm from "./CreateForm";

import EditForm from "./EditForm";

import moment from "moment";

import { Link } from "react-router-dom";

import { getAllSpareParts, getSparePartById, postSparePart, updateSparePart, deleteSparePartById } from "../../services/spare-parts/spare-parts-service";

import WaterIsLoading from "../../components/general_components/WaterIsLoading";
import MuiTable from "../../components/general_components/MuiTable";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { Image } from "primereact/image";
import { useNavigate } from "react-router-dom";

function ListPage({ loggedInUserData, ...props }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data, isLoading, isError, error, status } = useQuery(["spare-parts"], getAllSpareParts, {
        onSuccess: (data) => {
            console.log("list of all vendors : ", data);
        },
        onError: (error) => {
            console.log("Error fetching getAllVendors is : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });
    console.log(data);
    isError && toast.error("There was an error while fetching data");

    const DeleteSelectedItemMutation = useMutation((variables) => deleteSparePartById(variables), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["spare-parts"]);
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
            render: (rowData) => <div>{rowData.tableData.id + 1}</div>,
        },
        {
            title: "Name",
            field: "name",
        },

        {
            title: "Price",
            field: "price",
            render: (rowData) => {
                return rowData.price ? parseFloat(rowData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "No Price";
            },
        },
        {
            title: "Quantity",
            field: "quantity",
            render: (rowData) => {
                const quantityString = String(rowData.quantity); // Ensure it's a string
                const amount = parseFloat(quantityString.replace(/,/g, ""));
                return <div>{isNaN(amount) ? rowData.quantity : amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>;
            },
        },
        {
            title: "Description",
            field: "description",
        },
        {
            title: "Vendor",
            field: "vendor_id",
            render: (rowData) => {
                // Assuming there is a method to find vendor details by ID
                const vendor = rowData.vendor;
                return <div>{vendor ? vendor.name : "No Vendor"}</div>;
            },
        },
        {
            title: "Photo",
            field: "photo_url",
            render: (rowData) => {
                return rowData.photo_url ? <Image src={`${process.env.REACT_APP_API_BASE_URL}${rowData.photo_url}`} alt="Item" width="100" style={{ verticalAlign: "middle" }} preview={true} /> : <div>No Image</div>;
            },
        },
        {
            title: "Date",
            field: "created_at",
            render: (rowData) => moment(rowData.created_at).format("lll"),
        },
        {
            title: "Created By Name",
            field: "created_by.name",
            hidden: true,
        },
        {
            title: "Created By Email",
            field: "created_by.email",
            hidden: true,
        },
    ];

    return (
        <div style={{ width: "100%" }}>
            {/* <div className="col-12 xl:col-12">
                <div className="card">
                    <p>Funders Are Attched onto subprojects</p>
                </div>
            </div> */}
            <Panel header="Spare" style={{ marginBottom: "20px" }}>
                <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    {activeUser?.permissions.includes("create") && <Button label="Add Spare" className="p-button-primary" onClick={() => setShowAddForm(true)} />}
                    <CreateForm show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} projectId={props?.projectId} />
                    {/* <BudgetOutPutsCreateForm show={showBudjetOutPutAddForm} onHide={() => setShowBudjetOutPutAddForm(false)} onClose={onBudjetOutPutFormClose} /> */}
                </div>

                <MuiTable
                    tableTitle="Spare"
                    tableData={data?.data}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showEdit={activeUser?.permissions.includes("update")}
                    showDelete={activeUser?.permissions.includes("delete")}
                    loading={isLoading || status === "loading" || DeleteSelectedItemMutation.isLoading}
                    //
                    // handleViewPage={(rowData) => {
                    //     navigate("vendor", { state: { vendorData: rowData } });
                    // }}
                    // showViewPage={true}
                    // hideRowViewPage={false}
                />

                {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />}
            </Panel>
        </div>
    );
}

export default ListPage;