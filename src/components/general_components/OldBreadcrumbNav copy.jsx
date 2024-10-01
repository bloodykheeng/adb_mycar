import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";

const BreadcrumbNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const paths = location.pathname.split("/").filter((path) => path !== "");

    const items = paths.map((path, index) => {
        const pathSoFar = `/${paths.slice(0, index + 1).join("/")}`;
        const pathName = path.charAt(0).toUpperCase() + path.slice(1);
        const isLast = index === paths.length - 1;

        return {
            label: pathName,
            url: pathSoFar,
            icon: isLast ? "pi pi-chevron-right" : null,
            command: (event) => {
                event.originalEvent.preventDefault();
                if (!isLast) {
                    navigate(pathSoFar);
                }
                // For the last item, do nothing
            },
        };
    });

    const customRowStyle = {
        marginBottom: "1rem",
    };

    return (
        <div style={customRowStyle}>
            <BreadCrumb
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
