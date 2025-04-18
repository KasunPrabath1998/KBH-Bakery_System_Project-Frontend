import { addStock } from "../controllers/stockController";

export async function addStockService(stockData: any) {
    try {
        const result = await addStock(stockData);
        return await result.data;
    } catch (error) {
        console.log("Error:", error);
    }
}
