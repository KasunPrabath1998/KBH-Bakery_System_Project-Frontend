
import axios from "axios";
import baseUrl from "./baseUrl";



export async function postProductReport(reportData: any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (!token) throw new Error("No authentication token found");

        const response = await axios.post(`${baseUrl}report/product`, reportData, {
            headers: {
                token: token
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error posting product report:", error);
        throw error;
    }
}


export async function postOrderReport(reportData: any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (!token) throw new Error("No authentication token found");

        const response = await axios.post(`${baseUrl}report/order`, reportData, {
            headers: {
                token: token
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error posting product report:", error);
        throw error;
    }
}



export async function postTodayOrderReport(reportData: any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (!token) throw new Error("No authentication token found");

        console.log('data',reportData)
        const response = await axios.post(`${baseUrl}report/today_order`, reportData, {
            headers: {
                token: token
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error posting product report:", error);
        throw error;
    }
}


export async function getSalesReport() {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (token) {
            const response = await axios.get(`${baseUrl}report/sale`,{headers:{'token':`${token}`}});
           
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
}