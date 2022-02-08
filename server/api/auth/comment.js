import admin from "firebase-admin";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {useCookie} from "h3";
import {getDatabase, ref, push, update, get, query} from "firebase/database";
import * as yup from 'yup';

const schema = yup.object({

    comment: yup.string('error_msg').required('error_text')
        .trim('error_text')
        .test(
            'line_breaks',
            'error_text',
            (value) => value.indexOf('\n\n\n') < 0
        ).max(8000, 'error_length'),
});

const db = admin.database();
const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/auth/comment' && req.method.toLowerCase() === 'post') {
        try {

            const token = useCookie(req, 'token')

            const {uid} = await admin.auth().verifyIdToken(token);
            const user = await admin.auth().getUser(uid);

            const form = formidable();

            const {slug, comment, quote} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            await schema.validate({
                comment
            });

            const creatDate = Date.now();

            const newComment = {

                body: comment,
                createdAt: creatDate,

                user: {
                    name: user.displayName,
                    avatar: await getAvatar(uid),
                    id: uid
                }
            }

            const added = await push(ref(dBase, 'comments/' + slug), newComment);

            if (quote) {
                await update(ref(dBase, 'comments/' + slug + '/' + added.key), {
                    id: added.key,
                    quote: JSON.parse(quote)
                });
            } else {
                await update(ref(dBase, 'comments/' + slug + '/' + added.key), {
                    id: added.key,
                });
            }

            if (quote) {
                newComment.quote = JSON.parse(quote)
            }

            newComment.id = added.key

            const postCommentsRef = await db.ref('comments/' + slug);

            await postCommentsRef.once('value', async (snapshot) => {
                const commentsCount = snapshot.numChildren();

                await update(ref(dBase, 'posts/' + slug), {
                    comments: commentsCount
                })
            })
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                newComment
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

async function getAvatar(uid) {
    const avaSnap = await get(query(ref(dBase, 'avatars/' + uid + '/path')));
    return avaSnap.val();
}
