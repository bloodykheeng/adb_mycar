import React from "react";
import moment from "moment";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";

function InspectionReportPrint({ selectedItem, selectedUtilityData, ...props }) {
    // Helper function to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "UGX" }).format(value);
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        return moment(dateString).format("MMMM Do YYYY, h:mm:ss a");
    };

    // Inline styles
    const tableHeaderStyle = {
        backgroundColor: "#00B9E8",
        color: "white",
        padding: "10px",
        textAlign: "left",
    };

    const tableCellStyle = {
        padding: "10px",
    };

    const cardStyle = {
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
    };

    const cardTitleStyle = {
        fontWeight: "bold",
        marginBottom: "10px",
    };

    // Inline styles
    const tableStyle = {
        width: "100%",
        marginBottom: "20px",
        borderCollapse: "collapse",
    };

    const thStyle = {
        backgroundColor: "#00B9E8",
        color: "white",
        padding: "10px",
        textAlign: "left",
        border: "1px solid #ddd",
    };

    const tdStyle = {
        padding: "10px",
        border: "1px solid #ddd",
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr", // This creates two columns of equal width
        gridGap: "1rem", // Space between the columns
    };

    // Function to display status with color using Tag
    const tagStatus = (status) => {
        let severity;
        switch (status) {
            case "pending approval":
                severity = "info"; // blue
                break;
            case "approved":
                severity = "success"; // green
                break;
            case "pending":
                severity = "warning"; // orange
                break;
            case "rejected":
                severity = "danger"; // red
                break;
            default:
                severity = "secondary"; // grey or default
        }
        return <Tag severity={severity} value={status?.charAt(0)?.toUpperCase() + status?.slice(1)} />;
    };

    // Function to display status with color
    const statusWithColor = (status) => {
        let color;
        switch (status) {
            case "pending approval":
                color = "blue";
                break;
            case "approved":
                color = "green";
                break;
            case "pending":
                color = "orange";
                break;
            case "rejected":
                color = "red";
                break;
            default:
                color = "grey";
        }
        return <span style={{ color }}>{status?.charAt(0)?.toUpperCase() + status?.slice(1)}</span>;
    };
    return (
        <div style={{ backgroundColor: "white" }}>
            {/* Ministry Logo */}
            <div style={{ display: "flex", gap: "1rem", textAlign: "center", alignItems: "center", justifyContent: "center", margin: "1rem", width: "100%" }}>
                <img src="/assets/layout/images/mycarclassic.png" alt="MYCAR" style={{ width: "100px", height: "auto" }} />{" "}
                <span className=" ml-2">
                    <span>MYCAR</span> <br /> <span>Car Inspection Report</span>
                </span>
            </div>

            {/* Budget Details */}
            <div style={cardStyle}>
                <div style={cardTitleStyle}>Report Details</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="flex flex-wrap" style={{ justifyContent: "space-between", width: "100%" }}>
                        {/* Column 1 */}
                        <div style={{ width: "50%", padding: "0.5rem" }}>
                            <p>
                                <strong>Car Name:</strong> {selectedItem?.car?.name || "N/A"}
                            </p>
                            <p>
                                <strong>Report Title:</strong> {selectedItem?.name || "N/A"}
                            </p>
                        </div>

                        {/* Full Width Row for Description */}
                        <div style={{ width: "100%", padding: "0.5rem" }}>
                            <p>
                                <strong>Approval Status:</strong> {selectedItem?.spatie_current_status?.name || "N/A"}
                            </p>
                            <p>
                                <strong>Approval Comment:</strong> {selectedItem?.spatie_current_status?.reason || "N/A"}
                            </p>
                        </div>
                        <div style={{ width: "100%", padding: "0.5rem" }}>
                            <strong>Description:</strong>
                            <p>{selectedItem?.details}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div style={cardStyle}>
                <div style={cardTitleStyle}>Categories and Fields</div>
                {selectedItem?.car_inspection_report_category?.map((category, index) => (
                    <div key={index} style={{ marginBottom: "1rem" }}>
                        <div style={cardTitleStyle}>{`Category: ${category.inspection_field_category.name}`}</div>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Field Name</th>
                                    <th style={thStyle}>Field Value</th>
                                    {/* Uncomment and add more <th> here if needed */}
                                    {/* <th style={thStyle}>Field Status</th>
                <th style={thStyle}>Created By</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {category.fields.map((field, fieldIndex) => (
                                    <tr key={fieldIndex}>
                                        <td style={tdStyle}>{field.inspection_field.name}</td>
                                        <td style={tdStyle}>{field.value}</td>
                                        {/* More <td> cells can be added here as needed */}
                                        {/* <td style={tdStyle}>{field.inspection_field.status}</td>
                  <td style={tdStyle}>{field.creator.name}</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <div style={cardStyle}>
                <p>
                    <strong>Created By:</strong> {selectedItem?.creator?.name} at {formatDate(selectedItem?.created_at)}
                </p>
                {/* <p>
                    <strong>Updated By:</strong> {selectedItem?.updated_by_user?.name} at {formatDate(selectedItem?.updated_at)}
                </p> */}
            </div>
        </div>
    );
}

export default InspectionReportPrint;
