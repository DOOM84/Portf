import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import * as yup from 'yup';

const schema = yup.object({
    credentials: yup.object({
        email: yup.string('error_email').trim('error_email').email('error_email').required('error_email'),
        password: yup.string('error_pass_length')
            .trim('error_pass_length')
            .min(6, 'error_pass_length')
            .required('error_pass_length'),
    }),
});

export default async (req, res) => {

    if (req.originalUrl === '/api/auth/login' && req.method.toLowerCase() === 'post') {

        const form = formidable();

        const credentials = await new Promise((resolve, reject) => {

            form.parse(req, (err, fields, files) => {
                const fieldsSingle = firstValues(form, fields);
                resolve(fieldsSingle)
            });
        })

        const auth = getAuth();

        try {

            await schema.validate({
                credentials,
            });

            const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)

            const authData = {
                login: userCredential.user.displayName,
                // email: userCredential.user.email,
                avatar: userCredential.user.photoURL,
                token: userCredential.user.accessToken
            }
            res.setHeader('Content-Type', 'application/json');

            res.end(JSON.stringify(authData));

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
    /*else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="/api/upload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }*/
}