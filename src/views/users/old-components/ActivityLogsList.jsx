import React, { useEffect, useState } from "react";

import { getAllActivityLogs, deletActivityLogById } from "../../../services/activity-logs/activity-logs-service.js";
import EditForm from "./EditForm";
import UserForm from "./UserForm";
import WaterIsLoading from "../../../components/general_components/WaterIsLoading";
import moment from "moment";
import { Link } from "react-router-dom";
import MuiTable from "../../../components/general_components/MuiTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import UserDetailsPage from "./UserDetailsPage";
import { toast } from "react-toastify";

function ActivityLogsList({ loggedInUserData }) {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [userDetail, setUserDetail] = useState();

    const getListOfAllActivityLogs = useQuery(["activityLogs"], getAllActivityLogs, {
        onError: (err) => {
            console.log("The error is : ", err);
            toast.error("An error occurred while fetching users!");
            setLoading(false);
        },
    });
    console.log("getListOfAllActivityLogs list : ", getListOfAllActivityLogs?.data?.data);

    const deleteActivityLogMutation = useMutation(deletActivityLogById, {
        onSuccess: (data) => {
            queryClient.resetQueries(["activityLogs"]);
            setLoading(false);
            console.log("activityLogs user succesfully ooooo: ");
        },
        onError: (err) => {
            console.log("The error is : ", err);
            toast.error("An error occurred!");
            setLoading(false);
        },
    });

    const handleDelete = async (event, id) => {
        console.log("activity log is xxxxx : ", id);
        var result = window.confirm("Are you sure you want to delete ? ");
        if (result === true) {
            setLoading(true);
            deleteActivityLogMutation.mutate(id);
        }
    };

    let tableId = 0;
    const columns = [
        {
            title: "#",
            width: "5%",
            field: "id",
        },
        {
            title: "Description",
            field: "description",
            render: (rowData) => {
                return <div style={{}}>{rowData.description}</div>;
            },
        },
        {
            title: "Date",
            field: "created_at",
            render: (rowData) => moment(rowData.created_at).format("lll"),
        },
    ];

    return (
        <div style={{ width: "100%", minHeight: "100vh", padding: "1rem" }}>
            <div>
                <div xs={12}>
                    <div>
                        <div>
                            <MuiTable
                                tableTitle="Activity Logs"
                                tableData={getListOfAllActivityLogs?.data?.data}
                                tableColumns={columns}
                                // handleShowEditForm={handleShowEditForm}
                                handleDelete={(e, item_id) => handleDelete(e, item_id)}
                                // showEdit={loggedInUserData?.permissions?.includes("edit users")}
                                showDelete={loggedInUserData?.permissions?.includes("delete users")}
                                loading={loading || getListOfAllActivityLogs.isLoading || getListOfAllActivityLogs.status == "loading" || deleteActivityLogMutation.isLoading}
                            />

                            {(getListOfAllActivityLogs.isLoading || getListOfAllActivityLogs.status == "loading" || deleteActivityLogMutation.isLoading) && <WaterIsLoading />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityLogsList;
