import * as url from "url";
import getPostsByTag from '../../helpers/manyToMany';
import {get, getDatabase, query, ref} from "firebase/database";

const db = getDatabase();

export default async (req, res) => {
    try {
        const {slug, lastTimeStamp} = url.parse(req.url, true).query;

        const tagSnap = await get(query(ref(db, `tags/${slug}`)));

        if (!tagSnap.val()) {
            await Promise.reject(Error('Not found'));
        }


        const sidebar = !lastTimeStamp ? await $fetch('/api/sidebar') : {}

        const perPage = 10;

        let posts;

        await getPostsByTag(slug, 'tagPosts', 'posts').then(function (res) {

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

        res.statusCode = 404;
        res.end();
    }
}
