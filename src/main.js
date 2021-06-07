import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

import router from './routing';
import excel from 'vue-excel-export';

Vue.use(excel);

new Vue({
    vuetify,
    render: h => h(App),
    router: router
}).$mount('#app')
