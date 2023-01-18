<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row class="backblur" no-gutters>
          <v-col>
            <span class="fs-20 block text-center">Previsão</span>
          </v-col>
        </v-row>
        <v-row v-for="item in forecast" :key="item.id" align="center" class="backblur" no-gutters>
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
export default {
  name: "ForecastTable",
  props: {
    forecast: {
      type: Array,
      required: true
    }
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