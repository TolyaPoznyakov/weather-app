const weatherMap = {
    sunny: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [
        1063, 1150, 1153,
        1180, 1183, 1186,
        1189, 1192, 1195,
        1240, 1243, 1246
    ],
    thunder: [1087, 1273, 1276],
    snow: [
        1066, 1114, 1117,
        1210, 1213, 1216,
        1219, 1222, 1225,
        1255, 1258, 1279, 1282
    ]
};

const dayThemes = {
    sunny: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    clouds: "linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)",
    mist: "linear-gradient(135deg, #757f9a 0%, #d7dde8 100%)",
    rain: "linear-gradient(135deg, #314755 0%, #26a0da 100%)",
    thunder: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    snow: "linear-gradient(135deg, #e6dada 0%, #274046 100%)",
    default: "linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%)"
};

const nightThemes = {
    clouds: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    mist: "linear-gradient(135deg, #3e5151 0%, #decba4 100%)",
    rain: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
    thunder: "linear-gradient(135deg, #000000 0%, #434343 100%)",
    snow: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)",
    default: "linear-gradient(135deg, #141e30 0%, #243b55 100%)"
};

export const getWeatherBackground = (code, isDay) => {
    const themes = isDay ? dayThemes : nightThemes;

    for (const type in weatherMap) {
        if (weatherMap[type].includes(code)) {
            return themes[type];
        }
    }
    return themes.default;
};