import React from "react";
import ListPage from "./ListPage";
import { Link } from "react-router-dom";

import BreadcrumbNav from "../../../components/general_components/BreadcrumbNav";

const createBreadCrump = () => {};
//
function CarReportPage({ loggedInUserData, selectedCarData }) {
    let linksData = [{ name: "programs" }];
    return (
        <div>
            {/* <BreadcrumbNav /> */}

            <ListPage loggedInUserData={loggedInUserData} selectedCarData={selectedCarData} />
        </div>
    );
}

export default CarReportPage;
