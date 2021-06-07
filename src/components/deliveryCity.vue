<template>
  <v-dialog
      v-model="active"
      persistent
      max-width="400">
    <v-card>
      <v-card-title class="text-center d-block">
        В какой город отправить заказ -<br/>
        <i class="text-body-1">{{order}}</i>
      </v-card-title>

     <v-select
         label="Город"
         v-model="city"
         :items="delivery_city"
         @input="changeCity"
         class="pa-5"
         prepend-icon="mdi-city"
         dense
     ></v-select>

      <v-card-actions>
        <v-btn
            color="red darken-1"
            text
            :disabled="!inputCity"
            @click="delCity(order)"
        >
          Удалить
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
            color="blue-grey darken-1"
            text
            @click="cancleCity"
        >
          Отмена
        </v-btn>

        <v-btn
            color="green darken-1"
            text
            @click="saveCity(order, inputCity)"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  saveCity,
  deleteCity
} from "@/service/service";

export default {
    name: 'DeliveryCity',
    props: ['user', 'active', 'order', 'random', 'city', 'update', 'delivery_city'],
    data() {
      return {
        inputCity: this.city,
      }
    },

  created() {
  },

  methods: {
      disable() {
        let active = false
        this.$emit('disabled', active)
      },

      forceUpdate() {
        let update = this.update + 1;
        this.$emit('update', update)
      },

      changeCity(value) {
        this.inputCity = value;
      },

      cancleCity() {
        this.inputCity = this.city;
        this.disable()
      },

      saveCity(order, city) {
        const {client_id} = this.user;
        saveCity(order, city, client_id);
        this.$emit('addCity', city);
        this.disable()
        this.forceUpdate();
      },

      delCity(order) {
        let clearCity = '';
        this.$emit('addCity', clearCity);
        deleteCity(order);
        this.disable();
        this.forceUpdate();
      }
    }
  }
</script>

<style>

</style>