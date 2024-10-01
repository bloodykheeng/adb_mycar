import React from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";

import UserList from "./users/UserList";
import CarApprovalPage from "./cars/ApprovalPage";

const ApprovalsPage = ({ loggedInUserData }) => {
    return (
        <div style={{ width: "100%" }}>
            <Panel header="Approvals" style={{ marginBottom: "20px" }}>
                <div className="p-grid p-justify-center">
                    <div className="p-col-12 p-md-10">
                        <TabView>
                            <TabPanel
                                header="User Accounts"
                                // leftIcon="pi pi-user"
                            >
                                <UserList loggedInUserData={loggedInUserData} />
                            </TabPanel>
                            <TabPanel
                                header="Cars Inspection Reports"
                                // leftIcon="pi pi-car"
                            >
                                <CarApprovalPage loggedInUserData={loggedInUserData} />
                            </TabPanel>
                            {/* <TabPanel
                                header="Spare Parts"
                                // leftIcon="pi pi-cog"
                            >
                                <Card title="Spare Parts" subTitle="Pending Approvals">
                                    <p>List of spare parts pending approval.</p>
                                 
                                </Card>
                            </TabPanel> */}
                        </TabView>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default ApprovalsPage;
