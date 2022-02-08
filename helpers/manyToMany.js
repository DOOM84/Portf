//import database from '../helpers/dbConn';
import {child, get, getDatabase, ref} from "firebase/database";

//database();

const dbRef = ref(getDatabase());

export default async (slug, pivotTable, sourceTable) => {

    const ids = [];
    return new Promise((resolve) => {
        get(child(dbRef, pivotTable + '/' + slug))
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    ids.push(doc.key);
                });
                const getDocs = ids.map((id) => {

                    return get(child(dbRef, sourceTable + '/' + id))
                        .then((docData) => {
                            return docData.val();
                        });
                });
                Promise.all(getDocs).then((res) => {
                    resolve(res);
                });
            });
    });

}


