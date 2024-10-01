import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import moment from "moment";
import RolesPermissionList from "./rolespermission/RolesPermissionList";
import "./modalstyles.css";

function RolesPermissionModal({ permissions = [], showModal, handleCloseModal, roleName, roleId }) {
    console.log("Permission Details: ", permissions);

    const footer = (
        <div>
            <Button label="Close" className="p-button-text" onClick={handleCloseModal} />
        </div>
    );

    return (
        <Dialog header="Permissions" visible={showModal} modal onHide={handleCloseModal} footer={footer} maximizable={true}>
            <div>
                <RolesPermissionList roleId={roleId} permissions={permissions} roleName={roleName} handleCloseModal={handleCloseModal} />
            </div>
        </Dialog>
    );
}

export default RolesPermissionModal;
