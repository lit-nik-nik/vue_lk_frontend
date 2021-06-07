import '@fortawesome/fontawesome-free/css/all.css'// Ensure you are using css-loader
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)


export default new Vuetify({
    icons: {
        iconfont: 'mdiSvg'
    },
    theme: {
        themes: {
            light: {
                primary: '#235382',
                secondary: '#b0bec5',
                anchor: '#8c9eff',
                error: '#b93b32',
                red: '#b93b32',
                success: '#4b8e4d'
            },
        },
    }
})
