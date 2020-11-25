<template>
  <v-app>
    <v-navigation-drawer app  v-model="drawer">
      <v-list dense nav>
        <div class="text-center">
          <nuxt-link to="/">
            <img src="/img/logo.png" contain width="110px" height="110px" alt="AidLine"/>
          </nuxt-link>
        </div>
        <v-list-item class="overline font-weight-light" link nuxt to="/"><v-icon color="primary" size="28px">{{ $i.mdiHomeVariant }}</v-icon >&emsp;Home page</v-list-item>
        <v-list-item class="overline font-weight-light" link nuxt to="/resources"><v-icon color="primary" size="28px">{{ $i.mdiFileMultipleOutline }}</v-icon>&emsp;Resources</v-list-item>
        <v-list-item class="overline font-weight-light" link nuxt to="/contact"><v-icon color="primary" size="28px">{{ $i.mdiEmail }}</v-icon>&emsp;Contact</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app absolute>
      <v-app-bar-nav-icon alt="Navigation" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn icon color="secondary" @click.stop="onDarkModeToggled"><v-icon size="28px">{{ $i.mdiThemeLightDark }}</v-icon></v-btn>
    </v-app-bar>

    <v-main>
      <v-container >
        <nuxt />
      </v-container>
    </v-main>

    <v-footer app absolute padless>
      <v-card color="color-footer" elevation="3" flat tile width="100%">
        <v-card-text class="pb-1 primary--text">
          <div> Made by Noemi Lemonnier</div>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    i: {},
  }),
  mounted() {
    setTimeout(() => {
      if (localStorage.darkMode)
        this.$vuetify.theme.dark = localStorage.darkMode === 'true'
    }, 10)
  },
  methods: {
    onDarkModeToggled() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.darkMode = this.$vuetify.theme.dark
    },
  },
}
</script>
