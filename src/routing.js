import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import Orders from './pages/Orders';
import Login from './pages/Login';
import Debt from "./pages/Debt";
import Settings from "./pages/Settings";

const router = new VueRouter({
    routes: [
        {path: '/', name: 'home', component: Login},
        {path: '/orders/', name: 'orders', component: Orders},
        {path: '/login/', name: 'login', component: Login},
        {path: '/debt/', name: 'debt', component: Debt},
        {path: '/settings/', name: 'settings', component: Settings},
    ]
});

export default router;