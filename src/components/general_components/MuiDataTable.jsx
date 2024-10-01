import React from "react";
import MUIDataTable from "mui-datatables";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";

// bk always remenber the stacked only works if there is a form control in the return  <FormControl></FormControl>

const MuiDataTable = ({ tableTitle, loading, tableData, tableColumns, handleViewPage = () => {}, handleShowEditForm = () => {}, handleDelete = () => {}, showViewPage, showEdit, showDelete }) => {
    // Dynamically adding the Actions column
    const columns = tableColumns.concat({
        name: "Actions",
        label: "Actions",
        options: {
            filter: false,
            sort: false,
            empty: true,

            customBodyRenderLite: (dataIndex) => {
                const dataRow = tableData[dataIndex];
                return (
                    <div>
                        {showViewPage && (
                            <IconButton onClick={() => handleViewPage(dataRow)}>
                                <VisibilityIcon />
                            </IconButton>
                        )}
                        {showEdit && (
                            <IconButton onClick={() => handleShowEditForm(dataRow)}>
                                <EditIcon />
                            </IconButton>
                        )}
                        {showDelete && (
                            <IconButton onClick={() => handleDelete(dataRow)}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                        {/* ... Any other actions */}
                    </div>
                );
            },
        },
    });

    const options = {
        filterType: "checkbox",
        responsive: "simple",
        selectableRows: "none", // set to 'multiple' if selection is needed
        textLabels: {
            body: {
                noMatch: loading ? (
                    <div style={{ zIndex: 1000 }}>
                        <CircularProgress />
                    </div>
                ) : (
                    "No Data Found"
                ),
            },
        },
    };

    return (
        <>
            <FormControl></FormControl>

            <MUIDataTable title={tableTitle} data={tableData} columns={columns} options={options} />
        </>
    );
};

export default MuiDataTable;
