const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const apiRequest = async (city, days) => {

    const response = await fetch(
        `${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}`
    );

    const data = await response.json();

    return data;
};