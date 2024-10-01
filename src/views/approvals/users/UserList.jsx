import React, { useEffect, useState } from "react";

import { getAllUsers, getUserById, getApproverRoles, createUser, updateUser, deleteUserById, getAssignableRoles } from "../../../services/auth/user-service";
import EditForm from "./EditForm";
import CreateForm from "./CreateForm";
import moment from "moment";
import { Link } from "react-router-dom";
import MuiTable from "../../../components/general_components/MuiTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import UserDetailsPage from "./UserDetailsPage";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

import { Panel } from "primereact/panel";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import ChangeDataStatusModal from "./ChangeDataStatusModal";

function UserList({ loggedInUserData }) {
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

    const getListOfUsersQuery = useQuery({
        queryKey: ["users"],
        queryFn: () => getAllUsers({ status: ["deactive", "pending"] }),
    });
    console.log("users list: ", getListOfUsersQuery?.data?.data);

    useEffect(() => {
        if (getListOfUsersQuery?.isError) {
            console.log("Error fetching List of Users:", getListOfUsersQuery?.error);
            getListOfUsersQuery?.error?.response?.data?.message ? toast.error(getListOfUsersQuery?.error?.response?.data?.message) : !getListOfUsersQuery?.error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occurred Please Contact Admin");
        }
    }, [getListOfUsersQuery?.isError]);

    const [deleteUserMutationIsLoading, setDeleteUserMutationIsLoading] = useState(false);
    console.log("🚀 ~ ListRecords ~ deleteUserMutationIsLoading:", deleteUserMutationIsLoading);

    const deleteUserMutation = useMutation({
        mutationFn: deleteUserById,
        onSuccess: (data) => {
            queryClient.resetQueries(["users"]);
            setLoading(false);
            setDeleteUserMutationIsLoading(false);
            console.log("deleted user successfully: ");
        },
        onError: (error) => {
            console.log("The error is: ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occurred Please Contact Admin");
            setLoading(false);
            setDeleteUserMutationIsLoading(false);
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

    const confirmDelete = (deleteUserId) => {
        if (deleteUserId !== null) {
            console.log("Ohh Yea delete User Id Not Null");
            deleteUserMutation.mutate(deleteUserId);
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
        {
            title: "Role",
            field: "role",
        },
        {
            title: "NIN Number",
            field: "nin_no",
            hidden: true,
        },

        // {
        //     title: "Date of Birth",
        //     field: "dateOfBirt",
        //     render: (rowData) => (rowData.dateOfBirth ? moment(rowData.dateOfBirth).format("YYYY-MM-DD HH:mm:ss") : "No Date Of Birth"),
        // },
        {
            title: "Date of Birth",
            field: "dateOfBirth", // Corrected the typo here
            render: (rowData) => (rowData.dateOfBirth ? moment(rowData.dateOfBirth).format("YYYY-MM-DD") : "No Date Of Birth"), // Updated the date format
            hidden: true,
        },
        {
            title: "Phone Number",
            field: "phone_number",
            hidden: true,
        },
        {
            title: "Agreed to Terms",
            field: "agree_to_terms",
            render: (rowData) => {
                return rowData.agree_to_terms ? "Yes" : "No";
            },
            hidden: true,
        },
        {
            title: "Vendor",
            field: "vendors.vendor.name",
            render: (rowData) => {
                return rowData?.vendors?.vendor ? rowData?.vendors?.vendor?.name : "N/A";
            },
            hidden: true,
        },
        {
            title: "Status",
            field: "status",
            render: (rowData) => {
                const status = (rowData.status || "unknown").toLowerCase(); // Normalize the status to lowercase
                let color = "primary";
                if (status === "active") color = "success";
                else if (status === "deactive") color = "danger";

                return <Tag value={status.charAt(0).toUpperCase() + status.slice(1)} severity={color} />;
            },
        },
        {
            title: "lastlogin",
            field: "lastlogin",
            hidden: true,
        },
        {
            title: "Photo",
            field: "photo_url",
            render: (rowData) => {
                return rowData.photo_url ? <Image src={`${process.env.REACT_APP_API_BASE_URL}${rowData.photo_url}`} alt={rowData.name} width="100" preview style={{ verticalAlign: "middle" }} /> : <div>No Image</div>;
            },
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
            <Panel header="Manage Account Status" style={{ marginBottom: "20px" }}>
                <div>
                    <div xs={12}>
                        {/* <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            {loggedInUserData?.permissions?.includes("create user") && (
                                <div>
                                    <div md={12} className="text-end">
                                        <Button onClick={() => handleShowUserForm()}>Add user</Button>
                                    </div>
                                </div>
                            )}
                        </div> */}
                        <div>
                            <div>
                                <MuiTable
                                    tableTitle="Users"
                                    tableData={getListOfUsersQuery?.data?.data}
                                    tableColumns={columns}
                                    handleShowEditForm={handleShowEditForm}
                                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                                    showEdit={false}
                                    showDelete={false}
                                    loading={loading || getListOfUsersQuery.isLoading || getListOfUsersQuery.status == "loading"}
                                    // change data status
                                    showDataChangeStatus={true}
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
                                <UserDetailsPage user={userDetail} showModal={userDetailShowModal} handleCloseModal={handleCloseuserDetailModal} />
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

export default UserList;
