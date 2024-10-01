import React, { useEffect, useState } from "react";

import { getAllEventNotifications, getEventNotificationById, postEventNotification, updateEventNotification, deleteEventNotificationById } from "../../services/event-notifications/event-notifications-service";
import EditForm from "./EditForm";
import CreateForm from "./CreateForm";
import moment from "moment";
import { Link } from "react-router-dom";
import MuiTable from "../../components/general_components/MuiTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import DetailsModal from "./DetailsModal";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

import { Panel } from "primereact/panel";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import ChangeDataStatusModal from "./ChangeDataStatusModal";

function ListPage({ loggedInUserData }) {
    const queryClient = useQueryClient();
    const [selectedItem, setSelectedItem] = useState({ id: null });

    const [showUserForm, setShowUserForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDetailShowModal, setUserDetailShowModal] = useState(false);
    const [userDetail, setUserDetail] = useState();

    const handleOpenuserDetailModal = (rowData) => {
        setUserDetail(rowData);
        setUserDetailShowModal(true);
    };

    const handleCloseuserDetailModal = () => {
        setUserDetailShowModal(false);
    };

    const handleShowEditForm = (item) => {
        setSelectedItem(item);
        setShowEditForm(true);
    };
    const handleCloseEditForm = () => {
        setSelectedItem({ id: null });
        setShowEditForm(false);
    };

    const handleShowUserForm = () => {
        setShowUserForm(true);
    };
    const handleCloseUserForm = () => {
        setShowUserForm(false);
    };

    const getListOfEventNotificationsQuery = useQuery({
        queryKey: ["event-notifications"],
        queryFn: () => getAllEventNotifications({ status: ["deactive", "pending"] }),
    });
    console.log("users list: ", getListOfEventNotificationsQuery?.data?.data);

    useEffect(() => {
        if (getListOfEventNotificationsQuery?.isError) {
            console.log("Error fetching List of getListOfEventNotificationsQuery:", getListOfEventNotificationsQuery?.error);
            getListOfEventNotificationsQuery?.error?.response?.data?.message
                ? toast.error(getListOfEventNotificationsQuery?.error?.response?.data?.message)
                : !getListOfEventNotificationsQuery?.error?.response
                ? toast.warning("Check Your Internet Connection Please")
                : toast.error("An Error Occurred Please Contact Admin");
        }
    }, [getListOfEventNotificationsQuery?.isError]);

    const [deleteMutationIsLoading, setDeleteMutationIsLoading] = useState(false);
    console.log("🚀 ~ ListRecords ~ deleteMutationIsLoading:", deleteMutationIsLoading);

    const deleteMutation = useMutation({
        mutationFn: deleteEventNotificationById,
        onSuccess: (data) => {
            queryClient.resetQueries(["event-notifications"]);
            setLoading(false);
            setDeleteMutationIsLoading(false);
            console.log("deleted user successfully: ");
        },
        onError: (error) => {
            console.log("The error is: ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occurred Please Contact Admin");
            setLoading(false);
            setDeleteMutationIsLoading(false);
        },
    });

    // const handleDelete = async (event, id) => {
    //     console.log("users is xxxxx : ", id);
    //     var result = window.confirm("Are you sure you want to delete? ");
    //     if (result === true) {
    //         setLoading(true);
    //         deleteUserMutation.mutate(id);
    //     }
    // };

    const handleDelete = (event, id) => {
        console.log("Delete Id Is : ", id);

        let deleteUserId = id;
        confirmDialog({
            message: "Are you sure you want to delete?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: confirmDelete(deleteUserId),
            reject: cancelDelete,
        });
    };

    const confirmDelete = (deleteItemId) => {
        if (deleteItemId !== null) {
            deleteMutation.mutate(deleteItemId);
        }
    };

    const cancelDelete = () => {
        // setDeleteDirectorateId(null);
    };

    let tableId = 0;

    const columns = [
        {
            title: "#",
            width: "5%",
            field: "name",
            render: (rowData) => {
                tableId = rowData.tableData.id;
                tableId++;
                return <div>{rowData.tableData.id}</div>;
            },
        },
        {
            title: "Name",
            field: "name",
            render: (rowData) => {
                return (
                    <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handleOpenuserDetailModal(rowData)}>
                        {rowData?.name}
                    </span>
                );
            },
        },
        {
            title: "Email",
            field: "email",
        },
    ];

    //======================= Change Data Status ====================
    const [showChangeDataStatusModal, setShowChangeDataStatusModal] = useState(false);
    const handleShowChangeDataStatusModal = (e, item) => {
        setSelectedItem(item);
        setShowChangeDataStatusModal(true);
    };
    const handleCloseChangeDataStatusModal = () => {
        setSelectedItem({ id: null });
        setShowChangeDataStatusModal(false);
    };

    return (
        <div style={{ width: "100%" }}>
            <Panel header="Manage Event Notifications" style={{ marginBottom: "20px" }}>
                <div>
                    <div xs={12}>
                        <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            {loggedInUserData?.permissions?.includes("create") && (
                                <div>
                                    <div md={12} className="text-end">
                                        <Button onClick={() => handleShowUserForm()}>Create Event Notification</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <div>
                                <MuiTable
                                    tableTitle="Event Notifications"
                                    tableData={getListOfEventNotificationsQuery?.data?.data?.data}
                                    tableColumns={columns}
                                    handleShowEditForm={handleShowEditForm}
                                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                                    // showEdit={loggedInUserData?.permissions.includes("update")}
                                    showEdit={false}
                                    showDelete={loggedInUserData?.permissions.includes("delete")}
                                    loading={loading || getListOfEventNotificationsQuery.isLoading || getListOfEventNotificationsQuery.status === "loading"}
                                    // change data status
                                    showDataChangeStatus={false}
                                    handleChangeDataStatus={(e, rowData) => {
                                        return handleShowChangeDataStatusModal(e, rowData);
                                    }}
                                    hideDataChangeStatusRow={(rowData) => {
                                        console.log("rowdata llllvvccd : ", rowData);
                                        // return rowData?.spatie_current_status?.name ? false : true;
                                        return false;
                                    }}
                                />
                                <ChangeDataStatusModal user={userDetail} show={showChangeDataStatusModal} onClose={handleCloseChangeDataStatusModal} selectedItem={selectedItem} />
                                <DetailsModal user={userDetail} showModal={userDetailShowModal} handleCloseModal={handleCloseuserDetailModal} />
                                <EditForm rowData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} loggedInUserData={loggedInUserData} />
                                <CreateForm show={showUserForm} onHide={handleCloseUserForm} onClose={handleCloseUserForm} loggedInUserData={loggedInUserData} />
                                {/* {(getListOfUsers.isLoading || getListOfUsers.status == "loading") && <WaterIsLoading />} */}
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    );
}

export default ListPage;
