import {
    getDatabase,
    ref,
    get,
    query, orderByChild,
} from "firebase/database";

const db = getDatabase();
import * as url from "url";

export default async (req, res) => {

    try {
        const {slug} = url.parse(req.url, true).query;


        const commentsSnap = await get(query(ref(db, 'comments/' + slug), orderByChild('createdAt')));

        const comments = [];

        commentsSnap.forEach((arr) => {
            comments.push(arr.val());
        })

        for (const comment of comments) {

            const index = comments.indexOf(comment);
            comments[index].user.avatar = await getAvatar(comments[index].user.id)
        }

        comments.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        return {
            comments,
        }

    } catch (e) {
        //console.log(e);
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }

    async function getAvatar(uid) {

        const avaSnap = await get(query(ref(db, 'avatars/' + uid + '/path')));

        return avaSnap.val();
    }
}

