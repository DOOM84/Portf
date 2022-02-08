import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {getDatabase, ref, update} from "firebase/database";
import * as yup from 'yup';

const schema = yup.object({

    updated: yup.object({

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

    if (req.originalUrl === '/api/admin/categories/edit' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const updated = JSON.parse(data);

            await schema.validate({
                updated
            });

            if (updated) {
                await update(ref(dBase, 'categories/' + updated.slug), updated);
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
    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
