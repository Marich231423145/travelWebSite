import mongoose from 'mongoose';

// Схема - описание данных
const User = new mongoose.Schema({
    // Обязательные поля

    username: { type: String, required: true },
    password: { type: String, required: true },

    // Необязательные поля
    // роли (примитивная проверка, является ли юзер админом - только у админа есть это свойство со значением 777)
    // только у админа есть возможность создавать/удалять/обновлять(менять скидку)
    role: { type: Number }
});

// Экспортируем модель 'User', созданную по одноименной схеме
export default mongoose.model('User', User);
