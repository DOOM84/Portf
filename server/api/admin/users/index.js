import admin from "firebase-admin";

export default async (req, res) => {

    try {

        try {

            const resUsers = [];

                const {users} = await admin.auth().listUsers(1000, '1');

                users.forEach((user)=>{

                    resUsers.push({
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL ? user.photoURL.substring(user.photoURL.lastIndexOf('/') + 1) : null,
                        disabled: user.disabled,
                        customClaims:  user.customClaims ? user.customClaims : {admin:false},
                        uid: user.uid
                    })
                })

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                users: resUsers
            }));

        }catch (e) {

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 401;
            res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!', users: []}));
        }

    }catch (e){
        //console.log(e);
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
