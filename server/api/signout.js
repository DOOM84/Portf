import {getAuth, signOut} from "firebase/auth";

export default async (req, res) => {

    const auth = getAuth();

    try {
        await signOut(auth);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({msg: 'Logged out successfully'}));

    } catch (e) {
        //console.log(e);
        //res.statusCode = 403;
        //res.end(e.code);
        res.end()
    }
}