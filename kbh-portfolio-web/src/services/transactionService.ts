import { doTransaction , getTransaction } from "../controllers/transactionController";

export async function doTransactionService(transactions:any) {
    try {
        const result = await doTransaction(transactions);
        return await result;
    } catch (error) {
        alert("Error")
        console.log("error:", error);
    }
}

export async function getTransactionService() {
    try {
        const result = await getTransaction();
        console.log(result.data.transactions.transactions)
        return await result.data.transactions.transactions;
    } catch (error) {
        console.log("error:", error);
    }
}
