import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";

const RowForm = ({ loggedInUserData, handleSubmit, initialData, ...props }) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const toast = React.useRef(null);

    const validate = (values) => {
        const errors = {};

        if (!values.message) {
            errors.message = "Message is required";
        }
        return errors;
    };

    const onSubmit = (data, form) => {
        const errors = validate(data);
        if (Object.keys(errors).length === 0) {
            setPendingData(data);
            setShowConfirmDialog(true);
        } else {
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });
            toast.current.show({ severity: "warn", summary: "Validation Error", detail: "Please fill in all required fields." });
        }
    };

    const onConfirmSubmit = () => {
        setIsLoading(true);
        handleSubmit(pendingData);
        setShowConfirmDialog(false);
        setIsLoading(false);
    };

    const onCancelSubmit = () => {
        setShowConfirmDialog(false);
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <Form
                        onSubmit={onSubmit}
                        initialValues={initialData ? { status: initialData?.status } : null}
                        validate={validate}
                        initialValuesEqual={() => true}
                        mutators={{ setFieldTouched: (args, state, tools) => tools.setFieldTouched(...args) }}
                        render={({ handleSubmit, form, submitting, values }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="message">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="message">Message</label>
                                            <InputTextarea {...input} rows={5} cols={30} id="description" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>

                                <Field name="total_subscribers">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="total_subscribers">Total No of Subscribers</label>
                                            <InputNumber {...input} id="total_subscribers" value={input.value} onValueChange={input.onChange} className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>
                                <div className="p-field m-4">
                                    <Button type="submit" label="Submit" icon="pi pi-check" loading={isLoading} disabled={isLoading} />
                                </div>
                            </form>
                        )}
                    />
                </div>
            </div>
            <Dialog
                header="Confirm Submission"
                maximizable={true}
                visible={showConfirmDialog}
                style={{ minWidth: "30vw" }}
                onHide={onCancelSubmit}
                footer={
                    <div>
                        <Button label="Yes" onClick={onConfirmSubmit} />
                        <Button label="No" onClick={onCancelSubmit} className="p-button-secondary" />
                    </div>
                }
            >
                Are you sure you want to submit ?
            </Dialog>
        </div>
    );
};

export default RowForm;
