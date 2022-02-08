import admin from "firebase-admin";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {getDatabase, ref, push, update, get, query, remove} from "firebase/database";

const db = admin.database();
const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/comdel' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {id, slug} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            await remove(ref(dBase, 'comments/' + slug + '/' + id));

            const postCommentsRef = await db.ref('comments/' + slug);

            await postCommentsRef.once('value', async (snapshot) => {

                const commentsCount = snapshot.numChildren();

                await update(ref(dBase, 'posts/' + slug), {
                    comments: commentsCount
                })
            })

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                toDel: id,
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
