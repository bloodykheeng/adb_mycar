import "react-app-polyfill/ie11";
import React from "react";
import "./index.css";
import ReactDOM from "react-dom";
import App from "./App";

//import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

//
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

//
import { Tooltip } from "primereact/tooltip";

//
import { ActiveProvider } from "./context/ActiveContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: "always",
            refetchOnWindowFocus: false,
        },
        mutations: {
            networkMode: "always",
        },
    },
});

ReactDOM.render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <ScrollToTop>
                <AuthProvider>
                    <ActiveProvider>
                        <App />
                    </ActiveProvider>
                </AuthProvider>
                <ReactQueryDevtools initialIsOpen={true} />
                <Tooltip target=".custom-target-icon" />
                <ConfirmDialog />
                <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            </ScrollToTop>
        </QueryClientProvider>
    </BrowserRouter>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
