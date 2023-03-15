<template>
  <v-container>
    <v-row v-if="loading" justify="center">
      <v-progress-circular color="#1e1559" indeterminate :size="100" />
    </v-row>
    <v-row v-else class="mb-10" no-gutters>
      <v-col cols="12">
        <div>
          <span class="fs-100 block text-center"><b> {{ temperature }}°C </b></span>
          <span class="fs-25 block text-center"><b> {{ weather }} </b></span>
          <span class="fs-25 block text-center"> {{ location }} </span>
          <span class="fs-25 block text-center"> {{ currentDate }} </span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

import { DateTime } from "luxon"
import { getWeather } from "../services.js"
export default {
  name: "WeatherInfo",
  data: () => ({
    currentDate: null,
    loading: false,
    location: null,
    temperature: null,
    weather: null
  }),
  props: {
    coordinates: {
      type: Object,
      required: true
    },
  },
  watch: {
    coordinates: {
      handler(newValue) {
        this.getWeatherInfo(newValue.lat, newValue.lng)
      },
      immediate: true
    }
  },
  methods: {
    async getWeatherInfo (lat, lng) {
      this.loading = true

      const dt = DateTime.now()

      this.currentDate = dt.toFormat('dd/MM')
      const currentHour = dt.toFormat('dd/MM/YYYY - HH')

      const storedWeathersList = JSON.parse(sessionStorage.getItem('storedWeathersList')) ? JSON.parse(sessionStorage.getItem('storedWeathersList')) : []

      const storedWeather = storedWeathersList.find((item) => item.lastQuery === currentHour && item.lat === lat && item.lng === lng)

      if (storedWeather) {
        this.location = storedWeather.location
        this.temperature = storedWeather.temperature
        this.weather = storedWeather.weather
      } else {
        const response = await getWeather(lat,lng)

        if (!response.success) {
          this.loading = false
          alert(response.error)
          return
        }

        this.location = response.data.name
        this.temperature = Math.round(response.data.main.temp)
        this.weather = response.data.weather[0].description

        const weatherInfo = {
          "lastQuery": currentHour,
          "lat": lat,
          "lng": lng,
          "location": response.data.name,
          "temperature": Math.round(response.data.main.temp),
          "weather": response.data.weather[0].description,
        }

        storedWeathersList.push(weatherInfo)
        sessionStorage.setItem('storedWeathersList', JSON.stringify(storedWeathersList))
      }
      this.loading = false
    },
  }
}
</script>