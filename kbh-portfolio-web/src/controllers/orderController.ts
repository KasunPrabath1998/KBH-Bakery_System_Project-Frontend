import axios from "axios";
import baseUrl from "./baseUrl";

export async function placeOrder(orderData: any) {
    try {
        const response = await axios.post(`${baseUrl}order`, orderData);
        console.log('Order Response at controller:', response.data);
        return response.data;
    } catch (error) {
        console.log("Error placing order:", error);
    }
}



export async function updateOrder(productData: any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (!token) throw new Error("No authentication token found");
        
        console.log('data',productData)
        const response = await axios.put(`${baseUrl}order`, productData, { 
            headers: { 'token': token }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error posting product:", error);
        throw error;
    }
}






export async function searchOrders(query: any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (token) {
            const response = await axios.post(`${baseUrl}search_order`, 
            { query }, { headers: { 'token': `${token}` } });
            console.log('search: ', response.data);
            return response.data || [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}



export async function getOrder() {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (token) {
            const response = await axios.get(`${baseUrl}order`,{headers:{'token':`${token}`}});
            console.log('get Order Response at controller:', response.data);
            return response.data;
        }
    } catch (error) {
        console.log("Error fetching order:", error);
    }
}





