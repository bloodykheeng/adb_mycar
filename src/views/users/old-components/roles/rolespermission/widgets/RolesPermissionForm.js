import React, { useState, useEffect } from "react";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getPermissionNotInCurrentRole } from "../../../../../../services/permissions/permission-service";
import { toast } from "react-toastify";
import { addPermissionsToRole } from "../../../../../../services/roles/roles-service";
import { Form, Field } from "react-final-form";
import setFieldTouched from "final-form-set-field-touched";
import { ProgressSpinner } from "primereact/progressspinner";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function RolesPermissionForm({ roleId, handleMutation, permissions, ...props }) {
    const queryClient = useQueryClient();
    const [validated, setValidated] = useState(false);
    const [newPermissions, setNewPermissions] = useState([]);
    const [permissionsNotInRole, setPermissionsNotInRole] = useState();

    console.log("new permissions : ", newPermissions);

    const [formData, setFormData] = useState({
        permissionId: "",
    });

    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setFormData({ ...formData, [name]: value });
    // };

    const handleInputChange = (e) => {
        setFormData({ ...formData, permissionId: e.value?.id, data: e.value });
    };

    //
    const addPermissionsToRoleMutation = useMutation((data) => addPermissionsToRole(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["roles"]);
            queryClient.invalidateQueries(["usersroles"]);
            queryClient.invalidateQueries(["permissions", "getPermissionNotInCurrentRole"]);
            props.onClose();
            // props.handleCloseParentModal();
            toast.success("Permissions Attached Succesfully");
            console.log("data : ..... ", data);
        },
        onError: (err) => {
            toast.error("There Was An Error Attaching Permissions");
        },
    });

    //
    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity()) {
            // Form is valid, handle submission logic here
            if (newPermissions.length < 1) {
                toast.warning("First Add Some New Permissions");
            } else {
                let permissionIds = newPermissions.map((item) => item.id);
                let item = {
                    role_id: roleId,
                    permission_ids: permissionIds,
                };
                console.log("nnnmnmnmmnn item : ", item);
                addPermissionsToRoleMutation.mutate(item);
            }
        }

        setValidated(true);
    };

    //
    const permissionsData = useQuery(["permissions", "getPermissionNotInCurrentRole"], () => getPermissionNotInCurrentRole(roleId), {
        onSuccess: (data) => {
            setPermissionsNotInRole(data?.data);
        },
        onError: (error) => {
            console.log("There was an error getPermissionNotInCurrentRole : ", error);
        },
    });

    //
    const handleCancel = (id) => {
        const newlist = newPermissions?.filter((item) => item.id !== id);
        setNewPermissions(newlist);
    };

    console.log("new permissions permissionsData : ", permissionsData?.data?.data);
    console.log("new permissions formData : ", formData);
    //
    const handleAddPermission = (e) => {
        e.preventDefault();
        const getPermissionDetail = permissionsData?.data?.data?.find((item) => item.id == formData.permissionId);

        if (!getPermissionDetail) {
            toast.error("Selected permission is not found.");
            return; // Stop the function if no permission detail is found
        }

        const doesItExistInOldPermission = permissions.find((item) => item.id == formData.permissionId);

        const doesItExistInNewPermission = newPermissions.find((item) => item.id == formData.permissionId);

        if (!doesItExistInOldPermission && !doesItExistInNewPermission) {
            setNewPermissions((oldData) => {
                if (Array.isArray(oldData)) {
                    return [...oldData, getPermissionDetail];
                } else {
                    return [getPermissionDetail];
                }
            });
            toast("Permission added successfully");
            console.log("Permission added successfully.");
        } else {
            console.log("Permission not found.");
            toast.warning("permission already exists");
        }
    };

    //
    // Dialog footer for actions
    const dialogFooter = (
        <div>
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} disabled={addPermissionsToRoleMutation.isLoading} />
            {/* Other buttons if needed */}
        </div>
    );

    // DataTable action body template
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-times" className="p-button-danger" onClick={() => handleCancel(rowData.id)} />
            </React.Fragment>
        );
    };

    return (
        <Dialog
            header="Add A Permission"
            visible={props?.show}
            modal
            onHide={props?.onClose}
            header="Permissions"
            style={{ width: "50vw" }} // You can adjust the width as needed
            maximizable={true}
            footer={dialogFooter}
        >
            <form onSubmit={handleSubmit}>
                <p>Choose A Permission</p>
                <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "2rem", marginBottom: "2rem" }}>
                    <Dropdown
                        value={formData.data}
                        options={permissionsData?.data?.data}
                        onChange={handleInputChange}
                        placeholder="Select a Permission"
                        optionLabel="name" // assuming your permissions have a 'name' property
                    />
                    {formData.permissionId && <Button label="Add Permission" icon="pi pi-plus" onClick={handleAddPermission} className="p-button-secondary" disabled={addPermissionsToRoleMutation.isLoading} />}
                </div>

                {addPermissionsToRoleMutation.isLoading && (
                    <div style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
                        <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" />
                    </div>
                )}

                {/* Table or list to display the permissions */}

                {/* New Permissions Table */}
                {newPermissions?.length > 0 && (
                    <DataTable value={newPermissions} responsiveLayout="scroll">
                        <Column field="name" header="Name"></Column>
                        <Column body={(rowData) => <Button icon="pi pi-times" className="p-button-danger" onClick={() => handleCancel(rowData.id)} />} header="Action"></Column>
                    </DataTable>
                )}
                {/* Existing Permissions Table */}
                {permissions?.length > 0 && (
                    <DataTable value={permissions} responsiveLayout="scroll">
                        <Column field="name" header="Name"></Column>
                        <Column header="Action"></Column> {/* Empty column for alignment */}
                    </DataTable>
                )}
            </form>
        </Dialog>
    );
}

export default RolesPermissionForm;
