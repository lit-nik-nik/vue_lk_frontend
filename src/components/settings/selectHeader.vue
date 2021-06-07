<template>
  <v-card-title>
    <v-container class="setting_con">
      <h3 class="header text-center text-uppercase">Столбцы таблицы</h3>
    </v-container>

    <v-container class="setting_con" fluid>
      <v-checkbox
          color="black"
          class="d-block mr-4 float-left label"
          v-for="(item) in headers"
          :key="item.id"
          :value="item.id"
          :label="item.text"
          v-model="selects"
          @change="select"
      ></v-checkbox>
    </v-container>


  </v-card-title>
</template>

<script>

export default {
  name: 'SelectHeader',

  props: ['selects'],

  data() {
    return{
      headers: [
        {id: 1, text: 'Наименование'},
        {id: 2, text: 'Дата заказа'},
        {id: 3, text: 'Статус заказа'},
        {id: 4, text: 'Стоимость'},
        {id: 5, text: 'Оплачено'},
        {id: 6, text: 'Долг'},
        {id: 7, text: 'Дата упаковки'},
        {id: 8, text: 'Дата отгрузки'},
        {id: 9, text: 'Коробок упаковано'},
        {id: 10, text: 'Коробок отгружено'},
        {id: 11, text: 'Водитель'},
        {id: 12, text: 'Файл заказа'},
        {id: 13, text: 'Город доставки'}
      ],
      selectHeader: this.selects
    }
  },

  methods: {
    select(newSelect) {
      this.$emit('change_header', newSelect)
    }
  }
}
</script>

<style>
.label label {
  font-size: 14px;
}

.v-input {
  margin-top: 0;
  padding-top: 0;
}

</style>