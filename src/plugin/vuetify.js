import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/lib/util/colors'

import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#1C76CE', // '#3f51b5',
        secondary: '#673ab7',
        accent: '#F16922',
        error: '#f44336',
        warning: '#ff5722',
        info: '#607d8b',
        success: '#2196f3'
      },
      dark: {
        primary: colors.blue.lighten3
      }
    }
  }
}

export default new Vuetify(opts)
