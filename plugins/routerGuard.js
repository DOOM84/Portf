import {defineNuxtPlugin, useState} from '#app';
import getCookie from "~/helpers/getCookie";

export default defineNuxtPlugin(async (nuxtApp) => {
    /*let token = null;
    const user = useState("user");
    const authToken = useState("token");
    const loggedIn = useState('isLoggedIn');
    const isAdmin = useState('isAdmin');


    nuxtApp.$router.beforeEach(async (to, from) => {

        const toName = to.name.split("-")[0];

        if (process.server) {

            token = getCookie(nuxtApp.ssrContext.req.headers.cookie, 'token')

            if (toName === 'blog' || toName === 'search') {

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

                        nuxtApp.$logOut();
                    }

                } catch (e) {
                    nuxtApp.$logOut();
                }
            }
            if ((toName === 'auth')) {
                if (token) {
                    try {

                        const data = await $fetch('/api/user',
                            {params: {token: token}})
                        if (data) {
                            nuxtApp.ssrContext.res.writeHead(302, {Location: '/'});
                            nuxtApp.ssrContext.res.end();
                        }
                    } catch (e) {
                        //console.log(e);
                    }

                }
            }
            if ((toName === 'admin')) {
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
                    nuxtApp.ssrContext.res.writeHead(302, {Location: '/404'});
                    nuxtApp.ssrContext.res.end();
                    //console.log(e);
                }
            }
        } else {

            if (!user.value && authToken.value) {
                if (toName === 'blog') {
                    try {

                        const data = await $fetch('/api/user')

                        if (data) {
                            user.value = {
                                name: data.login,
                                avatar: data.avatar ? data.avatar.substring(data.avatar.lastIndexOf('/') + 1) : null
                            };
                        }

                    } catch (e) {

                        nuxtApp.$logOut();
                    }
                }
            }

            if ((toName === 'admin')) {
                try {
                    if (!authToken.value) {
                        return '/404';
                    }

                    const {access} = await $fetch('/api/check',
                        {params: {token: token}})

                    if (!access) {
                        return '/404';
                    } else {
                        isAdmin.value = true;
                    }

                } catch (e) {
                    return '/';
                    //console.log(e);
                }
            }

            if (toName === 'auth' && loggedIn.value) {
                return '/'
            }

        }
    })*/
})