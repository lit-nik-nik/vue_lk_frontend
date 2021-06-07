<template>
  <v-container class="header-darkgray" fluid>

      <v-toolbar-title class="header-info logout">
        <v-btn small color="primary" @click="logout">
          <v-icon dark size="25">fa-reply</v-icon>
        </v-btn>
      </v-toolbar-title>

      <v-toolbar-title class="header-info logo text-center">
        <a href='https://massiv-yug.ru' target='_blank' class="v-btn">
          <v-img
              contain
              :src="logo"
              height="64"
          >
          </v-img>
        </a>
      </v-toolbar-title>

      <v-toolbar-items class="header-info menu">
        <v-btn
            plain
            class="pa-6"
            v-for="(item) in items_menu"
            :href="item.href"
        >
          {{item.label}}
        </v-btn>
      </v-toolbar-items>

  </v-container>
</template>

<script>
import {globalStore} from "@/storege/sharedStore";
import logoPNG from '../assets/logo.png';

export default {
    name: 'Header',
    data() {
      return {
        store: globalStore,
        logo: logoPNG,
        items_menu: [
          {
            id: 1,
            href: '#/settings/',
            label: 'Настройки'
          },
          {
            id: 2,
            href: '#/debt/',
            label: 'Долг'
          },
          {
            id: 3,
            href: '#/orders/',
            label: 'Заказы'
          }
        ]
      }
    },

    methods: {
      logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("selectHeaders");
        localStorage.removeItem("orders");
        this.store.user_login = {};
        window.location.href = '#/login/';
      }
    }
  }
</script>

<style>
.header-darkgray{
  background-color: #222;
  padding: 0 !important;
}

.header-info {
  width: 30%;
  display: block !important;
}

.logout {
  margin: 15px 25px;
}

.logout, .logo {
  float: left;
}

.menu{
  float: right;
  margin: 0 25px;
  text-align: right;
}

@media (max-width: 1010px) and (min-width: 680px){
  .menu {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 679px) {
  .menu, .logo {
    width: 100%;
    text-align: center;
  }


}
</style>