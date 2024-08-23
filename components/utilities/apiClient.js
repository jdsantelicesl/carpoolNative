import axios from 'axios';
import { saveUserData, getUserData } from './cache';
import { parseISO } from 'date-fns';


// Create an instance of axios with interceptors
const apiClient = axios.create();

apiClient.interceptors.request.use(
    async (config) => {

        // Token refresh logic
        const clientId = await getUserData("clientId")
        const tokenExpiry = await getTokenExpiry();

        console.log("token expiry: ", tokenExpiry)

        if (!tokenExpiry || isTokenExpired(tokenExpiry)) {
            console.log("fetched new");
            await refreshToken(clientId);
        }
        
        config.headers['token'] = await getAccessToken();
        config.headers['clientId'] = await getClientId();

        const token = await getAccessToken();
        console.log("token :", token)

        return config;
    },
    (error) => Promise.reject(error)
);

const getAccessToken = async () => {
    const token = await getUserData("token");
    return token;
};

const getClientId = async () => {
    const clientId = await getUserData("clientId");
    return clientId;
}

const getTokenExpiry = async () => {
    // expiry is cached in isoformat
    const isoExpiry = await getUserData("expiry");
    if (isoExpiry){
        return parseISO(isoExpiry);
    }
    return null;
};

const isTokenExpired = (expiry) => {
    const now = new Date();
    return now > expiry;
};

const refreshToken = async (clientId) => {
    // Logic to refresh the token
    const url = process.env.EXPO_PUBLIC_API_URL + "/user/getAccess"; // placeholder
    const cached_refresh = await getUserData("refresh")

    const data = {
        clientId: clientId,
        refreshToken: cached_refresh
    };

    result = await axios.post(url, data);
    
    saveUserData("token", result.data.accessToken);
    saveUserData("expiry", result.data.expiry);
};

export default apiClient;