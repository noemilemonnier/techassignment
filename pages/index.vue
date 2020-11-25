<template>
<div>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          Welcome to Helsinki Services
        </v-card-title>
        <v-card-text>
          <p>This Web App will allow you to find services using <a href="https://dev.hel.fi/apis/service-map-backend-api"  target="_blank" rel="noopener noreferrer">Dev.Hel.Fi Service Map</a> in Helsinki, Finland.</p>
          <p>
            To navigate, click on <v-icon>{{$i.mdiMenu}}</v-icon> on the top left corner.
          </p>
          <p class="caption">Disclaimer: this web app was developed for Solteq Talent Evaluation Task.</p>
          <hr class="my-3">
          <a
            href="https://github.com/noemilemonnier/helsinki-services"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github Repository
          </a>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</div>
</template>