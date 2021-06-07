<template>
  <v-card-title class="w-25">
    <v-container class="setting_con">
      <h3 class="header text-center text-uppercase">Кол-во заказов на странице</h3>
    </v-container>

    <v-container class="setting_con">
      <v-text-field
          label="Кол-во заказов на странице"
          :value="number"
          @input="change"
      ></v-text-field>
    </v-container>
  </v-card-title>
</template>

<script>

export default {
  name: 'numbersOrders',

  props: ['number'],

  methods: {
    change(newValue) {
      this.$emit('change_number', newValue)
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
