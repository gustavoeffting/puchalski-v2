import axios from 'axios'

export const getWeather = async (lat, lng) => {
  const { data } = await axios.get(`${process.env.VUE_APP_OPENWEATHER_API}/weather?lat=${lat}&lon=${lng}&units=metric&lang=pt&appid=${process.env.VUE_APP_OPENWEATHER_APP_ID}`)
  return data
}

export const getForecast = async (lat, lng) => {
  const { data } = await axios.get(`${process.env.VUE_APP_OPENWEATHER_API}/forecast?lat=${lat}&lon=${lng}&units=metric&lang=pt&appid=${process.env.VUE_APP_OPENWEATHER_APP_ID}`)
  return data
}

export const getLocation = async (address) => {
  const { data } = await axios.get(`${process.env.VUE_APP_GOOGLE_API}/json?address=${address}&key=${process.env.VUE_APP_GOOGLE_API_KEY}`)
  return data
}
