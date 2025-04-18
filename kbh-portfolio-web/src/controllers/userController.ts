import axios from "axios";
import baseUrl from "./baseUrl";

export async function login(password:String) {
    try {
        const response = await axios.post(`${baseUrl}login`,{password});
        console.log('login: ',response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}