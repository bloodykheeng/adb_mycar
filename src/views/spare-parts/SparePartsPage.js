import React from "react";
import ListPage from "./ListPage";
import { Link } from "react-router-dom";

// import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";

const createBreadCrump = () => {};
//
function SparePartsPage({ loggedInUserData }) {
    return (
        <div>
            {/* <BreadcrumbNav /> */}

            <ListPage loggedInUserData={loggedInUserData} />
        </div>
    );
}

export default SparePartsPage;
