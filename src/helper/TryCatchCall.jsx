// import React from 'react'

import { makeApi } from "./MakeApi";

// const TryCatchCall = () => {
//   return (
//     <div>TryCatchCall</div>
//   )
// }

// export default TryCatchCall


export const apiCall = async (...args) => {
    console.log("apiCall at commmon function", ...args)
    try {
        const response = await makeApi(...args);
        return { success: true, data: response };
    } catch (error) {
        return { success: false, error };
    }
};