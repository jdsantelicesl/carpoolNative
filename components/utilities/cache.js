import AsyncStorage from "@react-native-async-storage/async-storage";

// Cache -- save user data
export const saveUserData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error saving data", error);
    }
};

// Cache -- get user data
export const getUserData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (error) {
        console.error("Error fetching data", error);
    }
    return null;
};

// Cache -- Remove item
export const removeUserData = async (key) => {

    try {
        const value = await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing data", error);
    }
};

// Cache -- Clear All 
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
    } catch(error) {
        console.error("Error clearing cache", error);
    }
}