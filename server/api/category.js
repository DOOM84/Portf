import * as url from "url";
import getPostsByCategory from '../../helpers/manyToMany';
import {get, getDatabase, query, ref} from "firebase/database";

const db = getDatabase();

export default async (req, res) => {

    try {

        const {slug, lastTimeStamp} = url.parse(req.url, true).query;

        const catSnap = await get(query(ref(db, `categories/${slug}`)));

        if (!catSnap.val() || !catSnap.val().status) {
            await Promise.reject(Error('Not found'));
        }

        const sidebar = !lastTimeStamp ? await $fetch('/api/sidebar') : {}

        const perPage = 10;

        let posts;


        await getPostsByCategory(slug, 'categoryPosts', 'posts').then(function (res) {

            if (lastTimeStamp) {
                posts = res.filter(post => post.createdAt < lastTimeStamp && !!post.status);
            } else {
                posts = res.filter(post => !!post.status);
            }

            posts.sort((a, b) => {
                return b.createdAt - a.createdAt;
            });

            posts = posts.slice(0, perPage);

        }).catch(function (error) {
            console.error(error);
        });

        return {
            posts,
            ...sidebar
        }
    } catch (e) {
        //console.log(e);
        res.statusCode = 404;
        res.end();
    }
}
