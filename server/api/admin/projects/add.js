import fs from "fs";
import sharp from 'sharp'
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {getDatabase, ref, push, update} from "firebase/database";
import * as yup from 'yup';

const schema = yup.object({

    created: yup.object({

        ru_name: yup.string('Название (рус) должно быть строкой')
            .trim('Введите название (рус)').required('Введите название (рус)'),
        ua_name: yup.string('Название (укр) должно быть строкой')
            .trim('Введите название (укр)').required('Введите название (укр)'),
        en_name: yup.string('Название (англ) должно быть строкой')
            .trim('Введите название (англ)').required('Введите название (англ)'),
        ru_details: yup.string('Описание (рус) должно быть строкой')
            .trim('Введите описание (рус)').required('Введите описание (рус)'),
        ua_details: yup.string('Описание (укр) должно быть строкой')
            .trim('Введите описание (укр)').required('Введите описание (укр)'),
        en_details: yup.string('Описание (англ) должно быть строкой')
            .trim('Введите описание (англ)').required('Введите описание (англ)'),
        link: yup.string('Ссылка должны быть строкой')
            .trim('Введите ссылку').required('Введите ссылку'),
    })
})

const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/projects/add' && req.method.toLowerCase() === 'post') {
        const fsPromises = fs.promises;
        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 3 mb for news image and attachments. override otherwise
            maxFileSize: 3 * 1024 * 1024,
        });

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        const {files, fields, err} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        const created = JSON.parse(fields.data);

        if (err || !files.image || (files.image && !allowedTypes.includes(files.image.mimetype)) /*|| files.avatar.size > maxFileSize*/) {
            res.statusCode = 422;
            res.end(JSON.stringify({msg: 'Отсутствует изображение или неверный тип или размер файла превышен'}));
        } else {

            try {

                await schema.validate({
                    created
                });

                if (files.image) {

                    let uploadPath = files.image.filepath;
                    let fileName = files.image.newFilename;
                    let ext = fileName.substring(fileName.indexOf('.') + 1);

                    let NameWithSalt = Date.now() + (+new Date).toString(36).slice(-5);

                    let origPath = 'public/img/projects/original/' + NameWithSalt + '.' + ext;
                    let thumbnailPath = 'public/img/projects/thumbnail/' + NameWithSalt + '.' + ext;

                    await fsPromises.rename(uploadPath, origPath);

                    created.images = {};

                    created.images.original = origPath.substring(6);
                    created.images.thumbnail = thumbnailPath.substring(6);

                    await sharp(origPath).resize({height: 275, width: 400, fit: 'cover', position: 'right top',})
                        .toFile(thumbnailPath)

                }

                const entry = await push(ref(dBase, 'projects'), created);
                await update(ref(dBase, 'projects/' + entry.key), {id: entry.key});

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    result: {...created, id: entry.key}
                }));

            } catch (e) {

                if (e.path) {
                    res.statusCode = 422;
                    res.end(JSON.stringify({
                        msg: e.errors[0]
                    }));
                } else {

                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 401;
                    res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));

                }
            }
        }

    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
