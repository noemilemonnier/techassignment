import Vue from 'vue';
import Vuetify from 'vuetify';
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';

Vue.use(Vuetify);
Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: process.env.API_GOOGLE,
});