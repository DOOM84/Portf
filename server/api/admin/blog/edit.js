import fs from "fs";
import sharp from 'sharp'
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {getDatabase, ref, update, set, get, query, remove} from "firebase/database";

import * as yup from 'yup';

const schema = yup.object({

    updated: yup.object({

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

    if (req.originalUrl === '/api/admin/blog/edit' && req.method.toLowerCase() === 'post') {

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

        const updated = JSON.parse(fields.data);

        if (err || (files.image && !allowedTypes.includes(files.image.mimetype)) /*|| files.avatar.size > maxFileSize*/) {
            res.statusCode = 422;
            res.end(JSON.stringify({msg: 'Size limit exceeded or file type is incorrect'}));
        } else {
            try {
                await schema.validate({
                    updated
                });

                const postCats = {}
                const postTags = {}
                let tagsToReturn;

                const tagsSnap = await get(query(ref(dBase, 'tags')));

                const tags = Object.entries(tagsSnap.val()).map(([key, value]) => value.slug);

                const catsSnap = await get(query(ref(dBase, 'categories')));

                const categories = Object.entries(catsSnap.val()).map(([key, value]) => value.slug);


                if (updated.tags) {

                    for (let i = 0; i < updated.tags.length; i++) {
                        await update(ref(dBase, 'tags/' + updated.tags[i].slug), updated.tags[i]);
                    }

                    tagsToReturn = updated.tags.map(tag => tag.name);

                    updated.tags = updated.tags.map(tag => tag.slug);

                    for (let i = 0; i < tags.length; i++) {
                        await remove(ref(dBase, 'tagPosts/' + tags[i] + '/' + updated.slug));
                    }

                    for (let i = 0; i < updated.tags.length; i++) {
                        postTags[updated.tags[i]] = true;
                        await update(ref(dBase, 'tagPosts/' + updated.tags[i]), {[updated.slug]: true});
                    }

                    await set(ref(dBase, 'postTags/' + updated.slug), postTags);

                } else {

                    for (let i = 0; i < tags.length; i++) {
                        await remove(ref(dBase, 'tagPosts/' + tags[i] + '/' + updated.slug));
                    }

                    await remove(ref(dBase, 'postTags/' + updated.slug));
                }


                if (updated.categories) {

                    for (let i = 0; i < categories.length; i++) {
                        await remove(ref(dBase, 'categoryPosts/' + categories[i] + '/' + updated.slug));
                    }

                    for (let i = 0; i < updated.categories.length; i++) {
                        postCats[updated.categories[i]] = true;
                        await update(ref(dBase, 'categoryPosts/' + updated.categories[i]), {[updated.slug]: true});
                    }

                    await set(ref(dBase, 'postCategories/' + updated.slug), postCats);

                } else {

                    for (let i = 0; i < categories.length; i++) {
                        await remove(ref(dBase, 'categoryPosts/' + categories[i] + '/' + updated.slug));
                    }

                    await remove(ref(dBase, 'postCategories/' + updated.slug));
                }

                if (files.image) {

                    if (fs.existsSync('public' + updated.images.original)) {
                        fs.unlinkSync('public' + updated.images.original);
                    }

                    if (fs.existsSync('public' + updated.images.thumbnail)) {
                        fs.unlinkSync('public' + updated.images.thumbnail);
                    }

                    let uploadPath = files.image.filepath;
                    let fileName = files.image.newFilename;
                    let ext = fileName.substring(fileName.indexOf('.') + 1);

                    let NameWithSalt = Date.now() + (+new Date).toString(36).slice(-5);

                    const origPath = 'public/img/blog/original/' + NameWithSalt + '.' + ext;
                    const thumbnailPath = 'public/img/blog/thumbnail/' + NameWithSalt + '.' + ext;
                    //await fsPromises.rename(uploadPath, origPath);

                    updated.images.original = origPath.substring(6);
                    updated.images.thumbnail = thumbnailPath.substring(6);

                    await sharp(uploadPath).resize({height: 415, width: 770, fit: 'cover', position: 'left top',})
                        .toFile(origPath)
                    await sharp(uploadPath).resize({height: 233, width: 350, fit: 'cover', position: 'left top',})
                        .toFile(thumbnailPath)
                }

                await update(ref(dBase, 'posts/' + updated.slug), updated)

                if (tagsToReturn) {
                    updated.tags = tagsToReturn;
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    result: updated
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
