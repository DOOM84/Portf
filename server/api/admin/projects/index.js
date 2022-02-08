import {
    getDatabase,
    ref,
    get,
    query,
} from "firebase/database";

const db = getDatabase();

export default async (req, res) => {
    try {
        const projectsSnap = await get(query(ref(db, `projects`)));

        const projectsArray = Object.entries(projectsSnap.val()).map(([key, value]) => value)

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            projects: projectsArray
        }));
    } catch (e) {
        console.log(e);
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
