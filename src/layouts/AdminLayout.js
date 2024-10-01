import React, { Suspense, useState, useEffect, useRef } from "react";

import classNames from "classnames";
import { Route, useLocation, Routes } from "react-router-dom";

import { CSSTransition } from "react-transition-group";

import { AppTopbar } from "../AppTopbar";
import { AppFooter } from "../AppFooter";
import { AppMenu } from "../AppMenu";
import { AppConfig } from "../AppConfig";

import Dashboard from "../components/Dashboard";
import ButtonDemo from "../components/ButtonDemo";
import ChartDemo from "../components/ChartDemo";
import Documentation from "../components/Documentation";
import FileDemo from "../components/FileDemo";
import FloatLabelDemo from "../components/FloatLabelDemo";
import FormLayoutDemo from "../components/FormLayoutDemo";
import InputDemo from "../components/InputDemo";
import ListDemo from "../components/ListDemo";
import MenuDemo from "../components/MenuDemo";
import MessagesDemo from "../components/MessagesDemo";
import MiscDemo from "../components/MiscDemo";
import OverlayDemo from "../components/OverlayDemo";
import MediaDemo from "../components/MediaDemo";
import PanelDemo from "../components/PanelDemo";
import TableDemo from "../components/TableDemo";
import TreeDemo from "../components/TreeDemo";
import InvalidStateDemo from "../components/InvalidStateDemo";
import BlocksDemo from "../components/BlocksDemo";
import IconsDemo from "../components/IconsDemo";

import Crud from "../pages/Crud";
import EmptyPage from "../pages/EmptyPage";
import TimelineDemo from "../pages/TimelineDemo";

import PrimeReact from "primereact/api";
import { Tooltip } from "primereact/tooltip";

import "../assets/demo/flags/flags.css";
import "../assets/demo/Demos.scss";
import "../assets/layout/layout.scss";
import "../App.scss";

//
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";

//
import AppRoutes from "../AppRoutes";
import useAuthContext from "../context/AuthContext";

const AdminLayout = () => {
    const { user, getUserQuery, isLoading } = useAuthContext();
    const [layoutMode, setLayoutMode] = useState("static");
    const [layoutColorMode, setLayoutColorMode] = useState("light");
    const [inputStyle, setInputStyle] = useState("outlined");
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode);
    };

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode);
    };

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    };

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === "overlay") {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === "static") {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };
    const isDesktop = () => {
        return window.innerWidth >= 992;
    };

    let menu = [
        {
            label: "Home",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-home",
                    to: "/",
                },
                {
                    label: "Approvals",
                    icon: "pi pi-fw pi-check-circle",
                    to: "/approvals",
                },
                {
                    label: "Cars",
                    icon: "pi pi-fw pi-shopping-cart",
                    to: "/cars",
                },
                // {
                //     label: "vendors",
                //     icon: "pi pi-fw pi-warehouse",
                //     to: "/vendors",
                // },
                {
                    label: "Vendors",
                    icon: "pi pi-fw pi-tag",
                    to: "/vendors",
                },
                {
                    label: "Parking",
                    icon: "pi pi-fw pi-car",
                    to: "/parking",
                },
                {
                    label: "Car Wash",
                    icon: "pi pi-fw pi-car",
                    to: "/car_wash",
                },

                {
                    label: "Spare Parts",
                    icon: "pi pi-fw pi-box",
                    to: "/spare_parts",
                },
                {
                    label: "Garages",
                    icon: "pi pi-fw pi-home",
                    to: "/garages",
                },
                {
                    label: "Motor 3 Party",
                    icon: "pi pi-fw pi-shield",
                    to: "/motor_third_party",
                },
                {
                    label: "Office Rent",
                    icon: "pi pi-fw pi-wallet",
                    to: "/office_rent",
                },
                {
                    label: "Event Notifications",
                    icon: "pi pi-fw pi-bell",
                    to: "/events",
                },
            ],
        },

        {
            label: "Configurations",
            items: [
                {
                    label: "Car",
                    icon: "pi pi-fw pi-car",
                    items: [
                        {
                            label: "Car Types",
                            icon: "pi pi-fw pi-sliders-h",
                            to: "/car_types",
                        },
                        {
                            label: "Car Brand",
                            icon: "pi pi-fw pi-tag",
                            to: "/car_brand",
                        },
                        {
                            label: "Inspection Fields Categories",
                            icon: "pi pi-fw pi-paperclip",
                            to: "/categories",
                        },
                        {
                            label: "Inspection Fields",
                            icon: "pi pi-fw pi-car",
                            to: "/inspection",
                        },
                    ],
                },
                {
                    label: "Settings",
                    icon: "pi pi-fw pi-cog",
                    items: [
                        {
                            label: "Spare Parts Types",
                            icon: "pi pi-fw pi-box",
                            to: "/spare_types",
                        },
                        {
                            label: "Car Wash Fees",
                            icon: "pi pi-fw pi-car",
                            to: "/car_wash_fees",
                        },
                        {
                            label: "Parking Fees",
                            icon: "pi pi-fw pi-map-marker",
                            to: "/parking_fees",
                        },
                        {
                            label: "Offices",
                            icon: "pi pi-fw pi-building",
                            to: "/offices",
                        },
                        {
                            label: "Slider",
                            icon: "pi pi-fw pi-images",
                            to: "/slider",
                        },
                    ],
                },
                {
                    label: "User Management",
                    items: [{ label: "Users", icon: "pi pi-fw pi-user-edit", to: "/users" }],
                },
            ],
        },
        // {
        //     label: "UI Components",
        //     icon: "pi pi-fw pi-sitemap",
        //     items: [
        //         {
        //             label: "Configurations",
        //             items: [
        //                 { label: "Form Layout", icon: "pi pi-fw pi-id-card", to: "/formlayout" },
        //                 { label: "Input", icon: "pi pi-fw pi-check-square", to: "/input" },
        //                 { label: "Float Label", icon: "pi pi-fw pi-bookmark", to: "/floatlabel" },
        //                 { label: "Invalid State", icon: "pi pi-fw pi-exclamation-circle", to: "invalidstate" },
        //                 { label: "Button", icon: "pi pi-fw pi-mobile", to: "/button" },
        //                 { label: "Table", icon: "pi pi-fw pi-table", to: "/table" },
        //                 { label: "List", icon: "pi pi-fw pi-list", to: "/list" },
        //                 { label: "Tree", icon: "pi pi-fw pi-share-alt", to: "/tree" },
        //                 { label: "Panel", icon: "pi pi-fw pi-tablet", to: "/panel" },
        //                 { label: "Overlay", icon: "pi pi-fw pi-clone", to: "/overlay" },
        //                 { label: "Media", icon: "pi pi-fw pi-image", to: "/media" },
        //                 { label: "Menu", icon: "pi pi-fw pi-bars", to: "/menu" },
        //                 { label: "Message", icon: "pi pi-fw pi-comment", to: "/messages" },
        //                 { label: "File", icon: "pi pi-fw pi-file", to: "/file" },
        //                 { label: "Chart", icon: "pi pi-fw pi-chart-bar", to: "/chart" },
        //                 { label: "Misc", icon: "pi pi-fw pi-circle-off", to: "/misc" },
        //             ],
        //         },
        //         {
        //             label: "UI Blocks",
        //             items: [
        //                 { label: "Free Blocks", icon: "pi pi-fw pi-eye", to: "/blocks", badge: "NEW" },
        //                 { label: "All Blocks", icon: "pi pi-fw pi-globe", url: "https://www.primefaces.org/primeblocks-react" },
        //             ],
        //         },
        //         {
        //             label: "Icons",
        //             items: [{ label: "PrimeIcons", icon: "pi pi-fw pi-prime", to: "/icons" }],
        //         },
        //         {
        //             label: "Pages",
        //             icon: "pi pi-fw pi-clone",
        //             items: [
        //                 { label: "Crud", icon: "pi pi-fw pi-user-edit", to: "/crud" },
        //                 { label: "Timeline", icon: "pi pi-fw pi-calendar", to: "/timeline" },
        //                 { label: "Empty", icon: "pi pi-fw pi-circle-off", to: "/empty" },
        //             ],
        //         },
        //         // {
        //         //     label: "Menu Hierarchy",
        //         //     icon: "pi pi-fw pi-search",
        //         //     items: [
        //         //         {
        //         //             label: "Submenu 1",
        //         //             icon: "pi pi-fw pi-bookmark",
        //         //             items: [
        //         //                 {
        //         //                     label: "Submenu 1.1",
        //         //                     icon: "pi pi-fw pi-bookmark",
        //         //                     items: [
        //         //                         { label: "Submenu 1.1.1", icon: "pi pi-fw pi-bookmark" },
        //         //                         { label: "Submenu 1.1.2", icon: "pi pi-fw pi-bookmark" },
        //         //                         { label: "Submenu 1.1.3", icon: "pi pi-fw pi-bookmark" },
        //         //                     ],
        //         //                 },
        //         //                 {
        //         //                     label: "Submenu 1.2",
        //         //                     icon: "pi pi-fw pi-bookmark",
        //         //                     items: [
        //         //                         { label: "Submenu 1.2.1", icon: "pi pi-fw pi-bookmark" },
        //         //                         { label: "Submenu 1.2.2", icon: "pi pi-fw pi-bookmark" },
        //         //                     ],
        //         //                 },
        //         //             ],
        //         //         },
        //         //         {
        //         //             label: "Submenu 2",
        //         //             icon: "pi pi-fw pi-bookmark",
        //         //             items: [
        //         //                 {
        //         //                     label: "Submenu 2.1",
        //         //                     icon: "pi pi-fw pi-bookmark",
        //         //                     items: [
        //         //                         { label: "Submenu 2.1.1", icon: "pi pi-fw pi-bookmark" },
        //         //                         { label: "Submenu 2.1.2", icon: "pi pi-fw pi-bookmark" },
        //         //                         { label: "Submenu 2.1.3", icon: "pi pi-fw pi-bookmark" },
        //         //                     ],
        //         //                 },
        //         //                 {
        //         //                     label: "Submenu 2.2",
        //         //                     icon: "pi pi-fw pi-bookmark",
        //         //                     items: [
        //         //                         { label: "Submenu 2.2.1", icon: "pi pi-fw pi-bookmark" },
        //         //                         { label: "Submenu 2.2.2", icon: "pi pi-fw pi-bookmark" },
        //         //                     ],
        //         //                 },
        //         //             ],
        //         //         },
        //         //     ],
        //         // },
        //     ],
        // },

        // {
        //     label: "Get Started",
        //     items: [
        //         {
        //             label: "Documentation",
        //             icon: "pi pi-fw pi-question",
        //             command: () => {
        //                 window.location = "#/documentation";
        //             },
        //         },
        //         {
        //             label: "View Source",
        //             icon: "pi pi-fw pi-search",
        //             command: () => {
        //                 window.location = "https://github.com/primefaces/sakai-react";
        //             },
        //         },
        //     ],
        // },
    ];

    let loggedInUser = getUserQuery?.data?.data;
    console.log("logged in user data is : ", loggedInUser);

    let vendorMenu = [
        {
            label: "Home",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-home",
                    to: "/",
                },
                {
                    label: "Cars",
                    icon: "pi pi-fw pi-shopping-cart",
                    to: "/cars",
                },

                {
                    label: "Parking",
                    icon: "pi pi-fw pi-car",
                    to: "/parking",
                },
                {
                    label: "Car Wash",
                    icon: "pi pi-fw pi-car",
                    to: "/car_wash",
                },

                {
                    label: "Spare Parts",
                    icon: "pi pi-fw pi-box",
                    to: "/spare_parts",
                },
                {
                    label: "Office Rent",
                    icon: "pi pi-fw pi-wallet",
                    to: "/office_rent",
                },
            ],
        },
    ];

    if (loggedInUser?.role == "Vendor") {
        menu = vendorMenu;
    }

    let inspectorMenu = [
        {
            label: "Home",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-home",
                    to: "/",
                },
                {
                    label: "Cars",
                    icon: "pi pi-fw pi-shopping-cart",
                    to: "/cars",
                },
            ],
        },
    ];

    if (loggedInUser?.role == "Inspector") {
        menu = inspectorMenu;
    }

    //===================
    const addClass = (element, className) => {
        if (element.classList) element.classList.add(className);
        else element.className += " " + className;
    };

    const removeClass = (element, className) => {
        if (element.classList) element.classList.remove(className);
        else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive": staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active": overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        "p-input-filled": inputStyle === "filled",
        "p-ripple-disabled": ripple === false,
        "layout-theme-light": layoutColorMode === "light",
    });

    // ===========  App routes ===========
    let myroutes = AppRoutes();
    const [defaultRoutes, setDefaultRoutes] = useState(myroutes);

    useEffect(() => {
        setDefaultRoutes(myroutes);
    }, [myroutes]);

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode} mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Suspense
                        fallback={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100vh", // Full viewport height
                                }}
                            >
                                <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
                            </div>
                        }
                    >
                        <Routes>
                            {defaultRoutes.map((route, index) => {
                                if (route?.name === "dashboard" || route?.name === "chart") {
                                    return <Route path={route.path} key={index} element={<route.element colorMode={layoutColorMode} location={location} loggedInUserData={getUserQuery?.data?.data} />} />;
                                } else {
                                    return <Route path={route.path} key={index} element={<route.element location={location} loggedInUserData={getUserQuery?.data?.data} />} />;
                                }
                            })}

                            {/* <Route path="/login" element={<NewLoginPage getUserLoggedInUserDataQuery={getUserLoggedInUserDataQuery} setUserId={setUserId} setAuthUserProfile={setAuthUserProfile} authUserProfile={authUserProfile} />} />
                            <Route path="/signup" element={<RegistrationPage />} />
                            <Route path="403" element={<NotAuthorised />} />
                            <Route path="*" element={<PageNotFound />} /> */}
                            <Route
                                path="*"
                                element={
                                    <div>
                                        <h1>Page Not Found</h1>
                                    </div>
                                }
                            />
                        </Routes>
                    </Suspense>
                </div>

                <AppFooter layoutColorMode={layoutColorMode} />
            </div>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange} layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>
        </div>
    );
};

export default AdminLayout;
