import admin from "firebase-admin";
import sharp from 'sharp'
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {getDatabase, ref, set} from "firebase/database";
import fs from "fs";
import * as yup from 'yup';

const schema = yup.object({
    updated: yup.object({
        displayName: yup.string('Некорректное имя пользователя.').trim('Некорректное имя пользователя.')
            .min(3, 'Некорректное имя пользователя.')
            .max(100, 'Некорректное имя пользователя.')
            .matches(/^[0-9A-Za-zа-яёА-ЯЁ ]*$/, 'Некорректное имя пользователя.')
            .required('Введите имя пользователя'),
        email: yup.string('Введен некорректный Email адрес').trim('Введен некорректный Email адрес')
            .email('Введен некорректный Email адрес').required('Введен некорректный Email адрес'),
        password: yup.string('Пароль не должен быть менее 6 символов')
            .trim('Пароль не должен быть менее 6 символов')
            .min(6, 'Пароль не должен быть менее 6 символов'),
        passwordConfirmation: yup.string('Пароль не должен быть менее 6 символов')
            .when('password', (password) => {
                if (password) return yup.string().required("Подтвердите пароль")
                    .trim('Пароль не должен быть менее 6 символов')
                    .oneOf([yup.ref('password'), null], 'Введенные пароли не совпадают.')
            })
    }),
});

const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/users/edit' && req.method.toLowerCase() === 'post') {

        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 3 mb for news image and attachments. override otherwise
            maxFileSize: 2 * 1024 * 1024,
        });

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        const {files, fields, err} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        const updated = JSON.parse(fields.data);

        if (err || (files.image && !allowedTypes.includes(files.image.mimetype)) /*|| files.avatar.size > maxFileSize*/) {
            res.statusCode = 422;
            res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
        } else {
            try {

                await schema.validate({
                    updated
                });
                let urlDb;
                let avaPath;
                let uploadPath;
                let fileToDel;

                if (files.image) {

                    fileToDel = updated.photoURL;

                    uploadPath = files.image.filepath;

                    let fileName = files.image.newFilename;
                    let ext = fileName.substring(fileName.indexOf('.') + 1);

                    let NameWithSalt = Date.now() + (+new Date).toString(36).slice(-5);

                    avaPath = 'public/img/avatars/' + NameWithSalt + '.' + ext;

                    urlDb = req.headers.origin + avaPath.substring(6);

                }

                updated.photoURL = urlDb ? urlDb : (!updated.photoURL) ? undefined :
                    req.headers.origin + '/img/avatars/' + updated.photoURL;

                const userRecord = await admin.auth().updateUser(updated.uid,
                    {
                        ...updated,
                    })

                await admin.auth()
                    .setCustomUserClaims(userRecord.uid, {admin: updated.customClaims.admin});

                const updatedUser = await admin.auth().getUser(userRecord.uid)

                const result = {
                    email: updatedUser.email,
                    displayName: updatedUser.displayName,
                    photoURL: updatedUser.photoURL ? updatedUser.photoURL.substring(updatedUser.photoURL.lastIndexOf('/') + 1) : null,
                    disabled: updatedUser.disabled,
                    customClaims: updatedUser.customClaims ? updatedUser.customClaims : {admin: false},
                    uid: updatedUser.uid
                }

                if (avaPath) {
                    await set(ref(dBase, 'avatars/' + userRecord.uid), {path: avaPath.substring(6)});
                    await sharp(uploadPath).resize({height: 80, width: 80}).toFile(avaPath);
                    if (fs.existsSync('public/img/avatars/' + fileToDel)) {
                        fs.unlinkSync('public/img/avatars/' + fileToDel);
                    }
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    result: result
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
        }

    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
