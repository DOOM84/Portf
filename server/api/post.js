import {
    getDatabase,
    ref,
    get,
    query,
} from "firebase/database";

import getTagsByPost from '../../helpers/manyToMany';

const db = getDatabase();
import * as url from "url";
import {useCookie} from "h3";
import admin from "firebase-admin";

export default async (req, res) => {

    try {
        const {slug} = url.parse(req.url, true).query;
        let {token} = url.parse(req.url, true).query;

        const postSnap = await get(query(ref(db, `posts/${slug}`)));

        if (!postSnap.val() || !postSnap.val().status) {
            await Promise.reject(Error('Not found'));
        }


        const adminDb = admin.database();

        let isLiked

        try {
            if (!token) {
                token = useCookie(req, 'token');
            }
            const {uid} = await admin.auth().verifyIdToken(token);
            const postLikesRef = await adminDb.ref('likes/' + slug + '/' + uid);

            isLiked = await new Promise((resolve, reject) => {
                postLikesRef.once('value', async (snap) => {
                    resolve(!!snap.val())
                })
            })
        } catch (e) {
            isLiked = false;
        }

        const sidebar = await $fetch('/api/sidebar');

        const post = postSnap.val();

        post.isLiked = isLiked;

        let postTags;

        await getTagsByPost(slug, 'postTags', 'tags').then(function (res) {
            postTags = res;
        }).catch(function (error) {
            console.error(error);
        });

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            post,
            postTags,
            ...sidebar
        }));

    } catch (e) {

        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}

