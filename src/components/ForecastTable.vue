<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      multi-line
      top
      color="red"
    >
      Erro ao buscar previsão. Tente novamente mais tarde.
    </v-snackbar>
    <v-row>
      <v-col cols="12">
        <v-row class="backblur" no-gutters>
          <v-col>
            <span class="fs-20 block text-center">Previsão</span>
          </v-col>
        </v-row>
        <v-row v-if="loading" class="mt-5" justify="center">
          <v-progress-circular color="#1e1559" indeterminate :size="100" />
        </v-row>
        <v-row v-else v-for="item in forecast" :key="item.id" align="center" class="backblur" no-gutters>
          <v-col cols="6">
            <span class="fs-30 block text-center"> {{ item.date }} </span>
          </v-col>
          <v-col cols="6">
            <span class="fs-20 block text-center"> {{ item.temperature }}°C<br> {{ item.weather }} </span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { DateTime } from "luxon"
import { getForecast } from "../services.js"
export default {
  name: "ForecastTable",
  data: () => ({
    forecast: [],
    loading: false,
    snackbar: false,
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
        this.getForecastInfo(newValue.lat, newValue.lng)
      },
      immediate: true
    }
  },
  methods: {
    async getForecastInfo(lat, lng) {
      this.loading = true

      const dt = DateTime.now()
      const currentHour = dt.toFormat('dd/MM/YYYY - HH')

      const storedForecastsList = JSON.parse(sessionStorage.getItem('storedForecastsList')) ? JSON.parse(sessionStorage.getItem('storedForecastsList')) : []

      const storedForecast = storedForecastsList.find((item) => item.lastQuery === currentHour && item.lat === lat && item.lng === lng)
      if (storedForecast) {
        this.forecast = storedForecast.forecast
        this.loading = false
        return
      }

      const response = await getForecast(lat, lng)

      if (!response.success) {
        this.loading = false
        this.snackbar = true
        return
      }

      const { data } = response

      const forecastList = data.list.filter(element => {
        return DateTime.fromISO(new Date(element.dt_txt).toISOString()).hour === 12 // weather at 12h
      })

      const forecast = forecastList.map((item, idx) => {
        return {
          id: idx,
          date: DateTime.fromISO(new Date(item.dt_txt).toISOString()).toFormat('dd/MM'),
          weather: item.weather[0].description,
          temperature: Math.round(item.main.temp)
        }
      })

      this.forecast = forecast

      const forecastInfo = {
        "lastQuery": currentHour,
        "lat": lat,
        "lng": lng,
        "forecast": forecast
      }

      storedForecastsList.push(forecastInfo)
      this.loading = false
      sessionStorage.setItem('storedForecastsList', JSON.stringify(storedForecastsList))
    },
  }
}
</script>
<style type="text/css">
.backblur {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid transparent;
  margin: 5px;
  border-radius: 5px;
}
</style>