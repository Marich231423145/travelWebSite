import * as uuid from 'uuid'; // для создания уникальных id
import * as path from 'path'; // для работы с путями

class FileService {
    saveFile(file) {
        try {
            let format;
            if (file.mimetype === 'image/png') format = 'png';
            else if (file.mimetype === 'image/jpeg') format = 'jpg';
            else throw new Error('Неверный формат файла. Изображение должно быть в формате jpg/jpeg/png!!!');

            const fileName = uuid.v4() + '.' + format;
            const filePath = path.resolve('src/static', fileName);
            file.mv(filePath);
            return fileName;
        } catch (error) {
            throw error;
        }
    }
}

export default new FileService();
