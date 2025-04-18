import { placeOrder, getOrder, searchOrders, updateOrder  } from "../controllers/orderController";

export async function placeOrderService(orderData: any) {
    try {
        const result = await placeOrder(orderData);
        return await result.data;
    } catch (error) {
        console.log("Error:", error);
    }
}



export async function getOrderService() {
    try {
        return await getOrder(); 
    } catch (error) {
        console.log("Error:", error);
        throw error;
    }
}



export async function updateOrderService(productData: any) {
    try {
        const result = await updateOrder(productData); 
        return result;
    } catch (error) {
        console.error("Error posting product in service:", error);
        return null;
    }
}



export async function searchOrdersService(query: any) {
    console.log(query);
    try {
        const result = await searchOrders(query);
        return result || [];

    } catch (error) {
        return [];
    }
}
