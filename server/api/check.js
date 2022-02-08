import * as url from "url";
import admin from 'firebase-admin';

import {
    useCookie
} from 'h3'

export default async (req, res) => {

    try {
        let {token} = url.parse(req.url, true).query;

        if (!token) {
            token = useCookie(req, 'token')
        }

        const {uid} = await admin.auth().verifyIdToken(token);

        const user = await admin.auth().getUser(uid);

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            access: !!user.customClaims['admin'],
        }));

    } catch (e) {
        res.writeHead(401, {
            "Set-Cookie": `token=; HttpOnly; path=/; max-age=0`,
        });

        res.end(JSON.stringify({msg: 'no or expired token'}));
    }

}
