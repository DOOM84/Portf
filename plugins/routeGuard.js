import getCookie from "~/helpers/getCookie";
import { useState } from '#app';
//import {useState} from "nuxt3/dist/app";

export default defineNuxtPlugin(async ({ssrContext, $logOut}) => {
    const router = useRouter();
    let token = null;
    const user = useState("user");
    const authToken = useState("token");
    const loggedIn = useState('isLoggedIn');
    const isAdmin = useState('isAdmin');

    if (process.server && ssrContext) {

        const {res, url} = ssrContext;
        const {path} = router.resolve(url);

        token = getCookie(ssrContext.req.headers.cookie, 'token');

        const toName = path.split("/");

        //try {

            //token = getCookie(nuxtApp.ssrContext.req.headers.cookie, 'token')

            if (toName[1] === 'blog' || toName[1] === 'search') {

                try {
                    if (!token) {
                        await Promise.reject(Error());
                    }

                    const data = await $fetch('/api/user',
                        {params: {token: token}})

                    if (data) {
                        user.value = {
                            name: data.login,
                            avatar: data.avatar ? data.avatar.substring(data.avatar.lastIndexOf('/') + 1) : null
                        };
                    } else {

                        $logOut();
                    }

                } catch (e) {
                    $logOut();
                }
            }

            if ((toName[1] === 'auth')) {
                if (token) {
                    try {

                        const data = await $fetch('/api/user',
                            {params: {token: token}})
                        if (data) {
                            ssrContext.res.writeHead(302, {Location: '/'});
                            ssrContext.res.end();
                        }
                    } catch (e) {
                        //console.log(e);
                    }

                }
            }

            if ((toName[1] === 'admin')) {
                try {
                    if (!token) {
                        await Promise.reject(Error());
                    }

                    const {access} = await $fetch('/api/check',
                        {params: {token: token}})

                    if (!access) {
                        await Promise.reject(Error());
                    } else {
                        isAdmin.value = true;
                    }

                } catch (e) {
                    ssrContext.res.writeHead(302, {Location: '/404'});
                    ssrContext.res.end();
                    //console.log(e);
                }
            }

            /*if (toName[1] === 'admin') {

                //try {
                if (!token) {
                    await Promise.reject(Error());
                }

                const data = await $fetch('/api/user',
                    {params: {token: token}})

                if (data) {
                    user.value = {
                        name: data.login,
                        level: data.level,
                    };
                }

                const {access} = await $fetch('/api/check',
                    {params: {token: token}})

                if (!access) {
                    await Promise.reject(Error());
                }
            } else {


                if (!token) {
                    await Promise.reject(Error());
                }

                const data = await $fetch('/api/user',
                    {params: {token: token}})

                if (data) {
                    user.value = {
                        name: data.login,
                        level: data.level,
                    };
                } else {
                    $logOut();
                    if (path !== "/") {
                        res.writeHead(302, {Location: "/"});
                        res.end();
                    }
                }
            }*/
        /*} catch (e) {
            $logOut();
            if (toName[1] === 'admin') {
                res.writeHead(302, {Location: "/404"});
                res.end();
            } else if (path !== "/" && path !== "/404") {
                res.writeHead(302, {Location: "/"});
                res.end();
            }
        }*/
    } else if (process.client) {
        router.beforeEach(async (to, from, next) => {

            const toName = to.path.split("/");



            if (!user.value && authToken.value) {
                if (toName[1] === 'blog') {
                    try {

                        const data = await $fetch('/api/user')

                        if (data) {
                            user.value = {
                                name: data.login,
                                avatar: data.avatar ? data.avatar.substring(data.avatar.lastIndexOf('/') + 1) : null
                            };
                        }

                    } catch (e) {

                        $logOut();
                    }
                }
            }

            if ((toName[1] === 'admin')) {
                try {
                    if (!authToken.value) {
                        return next('/404');
                    }

                    const {access} = await $fetch('/api/check',
                        {params: {token: token}})

                    if (!access) {
                        return next('/404');
                    } else {
                        isAdmin.value = true;
                        return next()
                    }

                } catch (e) {
                    return next('/');
                    //console.log(e);
                }
            }

            if (toName[1] === 'auth' && loggedIn.value) {
                return next('/');
            }

            return next();
            /*








            if (to.path !== "/" && toName[1] !== 'admin' && toName[1] !== '404') {

                try {
                    await $fetch('/api/checkauth')
                    return next();
                } catch (e) {

                    const showModal = useSign();
                    const nextPlace = useNextplace();
                    $logOut();
                    nextPlace.value = to.path;
                    showModal.value = true;

                    next(false)
                }

            } else if (toName[1] === 'admin') {

                try {

                    const {access} = await $fetch('/api/check')

                    if (!access) {
                        $logOut();
                        return next('/404');
                    } else {
                        return next();
                    }

                } catch (e) {
                    $logOut();
                    return next('/404');
                }

            } else {
                return next();
            }*/

        });
    }
});
