import admin from "firebase-admin";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {get, getDatabase, query, ref, remove} from "firebase/database";
import fs from "fs";

const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/users/remove' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const delData = JSON.parse(data);

            if (delData.id) {
                await admin.auth().deleteUser(delData.id);
                const avaSnap = await get(query(ref(dBase, `avatars/${delData.id}`)));
                await remove(ref(dBase, 'avatars/' + delData.id));

                if (avaSnap.val().path) {
                    if (fs.existsSync('public' + avaSnap.val().path)) {
                        fs.unlinkSync('public' + avaSnap.val().path);
                    }
                }
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
