import { useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";

const ScrollToTop = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Scroll to the top when the location changes
        window.scrollTo(0, 0);
    }, [location]);

    return props.children;
};

export default ScrollToTop;
