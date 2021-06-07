<template>
  <v-container fluid>
    <v-card class="my-4">
      <v-card-title class="text-center">
        <h3 class="text-uppercase">Настройки</h3>

        <v-spacer></v-spacer>

        <v-btn
            color="green"
            @click="save"
            class="mx-3"
        >Сохранить</v-btn>
        <v-btn
            color="error"
            @click="reset"
            class="mx-3"
        >По умолчанию</v-btn>

      </v-card-title>
    </v-card>

    <SelectHeader
        :selects="select_header"
        @change_header="select_header = $event"/>

    <NumbersOrders
        class="float-left mr-4 mb-4"
        :number="number_orders"
        @change_number="number_orders = $event"/>

    <SelectCity
        class="float-left mr-4 mb-4"
        :delivery_city="delivery_city"
        @change_delivery_city="delivery_city = $event"/>

  </v-container>
</template>

<script>
import {checkAuth, getSettings, putSettings} from "@/service/service";
import NumbersOrders from "@/components/settings/numbersOrders";
import SelectHeader from "@/components/settings/selectHeader";
import SelectCity from "@/components/settings/selectCity";

export default {
  components: {SelectCity, SelectHeader, NumbersOrders},
  data() {
    return {
      user: '',
      number_orders: 0,
      select_header: [],
      delivery_city: []
    }
  },

  async created() {
    //проверка авторизации пользователя
    checkAuth();

    this.user = JSON.parse(localStorage.getItem("user"));

    await getSettings(this.user.client_id)
        .then(data => {
          this.number_orders = data.number_orders ? data.number_orders : 100
          this.select_header = data.select_header
          this.delivery_city = data.delivery_city
        });

  },

  methods: {
    async reset() {
      this.select_header = [1,2,3,4,5,6,7,8,9,10,11,12,13];
      this.number_orders = 100;

      await putSettings(this.user.client_id, this.number_orders, this.select_header);

      document.location.href = '#/orders/';
    },
    async save() {
      const compareNumeric = (a, b) => {
        if (a > b) return 1;
        if (a == b) return 0;
        if (a < b) return -1;
      }

      this.select_header.sort(compareNumeric);

      await putSettings(this.user.client_id, this.number_orders, this.select_header, this.delivery_city);

      document.location.href = '#/orders/';
    },
  }
}
</script>

<style scoped>
@media (max-width: 569px) {
  h3 {
    margin-bottom: 15px;
    width: 100%;
  }
  .v-btn {
    margin-bottom: 10px;
    width: 95%;
  }
}
</style>