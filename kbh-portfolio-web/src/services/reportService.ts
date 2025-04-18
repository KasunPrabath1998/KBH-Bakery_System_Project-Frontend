
import { postProductReport, postOrderReport, postTodayOrderReport, getSalesReport } from "../controllers/reportController";


export async function postProductReportService(reportData: any) {
    try {
        const result = await postProductReport(reportData);
        return result;
    } catch (error) {
        console.error("Service error posting product report:", error);
        return null;
    }
}

export async function postOrderReportService(reportData: any) {
    try {
        const result = await postOrderReport(reportData);
        return result;
    } catch (error) {
        console.error("Service error posting order report:", error);
        return null;
    }
}

export async function postTodayOrderReportService(reportData: any) {
    try {
        const result = await postTodayOrderReport (reportData);
        return result;
    } catch (error) {
        console.error("Service error posting today order report:", error);
        return null;
    }
}


export async function getSalesReportService() {
    try {
        const result = await getSalesReport();
        return await result.data;
    } catch (error) {
        console.log("error:", error);
    }
}