import axios from 'axios';
import { saveUserData, getUserData, clearAllData } from './cache';
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

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error;
        if (response && response.status === 401) {
            // Handle the 401 error
            // If a user is not auth and it was not caught by an expired token then the user "must"
            // have signed in on a different device and refresh token is bad too, so clear all to redirect to login
            console.log("unauthorized fetch, clearing all");
            clearAllData();
        }

        return Promise.reject(error);
    }
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

    try {
        result = await axios.post(url, data);
    }
    catch {
        console.log("could not refresh token, logging out");
        clearAllData();
    }
    
    saveUserData("token", result.data.accessToken);
    saveUserData("expiry", result.data.expiry);
};

export default apiClient;