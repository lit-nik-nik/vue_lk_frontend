import axios from "axios";
import JSONserv from './config.json';

let mongoDB = JSONserv.mongoDB;
let firebirdDB = JSONserv.firebirdDB;

const createOrderId = (order) => {
    if (order) {
        const order_id = +order.match(/^\d+/)[0];
        return order_id;
    } else {
        return;
    }

}

const getSettings = async (clientId) => {
    const res = await axios.get(mongoDB.url + mongoDB.port + '/api/settings/' + clientId)
    return res.data;
}

const putSettings = async (clientId, number, select, city) => {
    let data = {number_orders: number, select_header: select, delivery_city: city};

    await axios.put(mongoDB.url + mongoDB.port + '/api/settings/' + clientId, data);
}

const postNewSettings = async (clientId, clientName) => {
    const client = await axios.get (mongoDB.url + mongoDB.port + '/api/settings/' + clientId);

    if (!client.data) {
        const data = {id: clientId, name: clientName};
        await axios.post(mongoDB.url + mongoDB.port + '/api/settings/', data)
    }
}

const modifyTime = async () => {
    let time;

    await axios.get(mongoDB.url + mongoDB.port + '/api/time/1')
        .then(dataTime => time = dataTime.data.modify_time);

    return time;
}

const getAllCity = async () => {
    let allCity = [];

    await axios.get(mongoDB.url + mongoDB.port + '/api/city/')
        .then(res => res.data.forEach(obj => {
           let city = {
               order_name: obj.order_name,
               delivery_city: obj.delivery_city
           }

           allCity.push(city);
        }));

    return allCity;
}

const getAllCityClient = async (client_id) => {
    let allCity = [];

    await axios.get(mongoDB.url + mongoDB.port + '/api/city-client/' + client_id)
        .then(res => res.data.forEach(obj => {
            let city = {
                order_name: obj.order_name,
                delivery_city: obj.delivery_city
            }

            allCity.push(city);
        }));

    return allCity;
}

const getCity = async (order) => {
    let city;
    const orderID = createOrderId(order);

    await axios.get(mongoDB.url + mongoDB.port + '/api/city/' + orderID)
        .then(res => {
            if (res.data) {
                city = {
                    order_name: res.data.order_name,
                    delivery_city: res.data.delivery_city
                };
            }
        });

    return city;
}

const saveCity = async (order, city, client_id) => {
    const orderID = createOrderId(order);
    const data = {client_id, order_id: orderID ,order_name: order, delivery_city: city};
    const oldCity = await axios.get(mongoDB.url + mongoDB.port + '/api/city/' + orderID)

        if (oldCity.data) {
            await axios.put(mongoDB.url + mongoDB.port + '/api/city/' + orderID, data)
        } else {
            await axios.post(mongoDB.url + mongoDB.port + '/api/city/', data)
        }

}

const deleteCity = async (order) => {
    const orderID = createOrderId(order);

    await axios.delete(mongoDB.url + mongoDB.port + '/api/city/' + orderID);
}

const getOrders = async (clientName) => {
    let orders;

    await axios.get(firebirdDB.url + firebirdDB.port + "/orders/?user_name=" + clientName)
        .then(res => {
            if (!localStorage.getItem('orders')) {
                localStorage.setItem('orders', JSON.stringify(res.data));
                orders = res.data;
            } else {
                const localLength = JSON.parse(localStorage.getItem('orders')).length;
                const dataLength = res.data.length;

                if(localLength === dataLength) {
                    orders = JSON.parse(localStorage.getItem('orders'));
                } else {
                    localStorage.setItem('orders', JSON.stringify(res.data));
                    orders = res.data;
                }
            }
        });

    return orders;
}

const getDebt = async (clientName) => {
    let debt;

    await axios.get(firebirdDB.url + firebirdDB.port + "/get/debt/?user_name=" + clientName)
        .then(res => debt = res.data);

    return debt;
}

const checkAuth = async () => {
    let user = localStorage.getItem("user");

    if(!user) {
        window.location.href = '#/login/';
    }
}

export {
    postNewSettings,
    getSettings,
    putSettings,
    modifyTime,
    getAllCity,
    getAllCityClient,
    getCity,
    saveCity,
    deleteCity,
    getOrders,
    checkAuth,
    getDebt
}