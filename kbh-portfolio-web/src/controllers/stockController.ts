import axios from "axios";
import baseUrl from "./baseUrl";

export async function addStock(stockData: any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (!token) throw new Error("No authentication token found");

        const response = await axios.post(`${baseUrl}inventory`, stockData, { 
            headers: { 'token': token }
        });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error posting stock:", error);
        throw error;
    }
}
