export const isSameLocation = (a, b) => {
    const la = a?.location ?? a
    const lb = b?.location ?? b
    if (!la || !lb) return false

    return (
        la.name === lb.name &&
        la.country === lb.country &&
        (la.region ?? "") === (lb.region ?? "")
    )
}

export const locationQuery = (weather) => {
    const loc = weather?.location
    if (!loc) return ""
    if (typeof loc.lat === "number" && typeof loc.lon === "number") {
        return `${loc.lat},${loc.lon}`
    }
    return loc.name
}