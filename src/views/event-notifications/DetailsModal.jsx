import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import moment from "moment";
import { Image } from "primereact/image";
import "primeicons/primeicons.css"; // Ensure PrimeIcons are imported for use

function DetailsModal({ user, showModal, handleCloseModal }) {
    console.log("userDetail xxxxxx : ", user);
    return (
        <Dialog header="Bio Data" visible={showModal} onHide={handleCloseModal} maximizable modal>
            <div style={{ margin: "1rem" }}>
                {" "}
                <Panel header="Bio" toggleable>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-6">
                            <strong>Name:</strong> {user?.name}
                        </div>

                        <div className="p-col-12 p-md-6">
                            <strong>Email:</strong> {user?.email}
                        </div>

                        <div className="p-col-12 p-md-6">
                            <strong>Status:</strong> {user?.status}
                        </div>

                        <div className="p-col-12">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <strong>Profile Photo:</strong>
                                <Image src={`${process.env.REACT_APP_API_BASE_URL}${user?.photo_url}`} alt="User profile" width="100" preview />
                            </div>
                        </div>

                        <div className="p-col-12 p-md-6">
                            <strong>Last Login:</strong> {user?.lastlogin}
                        </div>
                    </div>
                </Panel>
            </div>
            <div style={{ margin: "1rem" }}>
                {" "}
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

export default DetailsModal;
