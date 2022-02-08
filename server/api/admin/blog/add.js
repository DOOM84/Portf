import sharp from 'sharp'
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import slugify from "slugify";
import {getDatabase, ref, update, set} from "firebase/database";

import * as yup from 'yup';

const schema = yup.object({

    added: yup.object({

        ru_title: yup.string('Название (рус) должно быть строкой')
            .trim('Введите название (рус)').required('Введите название (рус)'),
        ua_title: yup.string('Название (укр) должно быть строкой')
            .trim('Введите название (укр)').required('Введите название (укр)'),
        en_title: yup.string('Название (англ) должно быть строкой')
            .trim('Введите название (англ)').required('Введите название (англ)'),
        ru_subtitle: yup.string('Описание (рус) должно быть строкой')
            .trim('Введите описание (рус)').required('Введите описание (рус)'),
        ua_subtitle: yup.string('Описание (укр) должно быть строкой')
            .trim('Введите описание (укр)').required('Введите описание (укр)'),
        en_subtitle: yup.string('Описание (англ) должно быть строкой')
            .trim('Введите описание (англ)').required('Введите описание (англ)'),
        body: yup.string('Текст должен быть строкой')
            .trim('Введите текст').required('Введите текст'),
        author: yup.string('Автор должен быть строкой')
            .trim('Введите автора').required('Введите автора'),
        source: yup.string('Источник должен быть строкой')
            .trim('Источник должен быть строкой'),
    })
})

const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/blog/add' && req.method.toLowerCase() === 'post') {

        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            maxFileSize: 3 * 1024 * 1024,
        });

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        const {files, fields, err} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        const added = JSON.parse(fields.data);

        if (err || !files.image || (files.image && !allowedTypes.includes(files.image.mimetype)) /*|| files.avatar.size > maxFileSize*/) {
            res.statusCode = 422;
            res.end(JSON.stringify({msg: 'Отсутствует изображение или неверный тип или размер файла превышен'}));
        } else {

            try {

                await schema.validate({
                    added
                });

                added.slug = slugify(added.ru_title).toLowerCase();
                added.createdAt = Date.now();
                added.images = {};
                const postCats = {}
                const postTags = {}

                if (added.tags) {
                    for (let i = 0; i < added.tags.length; i++) {
                        await update(ref(dBase, 'tags/' + added.tags[i].slug), added.tags[i]);
                    }

                    for (let i = 0; i < added.tags.length; i++) {
                        postTags[added.tags[i].slug] = true;
                        await update(ref(dBase, 'tagPosts/' + added.tags[i].slug), {[added.slug]: true});
                    }

                    await set(ref(dBase, 'postTags/' + added.slug), postTags);
                }

                if (added.categories) {

                    for (let i = 0; i < added.categories.length; i++) {
                        postCats[added.categories[i]] = true;
                        await update(ref(dBase, 'categoryPosts/' + added.categories[i]), {[added.slug]: true});
                    }

                    await set(ref(dBase, 'postCategories/' + added.slug), postCats);
                }

                let uploadPath = files.image.filepath;
                let fileName = files.image.newFilename;
                let ext = fileName.substring(fileName.indexOf('.') + 1);

                let NameWithSalt = Date.now() + (+new Date).toString(36).slice(-5);

                let origPath = 'public/img/blog/original/' + NameWithSalt + '.' + ext;
                let thumbnailPath = 'public/img/blog/thumbnail/' + NameWithSalt + '.' + ext;

                await sharp(uploadPath).resize({height: 415, width: 770, fit: 'cover', position: 'left top',})
                    .toFile(origPath)

                await sharp(uploadPath).resize({height: 233, width: 350, fit: 'cover', position: 'left top',})
                    .toFile(thumbnailPath)

                added.images.original = origPath.substring(6);
                added.images.thumbnail = thumbnailPath.substring(6);

                const tagsToReturn = added.tags.map(tag => tag.name)

                if (added.tags) {
                    added.tags = added.tags.map(tag => tag.slug);
                }

                await set(ref(dBase, 'posts/' + added.slug), added);


                if (added.tags) {
                    added.tags = tagsToReturn;
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    result: added
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
