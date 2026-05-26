export function getDayChartData(forecast) {
  const hours = forecast.forecastday[0].hour
  const now = new Date()
  const currentHour = now.getHours()

  return {
    labels: hours.map((hour) => hour.time.split(" ")[1]),
    temps: hours.map((hour) => Math.round(hour.temp_c)),
    currentIndex: hours.findIndex((hour) => new Date(hour.time).getHours() === currentHour),
  }
}

export function get3DayChartData(forecast) {
  const days = forecast.forecastday
  return {
    labels: days.map((day) => {
      const d = new Date(day.date)
      return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`
    }),
    temps: days.map((day) => Math.round(day.day.avgtemp_c)),
    currentIndex: -1,
  }
}