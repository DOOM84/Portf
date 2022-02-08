import {
    getDatabase,
    ref,
    get,
    query,
    orderByChild,
} from "firebase/database";
import * as url from "url";

const db = getDatabase();

export default async (req, res) => {

    try {
        const {term, sdb, lastTimeStamp} = url.parse(req.url, true).query;

        const sidebar = !sdb ? await $fetch('/api/sidebar') : {}

        let strippedTerm = term.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]\\\/]/gi, '');

        strippedTerm = strippedTerm.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");

        if (!strippedTerm || strippedTerm.length < 3) {
            return {...sidebar}
        }

        const postsSnap = await get(query(ref(db, 'posts'), orderByChild('createdAt')));

        const perPage = 10;

        const postsToSearch = [];

        postsSnap.forEach((arr) => {

            if (lastTimeStamp) {
                if (arr.val().createdAt < lastTimeStamp) {
                    postsToSearch.push(arr.val())
                }
            } else {
                postsToSearch.push(arr.val());
            }
        })

        postsToSearch.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        const regex = new RegExp(strippedTerm, 'gi');

        const filtered = postsToSearch.filter(post => !!post.body.match(regex));

        const posts = filtered.slice(0, perPage)

        return {
            results: filtered.length,
            posts,
            ...sidebar
        }
    } catch (e) {
        //console.log(e);
        //res.statusCode = 404;
        //res.end('Error occured. Try again later...');
    }
}
