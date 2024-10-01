import React, { useState, useEffect } from "react";
import { Spinner, Button, Form, Col, Row, FloatingLabel, Modal } from "react-bootstrap";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getPermissionNotInCurrentRole } from "../../../../../services/permissions/permission-service";
import { toast } from "react-toastify";
import { addPermissionsToRole } from "../../../../../services/roles/roles-service";

function RolesPermissionForm({ roleId, handleMutation, permissions, ...props }) {
    const queryClient = useQueryClient();
    const [validated, setValidated] = useState(false);
    const [newPermissions, setNewPermissions] = useState([]);
    const [permissionsNotInRole, setPermissionsNotInRole] = useState();

    const [formData, setFormData] = useState({
        permissionId: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    //
    const addPermissionsToRoleMutation = useMutation((data) => addPermissionsToRole(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["roles"]);
            queryClient.invalidateQueries(["usersroles"]);
            queryClient.invalidateQueries(["permissions", "getPermissionNotInCurrentRole"]);
            props.onClose();
            props.handleCloseParentModal();
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

    //
    const handleAddPermission = () => {
        const getPermissionDetail = permissionsData?.data?.data?.find((item) => item.id == formData.permissionId);

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

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Add A Permission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Choose A Permission</p>
                <Form validated={validated} onSubmit={handleSubmit}>
                    <Row className="gx-3 gy-3">
                        <Col md="12">
                            <FloatingLabel controlId="floatingInput" label="Permission" className="">
                                <Form.Select aria-label="select Permission" value={formData?.permissionId} onChange={handleInputChange} name="permissionId" required>
                                    <option value="">None</option>
                                    {permissionsData?.data?.data?.map((permission) => (
                                        <option value={permission.id}>{permission.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">Please select a permission.</Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                        {formData.permissionId && (
                            <Col md="12" className="d-grid gap-2">
                                <Button variant="secondary" onClick={() => handleAddPermission()} disabled={addPermissionsToRoleMutation.isLoading}>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </Button>
                            </Col>
                        )}

                        <Col md="12" className="d-grid gap-2">
                            <Button disabled={addPermissionsToRoleMutation.isLoading} variant="primary" type="submit" size="md">
                                Save
                            </Button>
                            {addPermissionsToRoleMutation.isLoading && <h5>Loading...</h5>}
                        </Col>
                    </Row>
                </Form>
                {(permissions?.length || newPermissions.length) > 0 && (
                    <table className="table table-striped ">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Name</th>
                                {newPermissions?.length > 0 && <th scope="col">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions?.map((permission) => (
                                <tr key={permission.id}>
                                    <td>{permission.name}</td>
                                    <td></td>
                                </tr>
                            ))}
                            {newPermissions?.map((permission) => (
                                <tr key={permission.id}>
                                    <td>{permission.name}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleCancel(permission.id)}>
                                            <i className="fa fa-times" aria-hidden="true"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default RolesPermissionForm;
