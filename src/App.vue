<template>
  <v-app id="main-content">
    <v-container>
      <v-row :class="[temperature ? '' : 'home']" align="center" no-gutters>
        <v-col>
          <v-row v-if="!temperature" no-gutters>
            <v-col cols="12">
              <span class="fs-35 block text-center">Previsão do tempo</span>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" class="pt-4" no-gutters>
            <v-col cols="12" sm="8">
              <search-box :comboboxItems="items" @set-address="setAddress" />
            </v-col>
            <v-col cols="12" sm="2">
              <v-btn
                @click="getLocationInfo"
                class="btn-search"
                color="#1e1559"
                elevation="2"
                outlined
                x-large
              >
                Buscar
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="temperature" no-gutters>
        <v-col cols="12">
          <v-row class="mb-10" no-gutters>
            <v-col cols="12">
              <div>
                <span class="fs-100 block text-center"><b> {{ temperature }}°C </b></span>
                <span class="fs-25 block text-center"><b> {{ weather }} </b></span>
                <span class="fs-25 block text-center"> {{ location }} </span>
                <span class="fs-25 block text-center"> {{ currentDate }} </span>
              </div>
            </v-col>
          </v-row>
          <forecast-table :forecast="forecast" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { DateTime } from "luxon"
import { getWeather, getForecast, getLocation } from "./services.js"
export default {
  name: 'App',
  components: {
    ForecastTable: () => import("./components/ForecastTable.vue"),
    SearchBox: () => import("./components/SearchBox.vue")
  },
  data: () => ({
    address: null,
    comboBoxModel: null,
    currentDate: null,
    forecast: [],
    items: [],
    location: null,
    temperature: null,
    weather: null
  }),
  mounted () {
    const storedSearches = JSON.parse(localStorage.getItem('storedSearches'))

    if (storedSearches) {
      this.items = storedSearches
    }
  },
  methods: {
    async getLocationInfo () {
      if (!this.address || !this.address.trim()) {
        return
      }

      if (!this.items.includes(this.address)) {
        this.items.push(this.address)
        localStorage.setItem('storedSearches', JSON.stringify(this.items))
      }

      const storedCoordinatesList = JSON.parse(localStorage.getItem('storedCoordinatesList')) ? JSON.parse(localStorage.getItem('storedCoordinatesList')) : []

      const storedCoordinate = storedCoordinatesList.find((item) => item.address === this.address)

      if (storedCoordinate) {
        this.getWeatherInfo(storedCoordinate.lat, storedCoordinate.lng)
        this.getForecastInfo(storedCoordinate.lat, storedCoordinate.lng)
      } else {
        const { results } = await getLocation(this.address)
        if (results.length === 0) {
          alert('Não encontrado')
          return
        }

        const geocode = {
          "address": this.address,
          "lat": results[0].geometry.location.lat,
          "lng": results[0].geometry.location.lng
        }

        storedCoordinatesList.push(geocode)
        localStorage.setItem('storedCoordinatesList', JSON.stringify(storedCoordinatesList))

        this.getWeatherInfo(results[0].geometry.location.lat,results[0].geometry.location.lng)
        this.getForecastInfo(results[0].geometry.location.lat,results[0].geometry.location.lng)
      }
    },
    async getWeatherInfo (lat, lng) {
      const currentDateHour = this.getCurrentDateTime()
      this.currentDate = currentDateHour.currentDate

      const storedWeathersList = JSON.parse(sessionStorage.getItem('storedWeathersList')) ? JSON.parse(sessionStorage.getItem('storedWeathersList')) : []

      const storedWeather = storedWeathersList.find((item) => item.lastQuery === currentDateHour.currentHour && item.lat === lat && item.lng === lng)

      if (storedWeather) {
        this.location = storedWeather.location
        this.temperature = storedWeather.temperature
        this.weather = storedWeather.weather
      } else {
        const data = await getWeather(lat,lng)
        this.location = data.name
        this.temperature = Math.round(data.main.temp)
        this.weather = data.weather[0].description

        const weatherInfo = {
          "lastQuery": currentDateHour.currentHour,
          "lat": lat,
          "lng": lng,
          "location": data.name,
          "temperature": Math.round(data.main.temp),
          "weather": data.weather[0].description,
        }

        storedWeathersList.push(weatherInfo)
        sessionStorage.setItem('storedWeathersList', JSON.stringify(storedWeathersList))
      }
    },
    async getForecastInfo(lat, lng) {
      const currentDateHour = this.getCurrentDateTime()
      const storedForecastsList = JSON.parse(sessionStorage.getItem('storedForecastsList')) ? JSON.parse(sessionStorage.getItem('storedForecastsList')) : []

      const storedForecast = storedForecastsList.find((item) => item.lastQuery === currentDateHour.currentHour && item.lat === lat && item.lng === lng)
      if (storedForecast) {
        this.forecast = storedForecast.forecast
        return
      }

      const data = await getForecast(lat, lng)

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
        "lastQuery": currentDateHour.currentHour,
        "lat": lat,
        "lng": lng,
        "forecast": forecast
      }

      storedForecastsList.push(forecastInfo)
      sessionStorage.setItem('storedForecastsList', JSON.stringify(storedForecastsList))
    },
    getCurrentDateTime() {
      const dt = DateTime.now();

      return {
        currentDate: dt.toFormat('dd/MM'),
        currentHour: dt.toFormat('dd/MM/YYYY - HH')
      }
    },
    setAddress(address) {
      this.address = address
    }
  }
}
</script>
<style type="text/css">
#main-content {
  background: url('./assets/background.png') no-repeat center center/cover;
  font-family: 'Work Sans', sans-serif;
}

span {
  color: #1e1559;
}

#main-content .home {
  height: 90vh;
}

.fs-20 {
  font-size: 20px;
}

.fs-25 {
  font-size: 25px;
}

.fs-30 {
  font-size: 30px;
}

.fs-35 {
  font-size: 35px;
}

.fs-100 {
  font-size: 100px;
}

.block {
  display: block;
}

#main-content .btn-search {
  margin: 0 0 30px 20px;
}

@media (max-width: 600px) {
  #main-content .btn-search {
    margin: 0 0 30px 0;
    width: 100%;
  }
}
</style>