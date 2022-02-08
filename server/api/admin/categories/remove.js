import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {getDatabase, ref, remove} from "firebase/database";

const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/categories/remove' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {slug} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            if (slug) {
                await remove(ref(dBase, 'categories/' + slug));
            }

            res.setHeader('Content-Type', 'application/json');

            res.end(JSON.stringify({
                slug
            }));
        } catch (e) {
            res.statusCode = 401;
            res.end(JSON.stringify({
                msg: 'Unauthenticated'
            }));
        }
    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
