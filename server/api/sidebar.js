import {
    getDatabase,
    ref,
    get,
    query,
    limitToLast,
    orderByChild
} from "firebase/database";

const db = getDatabase();

export default async (req, res) => {

    try {
        const recPostsSnap = await get(query(ref(db, 'posts'), orderByChild('createdAt'), limitToLast(3)));

        const recentPosts = Object.entries(recPostsSnap.val())
            .map(([key, value]) => value)//.filter((post)=> !!post.status)
            .sort((a, b) => {
                return b.createdAt - a.createdAt;
            })

        //recentPosts.reverse();

        const categoriesSnap = await get(query(ref(db, 'categories')));

        const categories = Object.entries(categoriesSnap.val()).map(([key, value]) => value)
            .filter((cat) => !!cat.status)

        const tagsSnap = await get(query(ref(db, 'tags')));

        const tags = Object.entries(tagsSnap.val()).map(([key, value]) => value)

        return {
            recentPosts,
            categories,
            tags
        }
    } catch (e) {
        console.log(e);
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
