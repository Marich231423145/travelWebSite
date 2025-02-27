import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';

import ShowsController from './controllers/ShowsController.js';
import UsersController from './controllers/UsersController.js';

const app = express();


app.use(express.json());


app.use(fileUpload());

app.use(express.static('src/static'));

// Запросы для Пользователей
app.get('/users', UsersController.getAll); // Получить всех Юзеров
app.get('/users/:id', UsersController.getOne); // Получить конкретного Юзера
app.post('/users', UsersController.auth); // Создать Юзера
app.put('/users/:id', UsersController.update); // Обновить Юзера
app.delete('/users/:id', UsersController.destroy); // Удалить Юзера


// Запросы для Стран
app.get('/shows', ShowsController.getAll); // Получить все стран
app.get('/shows/:id', ShowsController.getOne); // Получить конкретную страну
app.post('/shows', ShowsController.create); // Создать страну
app.delete('/shows/:id', ShowsController.delete); // Удалить страну
app.put('/shows/:id', ShowsController.update); // Обновить страну

app.use('/', express.static('./../client'));

async function startApp() {
    try {
        // Подключение к БД
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://127.0.0.1:27017/travel_agency_9');
        console.log('База Данных Подключена');

        // просим приложение прослушивать PORT
        app.listen(3000, () => console.log('Сервер запущен на Порту #' + 3000));
    } catch (err) {
        console.log('Произошла ошибка при запуске сервера: ', err.message);
    }
}
startApp();
