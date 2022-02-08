import {getDatabase, ref, get, query} from "firebase/database";

const db = getDatabase();

/*const setAsyncTimeout = (cb, timeout = 0) => new Promise(resolve => {
    setTimeout(() => {
        cb();
        resolve();
    }, timeout);
});*/

export default async (req, res) => {

    /*await setAsyncTimeout(() => {
        // Do even more stuff
    }, 2000);*/

    try {
        const aboutSnap = await get(query(ref(db, `trainings`)));

        const aboutArray = Object.entries(aboutSnap.val()).map(([key, value]) => value)
            .filter((fact) => !!fact.status)
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
