import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import moment from "moment";
import { Image } from "primereact/image";
import "primeicons/primeicons.css"; // Ensure PrimeIcons are imported for use
import { Tag } from "primereact/tag";

function UserDetailsPage({ user, showModal, handleCloseModal }) {
    function getStatusSeverity(status) {
        const normalizedStatus = (status || "unknown").toLowerCase();
        switch (normalizedStatus) {
            case "active":
                return "success";
            case "deactive":
                return "danger";
            default:
                return "primary";
        }
    }

    console.log("userDetail xxxxxx : ", user);
    return (
        <Dialog header="Bio Data" visible={showModal} onHide={handleCloseModal} maximizable modal>
            <div style={{ margin: "1rem" }}>
                <Panel header="Bio" toggleable>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-6">
                            <strong>Name:</strong> {user?.name}
                        </div>
                        <div className="p-col-12 p-md-6">
                            <strong>Email:</strong> {user?.email}
                        </div>
                        <div className="p-col-12 p-md-6">
                            <strong>Status:</strong> <Tag value={user?.status} severity={getStatusSeverity(user?.status)} />
                        </div>
                        <div className="p-col-12">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <strong>Profile Photo:</strong>
                                {user?.photo_url ? <Image src={`${process.env.REACT_APP_API_BASE_URL}${user?.photo_url}`} alt="User profile" width="100" preview /> : <p>No Photo</p>}
                            </div>
                        </div>

                        <div className="p-col-12 p-md-6">
                            <strong>Last Login:</strong> {user?.lastlogin}
                        </div>
                        <div className="p-col-12 p-md-6">
                            <strong>NIN Number:</strong> {user?.nin_no}
                        </div>
                        <div className="p-col-12 p-md-6">
                            <strong>Date of Birth:</strong> {user?.dateOfBirth ? moment(user?.dateOfBirth).format("YYYY-MM-DD") : "No Date Of Birth"}
                        </div>
                        <div className="p-col-12 p-md-6">
                            <strong>Phone Number:</strong> {user?.phone_number}
                        </div>
                        <div className="p-col-12 p-md-6">
                            <strong>Agreed to Terms:</strong> {user?.agree_to_terms ? "Yes" : "No"}
                        </div>
                    </div>
                </Panel>
            </div>
            <div style={{ margin: "1rem" }}>
                <Panel header="Work Details" toggleable>
                    <div className="p-field">
                        <strong>Vendor:</strong> {user?.vendors ? user?.vendors?.vendor?.name : "N/A"}
                    </div>
                </Panel>
            </div>
            <div style={{ margin: "1rem" }}>
                <Panel header="Additional Information" toggleable>
                    <div className="p-field">
                        <strong>Created At:</strong> {moment(user?.created_at).format("MMMM Do, YYYY, h:mm:ss A")}
                    </div>
                </Panel>
            </div>

            {/* <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <Button label="Close" icon="pi pi-times" onClick={handleCloseModal} className="p-button-outlined p-button-secondary" />
            </div> */}
        </Dialog>
    );
}

export default UserDetailsPage;
