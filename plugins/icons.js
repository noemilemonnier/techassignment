import Vue from 'vue'

import {
    mdiEmail,
    mdiHomeVariant,
    mdiMapMarker,
    mdiThemeLightDark,
    mdiFileMultipleOutline,
    mdiMenu
} from '@mdi/js'

const icons = {
  mdiEmail,
  mdiHomeVariant,
  mdiMapMarker,
  mdiThemeLightDark,
  mdiFileMultipleOutline,
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
