import User from '../models/User.js';

class UsersController {
    // Получить всех Юзеров
    async getAll(_, res) {
        console.log('\nCalled UsersController.getAll');
        try {
            // для разработки: удалить все записи
            // await User.deleteMany();

            // берем из бд все страны
            // метода find без аргументов вернет все документы для данной модели
            const users = await User.find();

            // если все ок, то возвращаем на клиент массив Пользователей
            res.status(200).json(users);
            console.log('Users returned!');
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    // Аутентификация (POST-запрос)
    async auth(req, res) {
        console.log('\nCalled UsersController.auth');
        try {
            const userData = req.body;
            // mode: 'signIn' - вход или 'signUp' - регистрация
            const mode = req.query.mode;

            if (!mode || (mode !== 'signIn' && mode !== 'signUp'))
                throw new Error(" mode ('signIn' или 'signUp') is not correct!");

            if (!userData.username || !userData.password) throw new Error('Please input authorization data!');

            // ищем в бд юзера с таким логином
            let [user] = await User.find({ username: userData.username });

            // если режим "регистрация"
            if (mode === 'signUp') {
                if (user) throw new Error('We have this user!');
                // если в бд нет ни одного юзера, то назначить первого созданного юзера АДМИНОМ
                // (имя/пароль придут с фронта, на бэке добавляем свойство "роль" со значением 777, так мы сможем проверять на фронте, что юзеру доступны удаление/обновление/добавление стран)
                if ((await User.count()) === 0) user = await User.create({ ...userData, role: 777 });
                // иначе - создаем обычного юзера, который может только просматривать каталог
                else user = await User.create(userData);
                console.log('User created');
            }
            // если режим "авторизация"
            else {
                if (!user) throw new Error('User is not living here!');
                console.log('Success authorization');
            }

            // если все ок, то возвращаем на клиент авторизованного Пользователя
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    // Обновление юзера (Права пользователя: сделать админом/разжаловать)
    async update(req, res) {
        console.log('\nCalled UsersController.update');
        try {
            const id = req.params.id;
            const newData = req.body;
            if (!id) throw new Error('Id не указан!');

            // с опцией "new: true" вернется объект ПОСЛЕ обновления
            const updatedUser = await User.findByIdAndUpdate(id, newData, { new: true });
            console.log(updatedUser);

            // если все ок, то возвращаем на клиент обновленного Пользователя
            res.status(200).json(updatedUser);
            console.log('User updated!');
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    // Удалить Юзера
    async destroy(req, res) {
        console.log('\nCalled UsersController.destroy');
        try {
            const id = req.params.id;
            if (!id) throw new Error('Id не указан!');

            const deletedUser = await User.findByIdAndDelete(id);

            // если все ок, то возвращаем на клиент удаленного Пользователя
            res.status(200).json(deletedUser);
            console.log('User deleted!');
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    //
    //
    //
    //
    //

    // На фронте не используется (только для разработки)
    async getOne(req, res) {
        console.log('\nCalled UsersController.getOne');
        try {
            const id = req.params.id;
            if (!id) throw new Error('Id не указан!');

            // Ищем в БД юзера по айдишнику
            const user = await User.findById(id);

            // если все ок, то возвращаем на клиент Пользователя
            res.status(200).json(user);
            console.log('User returned!');
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
}

export default new UsersController();
