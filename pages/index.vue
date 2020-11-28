<template>
<div>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="mt-10" style="width: 100%; height=100%" flat outlined>
        <v-card-title class="headline">
          Welcome to Helsinki Services
        </v-card-title>
        <v-card-text>
          <p> This Web App will allow you to find services using <a href="https://dev.hel.fi/apis/service-map-backend-api"  target="_blank" rel="noopener noreferrer">Dev.Hel.Fi Service Map</a> in Helsinki, Finland.</p>
          <p> To navigate, click on <v-icon>{{$i.mdiMenu}}</v-icon> on the top left corner. </p>
          <hr class="my-3">
          <v-row align="center" justify="center" no-gutters>
              <a href="https://github.com/noemilemonnier/helsinki-services" target="_blank" rel="noopener noreferrer"> Github Repository </a>
          </v-row>
          <hr class="my-3">
          <p align="justify" class="mt-7 caption"><v-icon class="spin">{{$i.mdiCog}}</v-icon> This web app uses NuxtJS, Vue2, Vuetify, Google Map APIs and Dev.Hel.Fi Service Map API. This web app was developed for Solteq Talent Evaluation Task.</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</div>
</template>

<script>
export default {
    head: () => ({
        title: "Welcome"
    }),
}
</script>
<style scoped>
@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}

.spin {
  animation-name: spin;
  animation-duration: 4000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
