import Vue from 'vue'

import {
    mdiEmail,
    mdiLinkedin,
    mdiGithub,
    mdiHomeVariant,
    mdiMapMarker,
    mdiThemeLightDark,
    mdiMap,
    mdiCog,
    mdiMenu
} from '@mdi/js'

const icons = {
  mdiEmail,
  mdiGithub,
  mdiLinkedin,
  mdiHomeVariant,
  mdiMapMarker,
  mdiThemeLightDark,
  mdiMap,
  mdiCog,
  mdiMenu
}

export default ({ app }) => {
  const Icons = {
    install(vue, options) {
      vue.prototype.$i = icons
      app.$i = icons
    },
  }
  Vue.use(Icons)
}
