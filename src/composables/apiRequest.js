import api from "../api/client";

export const apiRequest = async (
    city = "auto:ip",
    days = 3
) => {
    const { data } = await api.get("/forecast.json", {
        params: {
            q: city,
            days,
        },
    });
    return data;
};

export const searchCities = async (query) => {
    const { data } = await api.get("/search.json", {
        params: {
            q: query,
        },
    });
    return data;
};