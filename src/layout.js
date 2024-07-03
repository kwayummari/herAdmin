import React from "react";
import BottomFooter from "./components/footer/footer";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            <Outlet />
            <BottomFooter />
        </div>
    );
}
export default Layout;