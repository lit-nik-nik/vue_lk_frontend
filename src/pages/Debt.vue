<template>
  <v-container fluid>
    <v-progress-linear v-if="loader_grid" :indeterminate="true"></v-progress-linear>

    <v-card class="text-center my-4">
      <v-card-title>
        <h3 class="text-uppercase">
          Долг по {{ orderDebts }} заказам составляет {{ dept }} руб.
        </h3>

        <v-spacer></v-spacer>

        <v-btn dark class="mr-5">
          <export-excel
              :data="orders_items"
              :fields="orders_fields"
              type="xls"
              name="Неоплаченные_заказы.xls">
            Скачать XLS
          </export-excel>
        </v-btn>

        <v-btn dark>
          <export-excel
              :data="orders_items"
              :fields="orders_fields"
              type="html"
              name="Неоплаченные_заказы.html">
            Скачать HTML
          </export-excel>
        </v-btn>
      </v-card-title>
    </v-card>

    <v-data-table
        dense
        style="min-height: 650px;"
        :headers="selectedHeaders"
        :items="orders_items"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        hide-default-footer
        class="order-1"
        disable-sort
        no-data-text="Подождите... Идет загрузка заказов"

    >
      <template v-slot:item.orders_files="{ item }">
        <v-chip class="my-2" color="green"><a
            :href="'//lk.massiv-yug.ru/order_files' + item.file_calc_client"
            target="_blank"
            class="v-btn"
        >{{ item.orders_files }}</a>
        </v-chip>
      </template>

    </v-data-table>

    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import {
  checkAuth,
  getDebt,
  getOrders,
  getSettings,
  postNewSettings
} from "@/service/service";

export default {
  data() {
    return {
      orders_items: [],
      orders_fields: {
        'Наименование заказа': 'itm_ordernum',
        'Дата заказа': 'StartDate',
        'Статус заказа': 'status_description',
        'Общая стоимость': 'TotalCost',
        'Оплачено': 'order_pay',
        'Долг': 'Debt',
      },
      user: {},
      loader: false,
      loader_grid: false,
      dept: 0,
      orderDebts: 0,
      page: 1,
      pageCount: 0,
      itemsPerPage: 0,
      selectedHeaders: []
    };
  },

//Фильтры для таблицы
  computed: {
    headers () {
      return [
        {id: 1, text: 'Наименование', width: '8.3%', value: 'itm_ordernum', filterable: true},
        {id: 2, text: 'Дата заказа', value: 'StartDate', width: '8.3%'},
        {id: 3, text: 'Статус заказа', value: 'status_description', width: '8.3%'},
        {id: 4, text: 'Стоимость', value: 'TotalCost', class: 'cost', width: '8.3%'},
        {id: 5, text: 'Оплачено', value: 'order_pay', width: '8.3%'},
        {id: 6, text: 'Долг', value: 'Debt', width: '8.3%'},
        {id: 7, text: 'Дата упаковки', value: 'date_pack' ,  width: '8.3%'},
        {id: 8, text: 'Дата отгрузки', value: 'date_out' ,  width: '8.3%'},
        {id: 9, text: 'Коробок упаковано', value: 'box_packed',  width: '8.3%'},
        {id: 10, text: 'Коробок отгружено', value: 'box_out', width: '8.3%'},
        {id: 11, text: 'Водитель', value: 'driver_name' , width: '8.3%'},
        {id: 12, text: 'Файл заказа', value: 'orders_files', width: '8.3%',}
      ]
    },
  },

  async created() {
    //проверка авторизации пользователя
    checkAuth();

    //сохранениее данных пользователя в локальное хранилищ
    this.user = JSON.parse(localStorage.getItem("user"));
    this.loader_grid = true;

    //получаем кол-во заказов на страницу
    getSettings(this.user.client_id)
        .then(data => this.itemsPerPage = data.number_orders ? data.number_orders : 100)

    //получение массива данный заказов
    await getOrders(this.user.user_name)
      .then(orders => {
        orders.forEach(order => {
          if (order.Debt) {
            this.orderDebts += 1;
            this.orders_items.push(order);
          }
        })
      });

    //Изменение массива заказов
    this.changeOrders();

    //Получени Debit пользователя
    getDebt(this.user.user_name)
        .then(res => this.dept = res.SumDebt[0])

    //получение столбцов таблицы для отображения
    postNewSettings(this.user.client_id, this.user.user_name)
      .then(() => {
        getSettings(this.user.client_id)
          .then(data => {
            localStorage.setItem('selectHeaders', JSON.stringify(data.select_header));
            data.select_header.forEach(item => {
              this.headers.forEach(header => {
                if (header.id === item) {
                  this.selectedHeaders = [...this.selectedHeaders, header];
                }
              })
            })
          })
      })

    this.loader_grid = false;
  },

  methods: {
    changeOrders() {
      this.orders_items.map(order => {
        //создание массива для скачивания файла
        order.orders_files = "Скачать";
        let regexp = /^\p{L}\\/gu;
        //Написание наименования водителя большими буквами
        if (order.driver_name) {
          order.driver_name = order.driver_name.toUpperCase();
        }
        //изменения файла для скачивания, для определенного клиента
        if (this.user.user_name === 'KL.TEHNOLOG@GMAIL.COM') {
          order.file_calc_client = order.file_calc_manager;
        }
        //корректировка адреса скачивания файла
        if (regexp.test(order.file_calc_client)) {
          order.file_calc_client = order.file_calc_client.slice(1);
        }
      })
    }
  }
};

</script>

<style scoped>
  h3 {
    color: #333333;
  }
</style>