<template>
  <v-app id="main-content">
    <v-container>
      <v-row :class="[latitude && longitude ? '' : 'home']" align="center" no-gutters>
        <v-col>
          <v-row v-if="!latitude || !longitude" no-gutters>
            <v-col cols="12">
              <span class="fs-35 block text-center">Previsão do tempo</span>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" class="pt-4" no-gutters>
            <v-col cols="12" sm="8">
              <search-box :comboboxItems="items" :loading="loading" @set-address="setAddress" />
            </v-col>
            <v-col cols="12" sm="2">
              <v-btn
                @click="getLocationInfo"
                class="btn-search"
                color="#1e1559"
                elevation="2"
                :loading="loading"
                outlined
                x-large
              >
                Buscar
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="latitude && longitude" no-gutters>
            <v-col cols="12">
              <weather-info :coordinates="coordinates" />
              <forecast-table :coordinates="coordinates" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { getLocation } from "./services.js"
export default {
  name: 'App',
  components: {
    ForecastTable: () => import("./components/ForecastTable.vue"),
    SearchBox: () => import("./components/SearchBox.vue"),
    WeatherInfo: () => import("./components/WeatherInfo.vue")
  },
  data: () => ({
    address: null,
    comboBoxModel: null,
    currentDate: null,
    items: [],
    latitude: null,
    longitude: null,
    loading: false,
  }),
  computed: {
    coordinates() {
      return { lat: this.latitude, lng: this.longitude }
    }
  },
  mounted () {
    const storedSearches = JSON.parse(localStorage.getItem('storedSearches'))

    if (storedSearches) {
      this.items = storedSearches
    }
  },
  methods: {
    async getLocationInfo () {
      this.loading = true

      if (!this.address || !this.address.trim()) {
        this.loading = false
        alert("Campo de busca obrigatorio")
        return
      }

      if (!this.items.includes(this.address)) {
        this.items.push(this.address)
        localStorage.setItem('storedSearches', JSON.stringify(this.items))
      }

      const storedCoordinatesList = JSON.parse(localStorage.getItem('storedCoordinatesList')) ? JSON.parse(localStorage.getItem('storedCoordinatesList')) : []

      const storedCoordinate = storedCoordinatesList.find((item) => item.address === this.address)

      if (storedCoordinate) {
        this.latitude = storedCoordinate.lat
        this.longitude = storedCoordinate.lng
      } else {
        const response = await getLocation(this.address)

        if (!response.success) {
          this.loading = false
          alert(response.error)
          return
        }

        if (response.data.results.length === 0) {
          this.loading = false
          alert('Não encontrado')
          return
        }

        const geocode = {
          "address": this.address,
          "lat": response.data.results[0].geometry.location.lat,
          "lng": response.data.results[0].geometry.location.lng
        }

        storedCoordinatesList.push(geocode)
        localStorage.setItem('storedCoordinatesList', JSON.stringify(storedCoordinatesList))

        this.latitude = response.data.results[0].geometry.location.lat
        this.longitude = response.data.results[0].geometry.location.lng
      }
      this.loading = false
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