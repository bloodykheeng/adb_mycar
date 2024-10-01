import React from "react";
import ListPage from "./ListPage";
import { Link } from "react-router-dom";

// import BreadcrumbNav from "../../../components/general_components/BreadcrumbNav";

const createBreadCrump = () => {};
//
function CarWahOrdersPage({ loggedInUserData, selectedParentItem }) {
    return (
        <div>
            {/* <BreadcrumbNav /> */}

            <ListPage selectedParentItem={selectedParentItem} loggedInUserData={loggedInUserData} />
        </div>
    );
}

export default CarWahOrdersPage;
