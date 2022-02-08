import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {getDatabase, push, ref, update} from "firebase/database";
import * as yup from 'yup';

const schema = yup.object({

    created: yup.object({
        ru_name: yup.string('Должность (рус) должна быть строкой')
            .trim('Введите должность (рус)').required('Введите должность (рус)'),
        ua_name: yup.string('Должность (укр) должна быть строкой')
            .trim('Введите должность (укр)').required('Введите должность (укр)'),
        en_name: yup.string('Должность (англ) должна быть строкой')
            .trim('Введите должность (англ)').required('Введите должность (англ)'),
        ru_description: yup.string('Описание (рус) должно быть строкой')
            .trim('Введите описание (рус)').required('Введите описание (рус)'),
        ua_description: yup.string('Описание (укр) должно быть строкой')
            .trim('Введите описание (укр)').required('Введите описание (укр)'),
        en_description: yup.string('Описание (англ) должна быть строкой')
            .trim('Введите описание (англ)').required('Введите описание (англ)'),
        year: yup.string('Годы должны быть строкой')
            .trim('Введите годы').required('Введите годы'),
        begin: yup.string('Год начала должен быть строкой')
            .trim('Введите год начала').required('Введите год начала'),
    })
})

const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/about/add' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const created = JSON.parse(data);

            await schema.validate({
                created
            });

            let entry;

            if (created) {
                entry = await push(ref(dBase, 'trainings'), created);
                await update(ref(dBase, 'trainings/' + entry.key), {id: entry.key});
            }


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
                res.statusCode = 401;
                res.end(JSON.stringify({
                    msg: 'Unauthenticated'
                }));
            }
        }
    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
