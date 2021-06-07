<template>
  <v-container class="app-login">
    <v-layout justify-center>
      <v-dialog v-model="err_log_dialog" width="500">
        <v-card>
          <v-card-text>
            <h2>Неправильный логин или пароль!</h2>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="err_log_dialog = false">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <h2 class="title">Авторизация пользователя</h2>

    <v-form ref="form" v-model="valid">

      <v-text-field
          class="auth"
          v-model="login.user_name"
          :rules="emailRules"
          label="Логин"
          required
          filled
      ></v-text-field>

      <v-text-field
          class="auth"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          v-model="login.user_password"
          :rules="passRules"
          label="Пароль"
          required
          filled
          @click:append="showPass = !showPass"
      ></v-text-field>

      <v-btn
          class="auth-btn"
          :disabled="!valid"
          color="success"
          @click="oauth"
      >Войти
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios'
import {globalStore} from '../storege/sharedStore'

export default {

  data() {
    return {
      store: globalStore.firebirdDB,
      login: {},
      err_log_dialog: false,
      valid: false,
      emailRules: [
        v => !!v || 'E-mail обезательное поле!',
      ],
      passRules: [
        v => !!v || 'Пароль обезательное поле!',
      ],
      showPass: false
    }
  },

  created() {
    let user = localStorage.getItem("user");

    if(user) {
      window.location.href = '#/orders/';
    }
  },

  methods: {
    async oauth() {
      await axios.post(this.store.url + this.store.port + '/login/', this.login)
        .then(res => {
          if (res.data.login == 'ok') {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            this.store.user_login = res.data.user;
            window.location.href = '#/orders/';
          } else {
            this.err_log_dialog = true;
          }
        })
        .catch(res => {
          this.$root.$emit('response_error', res.status);
          alert(res + 'error');
        })
    }
  }
}
</script>

<style scoped>
.app-login {
  max-width: 400px !important;
  margin: 150px auto;
  border-radius: 30px;
  box-shadow: 0 0 5px 5px #eee;
  background: white;
}

.auth {
  margin: 0 auto;
  width: 90%;
}

.auth-btn {
  width: 50%;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  margin-bottom: 15px;
}

.title {
  text-align: center;
  padding-bottom: 20px;
}
</style>