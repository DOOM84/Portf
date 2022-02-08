import fs from "fs";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/blog/upload' && req.method.toLowerCase() === 'post') {
        const fsPromises = fs.promises;
        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 2 mb for news image and attachments. override otherwise
            maxFileSize: 2 * 1024 * 1024,
        });

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        //const maxFileSize = 2000000;

        const {files, err} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve({files: firstValues(form, files), err})
            });
        })

        if (err || !allowedTypes.includes(files.contentImg.mimetype) /*|| files.avatar.size > maxFileSize*/) {
            res.statusCode = 422;
            res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
        } else {

            try {
                let oldPath = files.contentImg.filepath;
                let fileName = files.contentImg.newFilename;
                let ext = fileName.substring(fileName.indexOf('.') + 1);

                let salt = (+new Date).toString(36).slice(-5);
                let newPath = 'public/img/blog/uploads/' + Date.now() + salt + '.' + ext;

                await fsPromises.rename(oldPath, newPath);

                res.setHeader('Content-Type', 'application/json');

                res.end(JSON.stringify({msg: 'File uploaded and moved!', url: newPath.substring(6)}));

            } catch (e) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 401;
                res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));
            }
        }
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({msg: 'Wrong Url'}));
    }
}

