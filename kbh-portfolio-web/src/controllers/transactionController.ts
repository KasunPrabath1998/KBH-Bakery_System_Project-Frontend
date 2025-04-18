import axios from "axios";
import baseUrl from "./baseUrl";

export async function doTransaction(transactions:any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (token) {
            console.log(transactions)
            const response = await axios.post(`${baseUrl}transaction`,{ transactions },{headers:{'token':`${token}`}});
            console.log('transaction response: ',response.data);
            return response.data;
        }
    } catch (error:any) {
        alert(error.response.data.data.message)
        console.log(error);
    }
}

export async function getTransaction() {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (token) {
            const response = await axios.get(`${baseUrl}transaction`,{headers:{'token':`${token}`}});
            console.log('transaction response: ',response.data);
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
}

export async function postTransactions(){

    try {

        const token =localStorage.getItem('kbh')
    }catch{
        
    }
}