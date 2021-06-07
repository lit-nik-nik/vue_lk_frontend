<template>
  <v-container fluid :key="componentKey">
    <v-progress-linear v-if="loader_grid" :indeterminate="true"></v-progress-linear>

    <v-card>
      <v-card-title>
        <h3 class="mx-3 text-uppercase">Заказы</h3>

        <v-spacer></v-spacer>

        <v-btn
            :dark="hideFilters"
            @click="hideChangeFilter"
            class="mr-4 v-btn-light"
        >
          Фильтры таблицы
        </v-btn>

        <v-spacer></v-spacer>

        <h3 v-if="dept"><a href="#/debt/">Долг - {{ dept }} руб.</a></h3>
        <h3 v-else>Долг погашен</h3>
      </v-card-title>

      <v-data-table
          style="min-height: 650px;"
          :headers="selectedHeaders"
          :items="orders_items"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
          hide-default-footer
          class="order-1"
          disable-sort
          dense
          no-data-text="Подождите... Идет загрузка заказов"
      >
        <template v-slot:item.orders_files="{ item }">
          <v-chip
              class="my-1"
              color="green">
            <a
                :href="'//lk.massiv-yug.ru/order_files' + item.file_calc_client"
                target="_blank"
                class="v-btn">
              {{ item.orders_files }}
            </a>
          </v-chip>
        </template>

        <template v-slot:item.delivery_city="{ item }">
          <div v-if="!item.date_out && item.status_description !== 'Отгружен полностью' && item.status_description !== 'Закрыт'">
            <div v-if="item.delivery_city.city">
              <v-btn
                  class="ma-0"
                  x-small
                  plain
                  color="black"
                  @click="openModal(item)">
                {{item.delivery_city.city}} <v-icon color="warning">mdi-pencil</v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-btn
                class="ma-0"
                x-small
                plain
                color="primary"
                @click="openModal(item)">
                  <v-icon>mdi-plus</v-icon>Выбрать город
              </v-btn>
            </div>
            <DeliveryCity
                :random="random"
                :active="item.delivery_city.dialog"
                :order="item.itm_ordernum"
                :city="item.delivery_city.city"
                :user="user"
                :delivery_city="delivery_city"
                @disabled="item.delivery_city.dialog = $event"
                @addCity="item.delivery_city.city = $event"
                :update="componentKey"
                @update="componentKey = $event"/>
          </div>
        </template>

        <template v-slot:top>
          <v-card-title v-if="!hideFilters">
            <v-container class="py-0">
              <h3 class="header text-center text-uppercase">Фильтры</h3>
            </v-container>

            <v-container fluid>
              <div class="row">
                <div
                    class="col-sm py-1"
                    v-for="item in filters"
                    :class="item.display"
                    :key="item.id">
                  <v-text-field
                      v-if="item.id === 12 || item.id === 13"
                      v-model="item.model"
                      type="text"
                      :label="item.label"
                      class="d-none"
                  ></v-text-field>
                  <v-select
                      v-else-if="item.select"
                      v-model="item.model"
                      :items='item.select'
                      :label="item.label"
                  ></v-select>
                  <v-text-field
                      v-else
                      v-model="item.model"
                      type="text"
                      :label="item.label"
                  ></v-text-field>
                </div>
              </div>
            </v-container>
          </v-card-title>
        </template>
      </v-data-table>

      <div class="text-center pt-2 mx-6">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import {
  checkAuth,
  getAllCityClient,
  getDebt,
  getOrders,
  getSettings,
  postNewSettings
} from "@/service/service";
import DeliveryCity from "@/components/deliveryCity";

export default {
  components: {DeliveryCity},
  data() {
    return {
      orders_items: [],
      user: {},
      loader: false,
      loader_grid: false,
      dept: 0,
      page: 1,
      pageCount: 0,
      itemsPerPage: 0,
      filters: {
        name_order: {
          id: 1,
          model: '',
          label: 'Наименование',
          display: ''
        },
        date_order: {
          id: 2,
          model: '',
          label: 'Дата заказа',
          display: ''
        },
        status_description: {
          id: 3,
          model: '',
          label: 'Статус',
          select: [''],
          display: ''
        },
        cost: {
          id: 4,
          model: '',
          label: 'Стоимость',
          display: ''
        },
        payment: {
          id: 5,
          model: '',
          label: 'Оплачено',
          display: ''
        },
        debt: {
          id: 6,
          model: '',
          label: 'Долг',
          display: ''
        },
        date_pack: {
          id: 7,
          model: '',
          label: 'Дата упаковки',
          display: ''
        },
        date_out: {
          id: 8,
          model: '',
          label: 'Дата отгрузки',
          display: ''
        },
        box_pack: {
          id: 9,
          model: '',
          label: 'Коробок упаковано',
          display: ''
        },
        box_out: {
          id: 10,
          model: '',
          label: 'Коробок отгружено',
          display: ''
        },
        driver_name: {
          id: 11,
          model: '',
          label: 'Водитель',
          select: [''],
          display: ''
        },
        orders_files: {
          id: 12,
          model: '',
          label: 'Файл заказа',
          display: ''
        },
        delivery_city: {
          id: 13,
          model: '',
          label: 'Город доставки',
          display: ''
        }
      },
      hideFilters: true,
      selectedHeaders: [],
      random: 0,
      componentKey: 0,
      delivery_city: ''
    };
  },

//Фильтры для таблицы
  computed: {
    headers() {
      const {
        name_order,
        date_order,
        status_description,
        cost,
        payment,
        debt,
        date_pack,
        date_out,
        box_pack,
        box_out,
        driver_name
      } = this.filters;
      return [
        {
          id: 1, text: 'Наименование', width: '8.3%', value: 'itm_ordernum', filterable: true,
          filter: value => {
            let upperValue = value.toUpperCase(),
                upperNameOrder = name_order.model.toUpperCase();

            if (!upperNameOrder) return true;

            if (upperValue.includes(upperNameOrder)) {
              return value;
            }
          }
        },
        {
          id: 2, text: 'Дата заказа', value: 'StartDate', width: '8.3%',
          filter: value => {
            if (!date_order.model) return true;

            if (value.includes(date_order.model)) {
              return value;
            }
          }
        },
        {
          id: 3, text: 'Статус', value: 'status_description', width: '8.3%',
          filter: value => {
            if (!status_description.model) return true;

            return value === status_description.model;
          },
        },
        {
          id: 4, text: 'Стоимость', value: 'TotalCost', class: 'cost', width: '8.3%',
          filter: value => {
            if (!cost.model) return true;

            return value >= parseInt(cost.model);
          }
        },
        {
          id: 5, text: 'Оплачено', value: 'order_pay', width: '8.3%',
          filter: value => {
            if (!payment.model) return true;

            return value >= parseInt(payment.model);
          }
        },
        {
          id: 6, text: 'Долг', value: 'Debt', width: '8.3%',
          filter: value => {
            if (!debt.model) return true;

            return value >= parseInt(debt.model);
          }
        },
        {
          id: 7, text: 'Дата упаковки', value: 'date_pack', width: '8.3%',
          filter: value => {
            if (!date_pack.model) return true;

            if (value.includes(date_pack.model)) {
              return value;
            }
          },
        },
        {
          id: 8, text: 'Дата отгрузки', value: 'date_out', width: '8.3%',
          filter: value => {
            if (!date_out.model) return true;

            if (value.includes(date_out.model)) {
              return value;
            }
          },
        },
        {
          id: 9, text: 'Коробок упаковано', value: 'box_packed', width: '8.3%',
          filter: value => {
            if (!box_pack.model) return true;

            return value === parseInt(box_pack.model);
          }
        },
        {
          id: 10, text: 'Коробок отгружено', value: 'box_out', width: '8.3%',
          filter: value => {
            if (!box_out.model) return true;

            return value === parseInt(box_out.model);
          }
        },
        {
          id: 11, text: 'Водитель', value: 'driver_name', width: '8.3%',
          filter: value => {
            if (!driver_name.model) return true;

            return value === driver_name.model;
          },
        },
        {id: 12, text: 'Файл заказа', value: 'orders_files', width: '8.3%',},
        {id: 13, text: 'Город доставки', value: 'delivery_city', width: '8.3%'}
      ]
    },
  },

  created() {
    //проверка авторизации пользователя
    checkAuth();

    //сохранениее данных из локального хранилица в переменную
    this.user = JSON.parse(localStorage.getItem("user"));

    this.loader_grid = true;

    //получение столбцов таблицы и количества отображаемых заказов для отображения
    postNewSettings(this.user.client_id, this.user.user_name)
        .then(() => {
          getSettings(this.user.client_id)
              .then(data => {
                data.select_header.forEach(item => {
                  this.headers.forEach(header => {
                    if (header.id === item) {
                      this.selectedHeaders = [...this.selectedHeaders, header];
                    }
                  })
                })
                this.itemsPerPage = data.number_orders ? data.number_orders : 100;
                this.delivery_city = data.delivery_city;
              })
        })

    let allCity = [];

    getAllCityClient(this.user.client_id)
      .then(cities => allCity = cities);

    let allOrders = [];

    //получение заказов
    getOrders(this.user.user_name)
      .then(orders => {
        allOrders = orders;
        this.changeOrders(allOrders);
        this.addCity(allOrders, allCity);
      })
      .then(() => {
        this.orders_items = allOrders;
      })

    //Получени Debit пользователя
    getDebt(this.user.user_name)
        .then(res => this.dept = res.SumDebt[0])

    this.loader_grid = false;
  },

  methods: {
    hideChangeFilter() {
      this.hideFilters = !this.hideFilters;

      let selectId = [];
      let filters = this.filters;
      this.selectedHeaders.forEach(select => {
        selectId = [...selectId, select.id];
      })

      for (let filter in filters) {
        if (typeof (filters[filter]) === 'object') {
          for (let item in filters[filter]) {
            if (item === 'id') {
              if (!selectId.includes(filters[filter][item])) {
                filters[filter].display = 'd-none';
              }
            }
          }
        }
      }
    },

    changeOrders(orders) {
      orders.map(order => {
        let regexp = /^\p{L}\\/gu;
        order.delivery_city = {
          dialog: false
        };
        //создание массива для скачивания файла
        order.orders_files = "Скачать";
        // фамилия водителей заглавными и добавления в массив для фильтрации
        if (order.driver_name) {
          order.driver_name = order.driver_name.toUpperCase();
          this.filters.driver_name.select.push(order.driver_name);
        }
        //добавление статусов в массив для фильтрации
        this.filters.status_description.select.push(order.status_description);
        //изменения файла для скачивания, для определенного клиента
        if (this.user.user_name === 'KL.TEHNOLOG@GMAIL.COM') {
          order.file_calc_client = order.file_calc_manager;
        }
        //корректировка адреса скачивания файла
        if (regexp.test(order.file_calc_client)) {
          order.file_calc_client = order.file_calc_client.slice(1);
        }
      })
    },

    addCity(orders, cities) {
      orders.map(order => {
        cities.forEach(city => {
          if (city.order_name === order.itm_ordernum) {
            order.delivery_city.city = city.delivery_city;
          }
        })
      })
    },

    openModal(item) {
      item.delivery_city.dialog = !item.delivery_city.dialog;
      this.random = Math.random();
    }
  }
};
</script>

<style>
.pt-2 .v-text-field {
  width: 250px;
  margin-left: auto;
  margin-right: 0;
}

.container .v-sheet {
  box-shadow: none !important;
}

@media (max-width: 600px) {
  .filter {
    display: none;
  }
}

.v-card__title {
  background-color: white;
  box-shadow: 0 0 5px 0 grey;
  margin-bottom: 20px;
}

.order-1 .v-data-table__wrapper {
  box-shadow: 0 0 5px 0 gray;
  border-radius: 10px;
}

.v-data-table-header {
  background: #333333;
}

.v-data-table-header span {
  color: white;
}

.navigation {
  float: left;
}

h3 a {
  color: #333333 !important;
  text-transform: uppercase;
}

.v-btn {
  color: white !important;
}

.v-btn-light.theme--light {
  color: black !important;
}
</style>
