import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import * as yup from 'yup';

const schema = yup.object({
    credentials: yup.object({
        email: yup.string('error_email').trim('error_email').email('error_email').required('error_email'),
    }),
});

export default async (req, res) => {

    if (req.originalUrl === '/api/auth/reset' && req.method.toLowerCase() === 'post') {

        const form = formidable();

        const credentials = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve(firstValues(form, fields))
            });
        })

        const auth = getAuth();

        try {

            await schema.validate({
                credentials,
            });

            await sendPasswordResetEmail(auth, credentials.email);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({msg: 'success'}));

        } catch (e) {

            if (e.path) {
                res.statusCode = 422;
                res.end(JSON.stringify({
                    msg: e.errors[0]
                }));
            } else {
                res.statusCode = 403;
                res.end(e.code);
            }
        }

    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}