import React, { useState, useRef } from "react";
import { Form, Field } from "react-final-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Toast as PrimeToast } from "primereact/toast";
import setFieldTouched from "final-form-set-field-touched";

import { postToUpdateCarInspectionReportStatus } from "../../../../services/inspection/car-inspection-reports-service.js";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";

const ApprovalModal = ({ selectedItem, approvalStatus, ...props }) => {
    const toast = useRef(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [formData, setFormData] = useState({});

    const validate = (values) => {
        const errors = {};
        if (!values.comment) {
            errors.comment = "Comment is required";
        }
        return errors;
    };

    const onSubmit = (values) => {
        setFormData(values);
        setShowConfirmDialog(true); // Show confirmation dialog
    };

    const queryClient = useQueryClient();
    const updateReportStatusMutation = useMutation(postToUpdateCarInspectionReportStatus, {
        onSuccess: () => {
            queryClient.invalidateQueries(["car-inspection-reports"]);
            toast.current.show({ severity: "success", summary: "Data Approved", icon: "pi pi-check", life: 3000 });
            props.onHide();
        },
        onError: (error) => {
            toast.current.show({ severity: "error", summary: error?.response?.data?.message || "An Error Occurred. Please Contact Admin", life: 3000 });
        },
    });

    const onConfirm = () => {
        // Call the mutation to update the status
        updateReportStatusMutation.mutate({
            report_id: selectedItem.id,
            comment: formData.comment,
            status: approvalStatus,
        });
        setShowConfirmDialog(false); // Hide confirmation dialog
    };

    const onCancelConfirm = () => {
        setShowConfirmDialog(false); // Close the confirmation dialog
    };
    return (
        <div>
            {/* <ApprovalIcon onClick={openDialog} style={{ cursor: "pointer" }} /> */}

            <Dialog header={approvalStatus == "approved" ? "Approval Comment" : "Rejection Comment"} visible={props.show} onHide={props.onHide} maximizable>
                <div className="col-12 md:col-12">
                    <div className="card p-fluid">
                        {/* <h5>{approvalStatus == "approved" ? "Approval Form" : "Rejection Form"}</h5> */}
                        <Form
                            onSubmit={onSubmit}
                            validate={validate}
                            mutators={{ setFieldTouched }}
                            render={({ handleSubmit, form }) => (
                                <form onSubmit={handleSubmit} className="p-fluid">
                                    <Field name="comment">
                                        {({ input, meta }) => (
                                            <div className="p-field m-4">
                                                <label htmlFor="comment">Comment</label>
                                                <InputTextarea {...input} rows={5} autoFocus className={classNames({ "p-invalid": meta.error && meta.touched })} />
                                                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>
                                    {approvalStatus == "approved" ? (
                                        <div className="p-fluid m-4">
                                            <Button type="submit" label="Approve" className="p-button-primary" />
                                        </div>
                                    ) : (
                                        <div className="p-fluid m-4">
                                            <Button type="submit" label="Reject" className="p-button-danger" />
                                        </div>
                                    )}
                                </form>
                            )}
                        />
                    </div>
                </div>
                {updateReportStatusMutation.isLoading && (
                    <center>
                        <ProgressSpinner
                            style={{
                                width: "50px",
                                height: "50px",
                                borderWidth: "8px", // Border thickness
                                borderColor: "blue", // Border color
                                animationDuration: "1s",
                            }}
                            strokeWidth="8"
                            animationDuration="1s"
                        />
                    </center>
                )}
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
                header={`Confirm Action`}
                visible={showConfirmDialog}
                style={{ width: "450px" }}
                onHide={onCancelConfirm}
                footer={
                    <div>
                        <Button label="Yes" icon="pi pi-check" onClick={onConfirm} className="p-button-text" />
                        <Button label="No" icon="pi pi-times" onClick={onCancelConfirm} className="p-button-text" />
                    </div>
                }
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-2" style={{ fontSize: "2rem" }} />
                    {<span>Are you sure you want this {approvalStatus} !</span>}
                </div>
            </Dialog>

            <PrimeToast ref={toast} />
        </div>
    );
};

export default ApprovalModal;
