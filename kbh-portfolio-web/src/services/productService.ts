import { getProducts , searchProducts , getCategories, postProducts, deleteProducts, updateProducts, getOrderProducts,getProductById, getWebCategories } from "../controllers/productController";

export async function getProductsService() {
    try {
        const result = await getProducts();
        console.log(result)
        return await result.data.products;
        console.log("Fetched Products:", result?.data?.products);
        return result?.data?.products || [];
    } catch (error) {
        return [];
    }
}

export async function searchProductsService(query: any) {
    try {
        const result = await searchProducts(query);
        return result || [];
    } catch (error) {
        return [];
    }
}

export async function getCategoriesService() {
    try {
        const result = await getCategories();
        return await result;
    } catch (error) {
        console.log("error:", error);
    }
}

export async function getWebCategoriesService() {
    try {
        const result = await getWebCategories();
        return await result;
    } catch (error) {
        console.log("error:", error);
    }
}

export async function postProductsService(productData: any) {
    try {
        const result = await postProducts(productData); 
        return result;
    } catch (error) {
        console.error("Error posting product in service:", error);
        return null;
    }
}




export async function deleteProductsService(productId: string) {
    try {
        const result = await deleteProducts(productId);
        return result;
    } catch (error) {
        console.error("Error deleting product in service:", error);
        return null;
    }
}


export async function getProductByIdService(productId: string) {
    try {
        const result = await getProductById(productId);
        return result;
    } catch (error) {
        console.error("Error getting product in service:", error);
        return null;
    }
}






export async function updateProductsService(productId: string, productData: any) {
    try {
        const result = await updateProducts(productId, productData); 
        return result;
    } catch (error) {
        console.error("Error updating product in service:", error);
        return null;
    }
}




export async function getOrderProductsService() {
    try {
        const result = await getOrderProducts();
        return await result.data;
    } catch (error) {
        console.log("error:", error);
    }
}