import React, { lazy, Suspense, useState } from "react";

//==================== my car routes ====================
import NewUsersPage from "./views/users/UserPage";
import NewVendorsPage from "./views/vendors/VendorsPage";
import NewCarTypesPage from "./views/settings/car-types/CarTypesPage";
import NewCarBrandsPage from "./views/settings/car-brands/CarBrandsPage";

import NewVendorsViewPage from "./views/vendors/VendorsViewPage";
import NewCarsPage from "./views/cars/CarsPage";
import NewCarsViewPage from "./views/cars/CarsViewPage";

import NewGaragesPage from "./views/garages/GaragesPage";
import NewMotorThirdPartiesPage from "./views/motor-third-parties/MotorThirdPartiesPage";
import NewSparePartsPage from "./views/spare-parts/SparePartsPage";
import NewSparePartTypesPage from "./views/settings/spare-part-types/SparePartTypesPage";

import NewParkingPage from "./views/parking/ParkingPage";
import NewCarWashFeesPage from "./views/settings/car-wash-fees/CarWashFeesPage";
import NewParkingFeesPage from "./views/settings/parking-fees/ParkingFeesPage";

import NewCarWahOrdersPage from "./views/car-wash-orders/CarWahOrdersPage";
import NewOfficeFeesPage from "./views/settings/offices-fees/OfficeFeesPage";
import NewOfficeRentPage from "./views/office-rent/OfficeRentPage";
import NewDashboardSliderPage from "./views/settings/dashboard-slider/DashboardSliderPage";
import NewCarInspectionFieldsPage from "./views/settings/inspection-fields/CarInspectionFieldsPage";
import NewCarInspectionFieldCategoriesPage from "./views/settings/inspection-fields-categories/CarInspectionFieldCategoriesPage";
import NewInspectionReportingPage from "./views/cars/reports/InspectionReportingPage";

import NewApprovalsPage from "./views/approvals/ApprovalsPage";
import NewEventNotificationPage from "./views/event-notifications/EventNotificationPage";

// ============ Customm component routes ========================
const DashboardPage = lazy(() => import("./components/Dashboard"));
const FormLayoutDemo = lazy(() => import("./components/FormLayoutDemo"));
const InputDemo = lazy(() => import("./components/InputDemo"));
const FloatLabelDemo = lazy(() => import("./components/FloatLabelDemo"));
const InvalidStateDemo = lazy(() => import("./components/InvalidStateDemo"));
const ButtonDemo = lazy(() => import("./components/ButtonDemo"));
const TableDemo = lazy(() => import("./components/TableDemo"));
const ListDemo = lazy(() => import("./components/ListDemo"));
const TreeDemo = lazy(() => import("./components/TreeDemo"));
const PanelDemo = lazy(() => import("./components/PanelDemo"));
const OverlayDemo = lazy(() => import("./components/OverlayDemo"));
const MediaDemo = lazy(() => import("./components/MediaDemo"));
const MenuDemo = lazy(() => import("./components/MenuDemo"));
const MessagesDemo = lazy(() => import("./components/MessagesDemo"));
const BlocksDemo = lazy(() => import("./components/BlocksDemo"));
const IconsDemo = lazy(() => import("./components/IconsDemo"));
const FileDemo = lazy(() => import("./components/FileDemo"));
const ChartDemo = lazy(() => import("./components/ChartDemo"));
const MiscDemo = lazy(() => import("./components/MiscDemo"));
const Crud = lazy(() => import("./pages/Crud"));
const EmptyPage = lazy(() => import("./pages/EmptyPage"));
const TimelineDemo = lazy(() => import("./pages/TimelineDemo"));
const Documentation = lazy(() => import("./components/Documentation"));

function AppRoutes() {
    const privateDefaultRoutes = [
        {
            path: "/",
            name: "dashboard",
            element: DashboardPage, // Replace with the actual component
            layout: "/private",
        },
        {
            path: "/formlayout",
            name: "formlayout",
            element: FormLayoutDemo,
            layout: "/private",
        },
        {
            path: "/input",
            name: "input",
            element: InputDemo,
            layout: "/private",
        },
        {
            path: "/floatlabel",
            name: "floatlabel",
            element: FloatLabelDemo,
            layout: "/private",
        },
        {
            path: "/invalidstate",
            name: "invalidstate",
            element: InvalidStateDemo,
            layout: "/private",
        },
        {
            path: "/button",
            name: "button",
            element: ButtonDemo,
            layout: "/private",
        },
        {
            path: "/table",
            name: "table",
            element: TableDemo,
            layout: "/private",
        },
        {
            path: "/list",
            name: "list",
            element: ListDemo,
            layout: "/private",
        },
        {
            path: "/tree",
            name: "tree",
            element: TreeDemo,
            layout: "/private",
        },
        {
            path: "/panel",
            name: "panel",
            element: PanelDemo,
            layout: "/private",
        },
        {
            path: "/overlay",
            name: "overlay",
            element: OverlayDemo,
            layout: "/private",
        },
        {
            path: "/media",
            name: "media",
            element: MediaDemo,
            layout: "/private",
        },
        {
            path: "/menu",
            name: "menu",
            element: MenuDemo,
            layout: "/private",
        },
        {
            path: "/messages",
            name: "messages",
            element: MessagesDemo,
            layout: "/private",
        },
        {
            path: "/blocks",
            name: "blocks",
            element: BlocksDemo,
            layout: "/private",
        },
        {
            path: "/icons",
            name: "icons",
            element: IconsDemo,
            layout: "/private",
        },
        {
            path: "/file",
            name: "file",
            element: FileDemo,
            layout: "/private",
        },
        {
            path: "/chart",
            name: "chart",
            element: ChartDemo,
            layout: "/private",
        },
        {
            path: "/misc",
            name: "misc",
            element: MiscDemo,
            layout: "/private",
        },
        {
            path: "/timeline",
            name: "timeline",
            element: TimelineDemo,
            layout: "/private",
        },
        {
            path: "/crud",
            name: "crud",
            element: Crud,
            layout: "/private",
        },
        {
            path: "/empty",
            name: "empty",
            element: EmptyPage,
            layout: "/private",
        },
        {
            path: "/documentation",
            name: "documentation",
            element: Documentation,
            layout: "/private",
        },

        // ============================= My Car Routes ==================================

        {
            path: "/users",
            name: "users",
            element: NewUsersPage,
            layout: "/admin",
        },

        {
            path: "/vendors",
            name: "vendors",
            element: NewVendorsPage,
            layout: "/admin",
        },
        {
            path: "/vendors/vendor",
            name: "/vendors/vendor",
            element: NewVendorsViewPage,
            layout: "/admin",
        },

        {
            path: "/car_types",
            name: "car types",
            element: NewCarTypesPage,
            layout: "/admin",
        },
        {
            path: "/car_brand",
            name: "car brand",
            element: NewCarBrandsPage,
            layout: "/admin",
        },

        {
            path: "/cars",
            name: "cars",
            element: NewCarsPage,
            layout: "/admin",
        },
        {
            path: "/cars/car",
            name: "/cars/car",
            element: NewCarsViewPage,
            layout: "/admin",
        },
        {
            path: "/cars/car/report",
            name: "/cars/car/report",
            element: NewInspectionReportingPage,
            layout: "/admin",
        },

        {
            path: "/garages",
            name: "product types",
            element: NewGaragesPage,
            layout: "/admin",
        },
        {
            path: "/motor_third_party",
            name: "product types",
            element: NewMotorThirdPartiesPage,
            layout: "/admin",
        },
        {
            path: "/spare_parts",
            name: "spare_parts",
            element: NewSparePartsPage,
            layout: "/admin",
        },
        {
            path: "/spare_types",
            name: "spare_types",
            element: NewSparePartTypesPage,
            layout: "/admin",
        },
        {
            path: "/parking",
            name: "parking",
            element: NewParkingPage,
            layout: "/admin",
        },
        {
            path: "/car_wash_fees",
            name: "car wash fees",
            element: NewCarWashFeesPage,
            layout: "/admin",
        },
        {
            path: "/parking_fees",
            name: "parking fees",
            element: NewParkingFeesPage,
            layout: "/admin",
        },
        {
            path: "/car_wash",
            name: "car wash",
            element: NewCarWahOrdersPage,
            layout: "/admin",
        },
        {
            path: "/offices",
            name: "offices",
            element: NewOfficeFeesPage,
            layout: "/admin",
        },
        {
            path: "/office_rent",
            name: "office_rent",
            element: NewOfficeRentPage,
            layout: "/admin",
        },
        {
            path: "/slider",
            name: "slider",
            element: NewDashboardSliderPage,
            layout: "/admin",
        },
        {
            path: "/inspection",
            name: "inspection",
            element: NewCarInspectionFieldsPage,
            layout: "/admin",
        },
        {
            path: "/categories",
            name: "categories",
            element: NewCarInspectionFieldCategoriesPage,
            layout: "/admin",
        },
        {
            path: "/approvals",
            name: "approvals",
            element: NewApprovalsPage,
            layout: "/admin",
        },
        {
            path: "/events",
            name: "events",
            element: NewEventNotificationPage,
            layout: "/admin",
        },
    ];

    const [privateRoutes, setPrivateRoutes] = useState(privateDefaultRoutes);

    return privateRoutes;
}

export default AppRoutes;
