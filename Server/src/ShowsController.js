// библиотеки для чтения локальных файлов
import * as fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// наши файлы (модели/сервисы)
import Show from '../models/Show.js';
import FileService from '../services/FileService.js';

class ShowsController {
 
    async getAll(_, res) {
        console.log('\nВызван ShowsController.getAll');
        try {
            // для разработки: удалить все записи
            // await Show.deleteMany();

            // для первого запуска: создать дефолтные товары из json-файла (можно закомментить, если это не нужно)
            if ((await Show.count()) === 0) await initialization();

            const shows = await Show.find(); // метода find без аргументов вернет все документы для данной модели

            
            res.status(200).json(shows);
            console.log('Страны возвращены!');
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    // Получить конкретную страну (страница "Подробнее")
    async getOne(req, res) {
        console.log('\nВызван ShowsController.getOne');
        try {
            const id = req.params.id;
            if (!id) throw new Error('Id не указан!');

            // ищем в бд страну по айдишнику
            const show = await Show.findById(id);

            // если все ок, то возвращаем на клиент страну
            res.status(200).json(show);
            console.log('Страна возвращена!');
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    async create(req, res) {
        console.log('\nВызван ShowsController.create');
        try {
            const mainImage = req.files?.mainImage;
            const previewImage = req.files?.previewImage;

            // если mainImage указан, создаем файл, иначе - undefined
            const mainFileName = mainImage ? FileService.saveFile(mainImage) : undefined;
            // если previewImage указан, создаем файл, иначе - mainFileName (а если и его нет, то undefined)
            const previewFileName = previewImage ? FileService.saveFile(previewImage) : mainFileName || undefined;

            // группируем данные для создания объекта спектакля
            const show = await Show.create({
                ...req.body,
                imgSrc: mainFileName,
                previewImgSrc: previewFileName
            });

            res.status(200).json(show);
            console.log('Страна создана!');
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    async delete(req, res) {
        console.log('\nВызван ShowsController.delete');
        try {
            const id = req.params.id;
            if (!id) throw new Error('Id не указан!');

            const deletedShow = await Show.findByIdAndDelete(id);

            // если все ок, то возвращаем на клиент удаленный спектакль
            res.status(200).json(deletedShow);
            console.log('Страна удалена!');
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
    async update(req, res) {
        console.log('\nВызван ShowsController.update');
        try {
            const id = req.params.id;
            if (!id) throw new Error('Id не указан!');

            // с опцией "new: true" вернется объект ПОСЛЕ обновления
            const updatedShow = await Show.findByIdAndUpdate(id, req.body, { new: true });

            // если все ок, то возвращаем на клиент обновленную страну
            res.status(200).json(updatedShow);
            console.log('Страна обновлена!');
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
}

export default new ShowsController();

// инициализация: создание 6 стран в БД (чтобы не создавать вручную)
const initialization = async () => {
    // читаем данные из локального json-файла
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const data = await fs.readFile(__dirname + '/shows.json', 'utf8');

    // преобразуем их в массив обычных объектов
    const shows = JSON.parse(data);

    // проходимся по массиву и создаем запись в БД для каждого
    for (const show of shows) await Show.create(show);
};
