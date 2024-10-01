import React, { useEffect, useState } from "react";

import { getAllPermissions } from "../../../../services/permissions/permission-service";

import WaterIsLoading from "../../../../components/general_components/WaterIsLoading";
import moment from "moment";
import { Link } from "react-router-dom";
import MuiTable from "../../../../components/general_components/MuiTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

function PermissionsList() {
    let tableId = 0;
    const columns = [
        {
            title: "#",
            width: "5%",
            field: "id",
            render: (rowData) => {
                console.log("rowData : ", rowData);
                tableId = rowData.tableData.index;
                ++tableId;
                return <div>{tableId}</div>;
            },
        },
        {
            title: "Permission",
            field: "name",
            cellStyle: {
                whiteSpace: "nowrap",
                padding: "8px",
            },
            render: (rowData) => {
                return <div>{rowData.name}</div>;
            },
        },
        {
            title: "Guard Name",
            field: "guard_name",
        },
    ];

    const getListOfPermissions = useQuery(["userspermissions"], getAllPermissions);
    console.log("getListOfPermissions : ", getListOfPermissions);
    return (
        <div>
            <div>
                <MuiTable tableTitle="Permissions" tableData={getListOfPermissions?.data?.data} tableColumns={columns} loading={getListOfPermissions.isLoading || getListOfPermissions.status == "loading"} />
                {(getListOfPermissions.isLoading || getListOfPermissions.status == "loading") && <WaterIsLoading />}
            </div>
        </div>
    );
}

export default PermissionsList;
