const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const apiRequest = async (city = "auto:ip", days = 3) => {
    const response = await fetch(
        `${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}`);
    const data = await response.json();
    return data;
};

export const searchCities = async (query) => {
    const res = await fetch(
        `${API_URL}/search.json?key=${API_KEY}&q=${query}`
    );
    return await res.json();
};