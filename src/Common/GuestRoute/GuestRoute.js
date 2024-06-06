import React from "react";
import { Navigate } from "react-router-dom";

function GuestRoute({ children }) {
    console.log("children at guest ", children)

    const user = JSON.parse(sessionStorage.getItem("token"));
    console.log("user at guest route", user)

    const userRole = JSON.parse(sessionStorage.getItem("User_Role"));

    console.log("userRole at guest route", userRole)


    return user ? <Navigate to="/dashboard" /> : children;
}
export default GuestRoute;
