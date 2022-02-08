import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";

import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import * as yup from 'yup';


const schema = yup.object({
    credentials: yup.object({
        login: yup.string('error_login').trim('error_login')
            .min(3, 'error_login')
            .max(100, 'error_login')
            .matches(/^[0-9A-Za-zа-яёА-ЯЁ ]*$/, 'error_login')
            .required('error_login'),
        email: yup.string('error_email').trim('error_email').email('error_email').required('error_email'),
        password: yup.string('error_pass_length').trim('error_pass_length').min(6, 'error_pass_length').required('error_pass_length'),
        passwordConfirmation: yup.string('error_pass_length').trim('error_pass_length')
            .oneOf([yup.ref('password'), null], 'error_pass_match')
    }),
});

export default async (req, res) => {

    const auth = getAuth();

    if (req.originalUrl === '/api/auth/signup' && req.method.toLowerCase() === 'post') {

        const form = formidable();

        const credentials = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve(firstValues(form, fields))
            });
        })

        try {

            await schema.validate({
                credentials,
            });

            const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);

            await updateProfile(auth.currentUser, {displayName: credentials.login});

            const authData = {
                login: userCredential.user.displayName,
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
}