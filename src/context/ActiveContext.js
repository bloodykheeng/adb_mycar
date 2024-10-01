import React, { createContext, useContext, useState } from "react";

const ActiveContext = createContext();

export const ActiveProvider = ({ children }) => {
    const [active, setActive] = useState(false);

    return <ActiveContext.Provider value={{ active, setActive }}>{children}</ActiveContext.Provider>;
};

export const useActive = () => {
    const context = useContext(ActiveContext);
    if (!context) {
        throw new Error("useActive must be used within an ActiveProvider");
    }
    return context;
};
