import axios from "axios";
import { logoutUser, userlocalStorageData } from "./UserToken";
export const makeApi = async (req, url, body) => {
    const userToken = userlocalStorageData().userToken

    const previousUrl = "https://sharelink.clientdemobot.com/api"
    var config = {
        method: req,
        url: previousUrl + url,
        data: body,
        headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data',
            access_control_allow_origin: "*"
        }
    };
    try {
        const response = await axios(config);
        // console.log("response at make api try", response)
        // console.log("response at make api try", response.data.error.message)
        if (response.data.error && response.data.error.message === "Token has expired") {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("User_Role");
            window.location.href = 'https://sharlinkliveadmin.clientdemobot.com/'
            return;
        } else {
            return response.data;
        }

        // return response.data;
    } catch (error) {
        console.log("error at catch of make api", error);
        throw error;
    }
}