import { login } from "../controllers/userController";

export async function loginService(password:String) {
    try {
        const result = await login(password);
        return await result.data;
    } catch (error) {
        console.log("error:", error);
    }
}
