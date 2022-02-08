import {getDatabase, ref, get, query} from "firebase/database";

const db = getDatabase();

export default async (req, res) => {

    try {
        const categoriesSnap = await get(query(ref(db, `categories`)));
        const categoriesArray = [];
        categoriesSnap.forEach((arr) => {
            categoriesArray.push(arr.val());
        })

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            categories: categoriesArray
        }));

    } catch (e) {
        //console.log(e);
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
