import React, { useRef } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import moment from "moment"; // Import moment
import { Tag } from "primereact/tag";

import InspectionReportPrint from "./InspectionReportPrint";
import { useReactToPrint } from "react-to-print";
import { Button } from "primereact/button";
import PrinterOutlined from "@mui/icons-material/PrintOutlined";
import { ProgressBar } from "primereact/progressbar";

function InspectionReportPdfModal({ selectedItem, selectedUtilityData, ...props }) {
    console.log("selected item in SubProjectPerfomanceReportPdfModal : ", selectedItem);

    const componentRef = useRef();

    // Function to format date using moment
    const formatDate = (dateString) => {
        return moment(dateString).format("MMMM Do YYYY, h:mm:ss a"); // Example format
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

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr", // This creates two columns of equal width
        gridGap: "1rem", // Space between the columns
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Report", // Set the document title as a string
        pageStyle: `
        @page { size: A4; margin: 1cm; }
        @media print {
          body { -webkit-print-color-adjust: exact; }
          div#print-content { height: 100%; }
          .header, .footer { background-color: transparent !important; } // Assuming .header and .footer are the classes for your header and footer
          img { display: block; margin: 0 auto; } // Center the image, if necessary
        }
      `,
    });

    // Remember to store the original title to reset it later
    const originalTitle = document.title;

    return (
        <Dialog
            header={
                <div>
                    <div>Car Inspection Report.</div>

                    {/* <div>
                        <strong>Subproject Name : </strong>
                        {selectedItem?.subproject?.name}
                    </div> */}
                </div>
            }
            visible={props.show}
            style={{ minWidth: "80vw" }}
            onHide={props.onHide}
            maximizable
        >
            {/* Status Information */}
            <Card title="Report Details" style={{ marginBottom: "1rem" }}>
                <div className="flex flex-wrap" style={{ justifyContent: "space-between" }}>
                    {/* Column 1 */}
                    <div className="md:w-1/2 px-2 m-1">
                        {/* Display Program and Directorate Details */}
                        <p>
                            <strong>Car Name:</strong> {selectedItem?.car?.name || "N/A"}
                        </p>
                        <p>
                            <strong>Report Title:</strong> {selectedItem?.name || "N/A"}
                        </p>
                    </div>

                    {/* Column 2 */}
                    {/* <div className="md:w-1/2 px-2 m-1">
                        <p>
                            <strong>Status:</strong> {statusWithColor(selectedItem?.status)}
                        </p>
                    </div> */}

                    {/* Full Width Row for Details */}
                    <div className="w-full px-2 m-2">
                        <p>
                            <strong>Approval Status:</strong> {tagStatus(selectedItem?.spatie_current_status?.name)}
                        </p>
                        <p>
                            <strong>Approval Comment:</strong> {selectedItem?.spatie_current_status?.reason || "N/A"}
                        </p>
                    </div>

                    <div className="w-full px-2 m-2">
                        <strong>Description:</strong>
                        <p>{selectedItem?.details}</p>
                    </div>
                </div>
            </Card>

            <Card title="Categories and Fields" style={{ marginBottom: "1rem" }}>
                {selectedItem?.car_inspection_report_category?.map((category, index) => (
                    <Card title={`Category: ${category.inspection_field_category.name}`} key={index} style={{ marginBottom: "1rem" }}>
                        <DataTable value={category.fields} responsiveLayout="scroll">
                            <Column field="inspection_field.name" header="Field Name"></Column>
                            <Column field="value" header="Field Value"></Column>
                            {/* <Column field="inspection_field.status" header="Field Status"></Column>
                            <Column field="creator.name" header="Created By"></Column> */}
                        </DataTable>
                    </Card>
                ))}
            </Card>
            {/* Created By and Updated By Information */}
            <p>
                <strong>Created By:</strong> {selectedItem?.creator?.name} at {formatDate(selectedItem?.created_at)}
            </p>

            {/* Print Button */}
            {/* {selectedItem?.current_status?.name == "approved" && ( */}
            <>
                {" "}
                <Button label="Print " icon={<PrinterOutlined />} onClick={handlePrint} className="p-button-primary" />
                {/* Invisible component for printing */}
                <div style={{ display: "none" }}>
                    <div ref={componentRef}>
                        <InspectionReportPrint selectedItem={selectedItem} selectedUtilityData={selectedUtilityData} />
                    </div>
                </div>
            </>
            {/* )} */}
        </Dialog>
    );
}

export default InspectionReportPdfModal;
