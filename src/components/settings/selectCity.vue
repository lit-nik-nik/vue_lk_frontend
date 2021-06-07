<template>
  <v-card-title class="w-25">
    <v-container class="setting_con">
      <h3 class="header text-center text-uppercase">Города доставки</h3>
    </v-container>

    <v-container class="setting_con">
      <v-text-field
          label="Введите новый город доставки"
          :value="addCity"
          @input="change"
      >
        <v-icon v-if="addCity" slot="append" color="green" @click="saveCity(addCity, indexCity)">mdi-check-bold</v-icon>
      </v-text-field>

      <v-list-item-group>
          <v-list-item
              v-for="(item, index) in delivery_city"
              :key="index"
              class="text-body-1"
          >
              {{index+1}}. {{item}}
              <v-spacer></v-spacer>
              <v-icon color="red" class="text-right mr-3" @click="deleteCity(index)">mdi-delete</v-icon>
              <v-icon color="warning" class="text-right" @click="editCity(item, index)">mdi-pencil</v-icon>
          </v-list-item>
      </v-list-item-group>
    </v-container>
  </v-card-title>
</template>

<script>

export default {
  name: 'SelectCity',

  props: ['delivery_city'],

  data() {
    return {
      addCity: '',
      indexCity: ''
    }
  },

  methods: {
    change(newValue) {
      this.addCity = newValue
    },

    editCity(city, index) {
      this.addCity = city;
      this.indexCity = index;
    },

    saveCity(city, index) {
      let new_delivery_city = this.delivery_city;

      if (index === 0 || index) {
        new_delivery_city[index] = city;
        this.$emit('change_delivery_city', new_delivery_city);
      } else {
        new_delivery_city.push(city);
        this.$emit('change_delivery_city', new_delivery_city);
      }

      this.addCity = '';
      this.indexCity = '';
    },

    deleteCity(index) {
      let new_delivery_city = this.delivery_city;
      new_delivery_city.splice(index, 1);

      this.$emit('change_delivery_city', new_delivery_city);
    }
  }
}
</script>

<style scoped>
.w-25 {
  width: 25%;
  margin: 0 auto;
}

@media (max-width: 1264px){
  .w-25 {
    width: 100%;
  }
}

@media (max-width: 469px) {
  h3 {
    font-size: 1rem;
  }
}
</style>