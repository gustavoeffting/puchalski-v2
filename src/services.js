import axios from 'axios'

export const getForecast = async (lat, lng) => {
  try {
    const { data } = await axios.get(`${process.env.VUE_APP_OPENWEATHER_API}/forecast?lat=${lat}&lon=${lng}&units=metric&lang=pt&appid=${process.env.VUE_APP_OPENWEATHER_APP_ID}`)
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

export const getLocation = async (address) => {
  try {
    const { data } = await axios.get(`${process.env.VUE_APP_GOOGLE_API}/json?address=${address}&key=${process.env.VUE_APP_GOOGLE_API_KEY}`)
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

export const getWeather = async (lat, lng) => {
  try {
    const { data } = await axios.get(`${process.env.VUE_APP_OPENWEATHER_API}/weather?lat=${lat}&lon=${lng}&units=metric&lang=pt&appid=${process.env.VUE_APP_OPENWEATHER_APP_ID}`)
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}