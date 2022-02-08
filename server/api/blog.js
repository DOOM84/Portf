import {
    getDatabase,
    ref,
    get,
    query,
    orderByChild,
    limitToLast,
    endAt,
} from "firebase/database";
import * as url from "url";

const db = getDatabase();

async function getNextPage(lastTimeStamp, limit) {

    const postsSnap = await get(query(ref(db, 'posts'), orderByChild('createdAt'), endAt(lastTimeStamp), limitToLast(limit)));
    const list = [];

    postsSnap.forEach(snapshot => {
        let value = snapshot.val();
        value.key = snapshot.key;
        let listItemExist = false;
        list.forEach(element => {
            if (element.key === value.key) {
                listItemExist = true;
            }
        });
        if (!listItemExist) {
            list.push(value);

        } else {
            console.log("item already exist not adding");
        }
    });

    return list;
}

export default async (req, res) => {

    try {
        const perPage = 10;

        const {lastTimeStamp, itemsLength} = url.parse(req.url, true).query;

        const sidebar = !lastTimeStamp ? await $fetch('/api/sidebar') : {}
        let posts = [];

        if (!lastTimeStamp) {
            const postsSnap = await get(query(ref(db, 'posts'), orderByChild('createdAt'), limitToLast(perPage)));

            postsSnap.forEach((arr) => {
                posts.push(arr.val())
            })

        } else {

            posts = await getNextPage(lastTimeStamp, +itemsLength + perPage);

        }

        posts.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            posts,
            ...sidebar
        }));

    } catch (e) {
        console.log(e);
        res.statusCode = 404;
        res.end('Error occured');
    }
}
