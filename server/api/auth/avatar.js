import fs from "fs";
import sharp from "sharp";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import admin from 'firebase-admin';
import {getDatabase, set, ref} from "firebase/database";

import {
    useCookie
} from 'h3'


const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/auth/avatar' && req.method.toLowerCase() === 'post') {
        const fsPromises = fs.promises;
        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 2 mb for news image and attachments. override otherwise
            maxFileSize: 2 * 1024 * 1024,
        });

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        //const maxFileSize = 2000000;

        const {files, fields, err} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {

                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})

            });

        })

        if (err || !allowedTypes.includes(files.avatar.mimetype) /*|| files.avatar.size > maxFileSize*/) {
            res.statusCode = 422;
            res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
        } else {
            const token = useCookie(req, 'token');
            try {
                const {uid} = await admin.auth().verifyIdToken(token);
                let oldPath = files.avatar.filepath;
                let fileName = files.avatar.newFilename;
                let ext = fileName.substring(fileName.indexOf('.') + 1);

                //let origPath = 'public/uploads/orig/' + files.avatar.newFilename;
                let salt = (+new Date).toString(36).slice(-5);
                let newPath = 'public/img/avatars/' + Date.now() + salt + '.' + ext;
                let urlDb = req.headers.origin + newPath.substring(6);

                await set(ref(dBase, 'avatars/' + uid), {path: newPath.substring(6)});
                await admin.auth()
                    .updateUser(uid, {
                        photoURL: urlDb,
                    })

                //await fsPromises.rename(oldPath, origPath);

                await sharp(oldPath).resize({height: 80, width: 80}).toFile(newPath);

                /*if (fs.existsSync(origPath)) {
                    fs.unlinkSync(origPath);
                }*/

                if (fields.oldAva) {
                    let n = fields.oldAva.lastIndexOf('/');
                    let toDel = fields.oldAva.substring(n + 1);
                    if (fs.existsSync('public/img/avatars/' + toDel)) {
                        fs.unlinkSync('public/img/avatars/' + toDel);
                    }
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({msg: 'File uploaded and moved!', path: newPath.substring(6)}));
            } catch (e) {
                //console.log(e);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 401;
                res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));
            }
        }
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({msg: 'Wrong Url'}));
    }
}

