import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {get, getDatabase, query, ref, remove} from "firebase/database";
import fs from "fs";

const dBase = getDatabase();

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/blog/remove' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const delData = JSON.parse(data);

            if (delData.slug) {
                await remove(ref(dBase, 'comments/' + delData.slug));
                await remove(ref(dBase, 'likes/' + delData.slug));
                await remove(ref(dBase, 'posts/' + delData.slug));
            }

            const catsSnap = await get(query(ref(dBase, 'categories')));
            const tagsSnap = await get(query(ref(dBase, 'tags')));

            const categories = Object.entries(catsSnap.val()).map(([key, value]) => value.slug);
            const tags = Object.entries(tagsSnap.val()).map(([key, value]) => value.slug);

            for (let i = 0; i < categories.length; i++) {
                await remove(ref(dBase, 'categoryPosts/' + categories[i] + '/' + delData.slug));
            }

            for (let i = 0; i < tags.length; i++) {
                await remove(ref(dBase, 'tagPosts/' + tags[i] + '/' + delData.slug));
            }

            await remove(ref(dBase, 'postCategories/' + delData.slug));

            await remove(ref(dBase, 'postTags/' + delData.slug));

            if (fs.existsSync('public' + delData.images.original)) {
                fs.unlinkSync('public' + delData.images.original);
            }

            if (fs.existsSync('public' + delData.images.thumbnail)) {
                fs.unlinkSync('public' + delData.images.thumbnail);
            }

            res.setHeader('Content-Type', 'application/json');

            res.end(JSON.stringify({
                slug: delData.slug
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
