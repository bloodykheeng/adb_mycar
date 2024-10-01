import React from "react";
import ListPage from "./ListPage.js";
function ApprovalPage({ loggedInUserData, selectedCarData }) {
    return <ListPage loggedInUserData={loggedInUserData} selectedCarData={selectedCarData} />;
}

export default ApprovalPage;
