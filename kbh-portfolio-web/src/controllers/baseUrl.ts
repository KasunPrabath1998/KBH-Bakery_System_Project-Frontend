// BaseUrl.js
import devConfig from '../config/dev';
import prodConfig from '../config/prod'


const configDev = devConfig;
const configProd = prodConfig;

// export const projectCode = config.projectCode;
export const baseUrl = configDev.baseUrl;
export const loginUrl = configDev.loginUrl;

export default baseUrl;
