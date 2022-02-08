import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {getDatabase, ref, set} from "firebase/database";
import slugify from "slugify";
import * as yup from 'yup';

const schema = yup.object({

    created: yup.object({

        ru_name: yup.string('Название (рус) должно быть строкой')
            .trim('Введите название (рус)').required('Введите название (рус)'),
        ua_name: yup.string('Название (укр) должно быть строкой')
            .trim('Введите название (укр)').required('Введите название (укр)'),
        en_name: yup.string('Название (англ) должно быть строкой')
            .trim('Введите название (англ)').required('Введите название (англ)'),
    })
})

const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/categories/add' && req.method.toLowerCase() === 'post') {
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

            created.slug = slugify(created.ru_name).toLowerCase();

            if (created) {
                await set(ref(dBase, 'categories/' + created.slug), created);
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                result: created
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
    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
