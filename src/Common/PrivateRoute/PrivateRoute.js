import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const user = JSON.parse(sessionStorage.getItem("token"));
    // console.log("user", user)
    return user ? children : <Navigate to="/" />;
}

export default PrivateRoute;
