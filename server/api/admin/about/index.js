import {getDatabase, ref, get, query} from "firebase/database";

const db = getDatabase();


export default async (req, res) => {

    try {
        const aboutSnap = await get(query(ref(db, `trainings`)));

        const aboutArray = Object.entries(aboutSnap.val()).map(([key, value]) => value)
            .sort((a, b) => {
                return b.begin - a.begin;
            });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            facts: aboutArray
        }));

    } catch (e) {
        console.log(e);
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
