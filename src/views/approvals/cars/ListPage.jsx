import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import CreateForm from "./CreateForm";

// import EditForm from "./EditForm";

import moment from "moment";

import { getAllCarInspectionReports, getCarInspectionReportById, postCarInspectionReports, updateCarInspectionReports, deleteCarInspectionReportById } from "../../../services/inspection/car-inspection-reports-service.js";

import WaterIsLoading from "../../../components/general_components/WaterIsLoading.jsx";
import MuiTable from "../../../components/general_components/MuiTable.jsx";
import { toast } from "react-toastify";
import { Button } from "primereact/button";

import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";

import { Panel } from "primereact/panel";
import InspectionReportPdfModal from "./InspectionReportPdfModal.jsx";
import ApprovalModal from "./widgets/ApprovalModal.jsx";

function ListPage({ loggedInUserData, ...props }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error, status } = useQuery(
        ["car-inspection-reports", "pending-approval-by-the-admin"],
        () =>
            getAllCarInspectionReports({
                reason: "pending-approval-by-the-admin",
            }),
        {
            onSuccess: (data) => {
                console.log("fetching car-inspection-reports data for approval is : ", data);
            },
            onError: (error) => {
                console.log("Error fetching car-inspection-reports for approval is : ", error);
            },
        }
    );
    console.log(data);
    isError && toast.error("There was an error while fetching data");

    const DeleteSelectedItemMutation = useMutation((variables) => deleteCarInspectionReportById(variables), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["car-inspection-reports"]);
            // if (toast.current) {
            //     toast.current.show({ severity: "success", summary: "Success", detail: "Item deleted successfully", life: 3000 });
            // }

            toast.success("deleted successfully");
        },
        onError: (error) => {
            // Handle error case
            // if (toast.current) {
            //     toast.current.show({ severity: "error", summary: "Error", detail: "Error deleting item", life: 3000 });
            // }
            toast.error("An Error Occured");
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

    const activeUser = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;

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
            field: "id",
            render: (rowData) => {
                // tableId = rowData.tableData.id;
                tableId = tableId++;
                return <div>{rowData.tableData.index + 1}</div>;
                // return <div>{rowData.tableData.id}</div>;
            },
        },
        {
            title: "Title",
            field: "name",
        },

        {
            title: "Approval Status",
            field: "spatie_current_status.name",
            render: (rowData) => {
                let labelStyle = { padding: "3px", color: "#fff", borderRadius: "4px" };
                let labelClass = "";

                switch (rowData?.spatie_current_status?.name) {
                    case "draft":
                        labelStyle = { ...labelStyle, backgroundColor: "#f0ad4e" }; // Bootstrap warning color
                        labelClass = "label label-default";
                        break;
                    case "submitted":
                        labelStyle = { ...labelStyle, backgroundColor: "#5bc0de" }; // Bootstrap info color
                        labelClass = "label label-info";
                        break;
                    case "approved":
                        labelStyle = { ...labelStyle, backgroundColor: "#5cb85c" }; // Bootstrap success color
                        labelClass = "label label-success";
                        break;
                    case "rejected":
                        labelStyle = { ...labelStyle, backgroundColor: "#d9534f" }; // Bootstrap danger color
                        labelClass = "label label-danger";
                        break;
                    default:
                        labelStyle = { ...labelStyle, backgroundColor: "#5bc0de" }; // Bootstrap info color
                        labelClass = "label label-info";
                }

                return (
                    <div style={{ padding: "0.5rem" }}>
                        {" "}
                        <strong style={labelStyle} className={labelClass}>
                            {rowData?.spatie_current_status?.name.charAt(0).toUpperCase() + rowData?.spatie_current_status?.name.slice(1)}
                        </strong>
                    </div>
                );
            },
        },

        {
            title: "Updated By",
            hidden: true,
            field: "updated_by_user.email",
        },

        {
            title: "Created By",
            hidden: true,
            field: "created_by_user.email",
        },
        {
            title: "Date",
            hidden: true,
            field: "created_at",
            render: (rowData) => {
                return moment(rowData.created_at).format("lll");
            },
        },
    ];

    //======================= pdf ====================
    //  const [selectedItem, setSelectedItem] = useState({ id: null });
    const [showPDF, setShowPDF] = useState(false);
    const handleShowPDF = (e, item) => {
        setSelectedItem(item);
        setShowPDF(true);
    };
    const handleClosePDF = () => {
        setSelectedItem({ id: null });
        setShowPDF(false);
    };

    const [tableSelection, setTableSelection] = useState(false);

    //
    const [showApprovalModalStatus, setShowApprovalModalStatus] = useState(false);
    //======================= Approve ====================
    //  const [selectedItem, setSelectedItem] = useState({ id: null });
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const handleShowApprovalModal = (e, item) => {
        setSelectedItem(item);
        setShowApprovalModalStatus("approved");
        setShowApprovalModal(true);
    };
    const handleCloseApprovalModal = () => {
        setSelectedItem({ id: null });
        setShowApprovalModal(false);
    };

    //======================= Reject ====================
    //  const [selectedItem, setSelectedItem] = useState({ id: null });

    const handleRejection = (e, item) => {
        setSelectedItem(item);
        setShowApprovalModalStatus("rejected");
        setShowApprovalModal(true);
    };

    //
    return (
        <div style={{ width: "100%" }}>
            <Panel header="Car Inspection Reports Pending Approval" style={{ marginBottom: "20px" }}>
                {/* <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    {activeUser?.permissions.includes("add reports") && (
                        <Button
                            label={tableSelection ? "Single Approvals" : "Bulk Approvals"}
                            className="p-button-primary"
                            onClick={() => {
                                setTableSelection(!tableSelection);
                            }}
                        />
                    )}
                </div> */}
                <MuiTable
                    tableTitle="Car Inspection Reports Pending Approval"
                    tableData={data?.data}
                    tableColumns={columns}
                    // handleShowEditForm={(rowData) => navigate("datacollection", { state: { subprojectDetailData: subprojectDetail, selectedItemForEdit: rowData } })}
                    // showEdit={activeUser?.permissions.includes("edit reports") || activeUser?.permissions.includes("add reports")}
                    // hideRowEdit={(rowData) => {
                    //     return rowData.status === "submitted" || rowData.status === "approved" ? true : false;
                    // }}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showDelete={false}
                    // handleViewPage={(rowData) => {
                    //   return handleShowPDF(rowData);
                    // }}
                    // showViewPage={true}
                    // hideRowViewPage={false}
                    //view reports pdf
                    handleViewPdf={(e, item_id) => handleShowPDF(e, item_id)}
                    //
                    exportButton={false}
                    hideViewPdfRow={(rowData) => {
                        console.log("rowdata llllvvccd : ", rowData);
                        return rowData?.spatie_current_status?.name ? false : true;
                    }}
                    showViewPdf={true}
                    loading={isLoading || status === "loading" || DeleteSelectedItemMutation.isLoading}
                    //approvals
                    // selection={tableSelection}
                    // showSelectAllCheckbox={false}
                    // showTextRowsSelected={true}
                    // selectionChange={(selectedRows) => {}}
                    // handleDataApproval={() => {}}

                    showDataApproval={true}
                    handleDataApproval={(e, rowData) => {
                        return handleShowApprovalModal(e, rowData);
                    }}
                    hideDataApprovalRow={(rowData) => {
                        console.log("rowdata llllvvccd : ", rowData);
                        return rowData?.spatie_current_status?.name ? false : true;
                    }}
                    //rejection
                    showRejectionAction={true}
                    handleRejectionAction={(e, rowData) => {
                        return handleRejection(e, rowData);
                    }}
                    hideRejectionActionRow={(rowData) => {
                        console.log("rowdata llllvvccd : ", rowData);
                        return rowData?.spatie_current_status?.name ? false : true;
                    }}
                />
                {selectedItem && <InspectionReportPdfModal selectedItem={selectedItem} loggedInUserData={loggedInUserData} show={showPDF} onHide={() => setShowPDF(false)} onClose={onFormClose} />}
                <ApprovalModal approvalStatus={showApprovalModalStatus} selectedItem={selectedItem} loggedInUserData={loggedInUserData} show={showApprovalModal} onHide={() => setShowApprovalModal(false)} onClose={handleCloseApprovalModal} />
                {/* {selectedItem && <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} subprojectDetail={subprojectDetail} />} */}
                {DeleteSelectedItemMutation.isLoading && <WaterIsLoading />}
                {/* <ConfirmDialog /> */}
            </Panel>
        </div>
    );
}

export default ListPage;
