import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";

import { deletePermissionFromRole } from "../../../../../services/roles/roles-service";

import WaterIsLoading from "../../../../../components/general_components/WaterIsLoading";
import MuiTable from "../../../../../components/general_components/MuiTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import RolesPermissionForm from "./widgets/RolesPermissionForm";
import { toast } from "react-toastify";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use the ConfirmDialog component
import { confirmDialog } from "primereact/confirmdialog"; // To use the confirmDialog method

function RolesPermissionList({ permissions = [], roleName, roleId, handleCloseModal }) {
    const queryClient = useQueryClient();
    const [subCounty, setSubcounty] = useState([]);

    const [showAddForm, setShowAddForm] = useState(false);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onFormClose = () => {
        setShowAddForm(false);
    };

    const deletePermissionFromRoleMutation = useMutation(deletePermissionFromRole, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["roles"]);
            queryClient.invalidateQueries(["usersroles"]);
            queryClient.invalidateQueries(["permissions", "getPermissionNotInCurrentRole"]);
            toast.success("Permission Deleted Successfully");
            setLoading(false);
            handleCloseModal();
        },
        onError: (err) => {
            toast.error("An Error Occured While Deleting Permission");
            let message = "An error occurred!";
            setMessage(message);
            setLoading(false);
        },
    });

    //
    const confirmDelete = (event, id) => {
        confirmDialog({
            message: "Are you sure you want to delete?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => handleDelete(event, id),
            reject: () => {}, // You can add some code here if needed when rejection
        });
    };

    const handleDelete = async (event, id) => {
        // var result = window.confirm("Are you sure you want to delete? ");

        setLoading(true);
        // takes in role_id;
        // permission_id;
        let item = {
            role_id: roleId,
            permission_id: id,
        };
        deletePermissionFromRoleMutation.mutate(item);
    };

    let tableId = 0;
    const columns = [
        {
            title: "#",
            field: "name",
            width: "5%",
            render: (rowData) => {
                tableId = rowData.tableData.index + 1;

                return <div>{tableId}</div>;
            },
        },
        {
            title: "Name",
            field: "name",
            cellStyle: {
                whiteSpace: "nowrap",
                padding: "8px",
            },
        },
        {
            title: "Guard Name",
            field: "guard_name",
        },
        {
            title: "Date",
            field: "created_at",
            hidden: true,
            render: (rowData) => moment(rowData.created_at).format("lll"),
        },
    ];

    console.log("sub county is : ", subCounty);
    return (
        <div>
            <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                {/* {loggedInUserData?.permissions?.includes("add users") && ( */}
                <div>
                    <div md={12} className="text-end">
                        <Button onClick={() => setShowAddForm(true)}>Add Permission</Button>
                        {<RolesPermissionForm handleCloseParentModal={handleCloseModal} roleId={roleId} show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} permissions={permissions} />}
                    </div>
                </div>
                {/* )} */}
            </div>

            <div>
                <MuiTable tableTitle={`${roleName} Permissions`} tableData={permissions} tableColumns={columns} handleDelete={(e, item_id) => confirmDelete(e, item_id)} showDelete={true} loading={loading || deletePermissionFromRoleMutation.isLoading} />

                {(loading || deletePermissionFromRoleMutation.isLoading) && <WaterIsLoading />}
            </div>

            {/* <ConfirmDialog /> */}
        </div>
    );
}

export default RolesPermissionList;
