import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";

const BreadcrumbNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const paths = location.pathname.split("/").filter((path) => path !== "");

    // useEffect(() => {
    //     if (!location.state) {
    //         // Navigate to the home page
    //         navigate("/");
    //         return null; // Render nothing for this component
    //     }
    // }, []);
    // Check if there is no state in the location
    // if (!location.state) {
    //     // Navigate to the home page
    //     navigate("/");
    //     return null; // Render nothing for this component
    // }

    const items = paths.map((path, index) => {
        const pathName = path.charAt(0).toUpperCase() + path.slice(1);
        const isLast = index === paths.length - 1;

        return {
            label: pathName,
            icon: isLast ? "pi pi-chevron-right" : null,
            command: (event) => {
                event.originalEvent.preventDefault();
                if (!isLast) {
                    // Calculate steps to go back
                    const stepsBack = index - paths.length + 1;
                    navigate(stepsBack);
                }
                // For the last item, do nothing
            },
        };
    });

    const customRowStyle = { marginBottom: "1rem" };

    return (
        <div style={customRowStyle}>
            <BreadCrumb
                // scrollable={true}
                model={items}
                home={{
                    label: "Home",
                    icon: "pi pi-home",
                    command: (e) => {
                        e.originalEvent.preventDefault();
                        navigate("/");
                    },
                }}
            />
        </div>
    );
};

export default BreadcrumbNav;
