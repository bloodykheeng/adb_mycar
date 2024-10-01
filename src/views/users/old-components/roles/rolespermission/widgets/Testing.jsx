import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getPermissionNotInCurrentRole } from "../../../../../services/permissions/permission-service";
import { addPermissionsToRole } from "../../../../../services/roles/roles-service";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import setFieldTouched from "final-form-set-field-touched";

function RolesPermissionForm({ roleId, handleMutation, permissions, ...props }) {
    const [newPermissions, setNewPermissions] = useState([]);
    const [permissionsNotInRole, setPermissionsNotInRole] = useState();

    const queryClient = useQueryClient();
    const permissionsData = useQuery(["permissions", "getPermissionNotInCurrentRole"], () => getPermissionNotInCurrentRole(roleId), {
        onSuccess: (data) => {
            setPermissionsNotInRole(data?.data);
        },
        onError: (error) => {
            console.log("There was an error getPermissionNotInCurrentRole : ", error);
        },
    });

    const addPermissionsToRoleMutation = useMutation((data) => addPermissionsToRole(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["roles"]);
            queryClient.invalidateQueries(["usersroles"]);
            queryClient.invalidateQueries(["permissions", "getPermissionNotInCurrentRole"]);
            props.onClose();
            toast.success("Permissions Attached Successfully");
        },
        onError: (err) => {
            toast.error("There Was An Error Attaching Permissions");
        },
    });

    const handleAddPermission = (formData) => {
        // Logic to handle permission addition
    };

    const handleSubmit = (values) => {
        // Logic to handle form submission
    };

    return (
        <Dialog header="Add A Permission" visible={props.visible} style={{ width: "50vw" }} modal onHide={props.onHide}>
            <div>
                <p>Choose A Permission</p>
                <Form
                    onSubmit={handleSubmit}
                    mutators={{ setFieldTouched }}
                    render={({ handleSubmit, form, submitting, values }) => (
                        <form onSubmit={handleSubmit}>
                            <Field name="permissionId">
                                {({ input, meta }) => (
                                    <div>
                                        <label htmlFor="permissionSelect">Permission</label>
                                        <Dropdown {...input} options={permissionsNotInRole} optionLabel="name" placeholder="Select a permission" />
                                    </div>
                                )}
                            </Field>

                            <Button label="Add" icon="pi pi-plus" onClick={() => handleAddPermission(values)} disabled={submitting} className="p-button-secondary" />

                            <Button label="Save" type="submit" className="p-button-primary" disabled={submitting} />

                            {(permissions?.length || newPermissions.length) > 0 && (
                                <DataTable value={newPermissions}>
                                    <Column field="name" header="Name"></Column>
                                    <Column
                                        body={(rowData) => (
                                            <Button
                                                icon="pi pi-times"
                                                className="p-button-danger"
                                                // Add logic to handle permission removal
                                            />
                                        )}
                                        header="Action"
                                    ></Column>
                                </DataTable>
                            )}
                        </form>
                    )}
                />
            </div>
        </Dialog>
    );
}

export default RolesPermissionForm;
