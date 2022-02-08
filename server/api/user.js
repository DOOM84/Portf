import * as url from "url";
import admin from 'firebase-admin';

import * as serviceAccount from "../../helpers/portfolio-86b43-firebase-adminsdk-7ohzi-e4732c6d38.json";

import {
    useCookie
} from 'h3'

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://portfolio-86b43-default-rtdb.europe-west1.firebasedatabase.app"
});

export default async (req, res) => {

    try {
        let {token} = url.parse(req.url, true).query;

        if (!token) {
            token = useCookie(req, 'token')
        }

        const userInfo = await admin.auth().verifyIdToken(token);
        const user = await admin.auth().getUser(userInfo.uid);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            login: user.displayName,
            avatar: !user.photoURL ? null : user.photoURL,
        }));

    } catch (e) {
        res.writeHead(401, {
            "Set-Cookie": `token=; HttpOnly; path=/; max-age=0`,
        });
        //res.statusCode = 401;
        res.end(JSON.stringify({msg: 'no or expired token'}));
    }

}
