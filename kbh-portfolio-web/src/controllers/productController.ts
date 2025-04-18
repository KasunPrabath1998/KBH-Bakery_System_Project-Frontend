import axios from "axios";
import baseUrl from "./baseUrl";

export async function getProducts() {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (token) {
            const response = await axios.get(`${baseUrl}product`,{headers:{'token':`${token}`}});
           
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
}

export async function searchProducts(query: any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (token) {
            const response = await axios.post(`${baseUrl}search_product`, 
            { query }, { headers: { 'token': `${token}` } });
            console.log('search: ', response.data);
            return response.data?.data?.products || [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getCategories() {
    try {
        const response = await axios.get(`${baseUrl}categories`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateProducts(productId: string, productData: any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (!token) throw new Error("No authentication token found");
        console.log(productData)
        return (await axios.put(`${baseUrl}product`, { product: { id: productId, ...productData } }, {
            headers: { 'token': token }
        })).data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}



export async function postProducts(productData: any) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (!token) throw new Error("No authentication token found");

        const response = await axios.post(`${baseUrl}product`, productData, { 
            headers: { 'token': token }
        });
        return response.data;
    } catch (error) {
        console.error("Error posting product:", error);
        throw error;
    }
}


export async function deleteProducts(productId: string) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (!token) throw new Error("No authentication token found");

        const response = await axios.delete(`${baseUrl}product/${productId}`, {
            headers: { 'token': token }
        });

        console.log("Delete response:", response); // Log the entire response
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}


//Get Products for the Portfolio Web
export async function getOrderProducts() {
    try {
        const response = await axios.get(`${baseUrl}order_product`);
        return response.data;

    } catch (error) {
        console.log(error);
    }
}


export async function getWebCategories() {
    try {
        const response = await axios.get(`${baseUrl}order_categories`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getProductById(productId: string) {
    try {
        const token = localStorage.getItem('kbh_auth_token');
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(`${baseUrl}product_by_id/${productId}`, {
            headers: { 'token': token }
        });

        console.log("Get response:", response); // Log the entire response
        return response.data;
    } catch (error) {
        console.error("Error getting product:", error);
        throw error;
    }
}