import { Navigate } from "react-router-dom";


export const userlocalStorageData = () => {
    const localData = sessionStorage.getItem("token");
    const userRole = sessionStorage.getItem("User_Role");

    const userToken = JSON.parse(localData);
    const Role_User = JSON.parse(userRole);

    return { userToken, Role_User };
};

export const ProperDateFormat = ({ dateString }) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const formattedDay = day < 10 ? `0${day}` : day;
    const month = date.getMonth() + 1;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const year = date.getFullYear();

    return `${formattedDay}/${formattedMonth}/${year}`;
};



export const logoutUser = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("User_Role");
    return <Navigate to="/" />;
}