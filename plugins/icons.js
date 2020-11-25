import Vue from 'vue'

import {
    mdiEmail,
    mdiHomeVariant,
    mdiMapMarker,
    mdiThemeLightDark,
    mdiMap,
    mdiMenu
} from '@mdi/js'

const icons = {
  mdiEmail,
  mdiHomeVariant,
  mdiMapMarker,
  mdiThemeLightDark,
  mdiMap,
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
