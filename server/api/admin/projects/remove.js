import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {getDatabase, ref, remove} from "firebase/database";
import fs from "fs";

const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/projects/remove' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const delData = JSON.parse(data);

            if (delData.id) {
                await remove(ref(dBase, 'projects/' + delData.id));
            }

            if (fs.existsSync('public' + delData.images.original)) {
                fs.unlinkSync('public' + delData.images.original);
            }

            if (fs.existsSync('public' + delData.images.thumbnail)) {
                fs.unlinkSync('public' + delData.images.thumbnail);
            }

            res.setHeader('Content-Type', 'application/json');

            res.end(JSON.stringify({
                id: delData.id
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
