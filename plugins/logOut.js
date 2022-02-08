import {defineNuxtPlugin, useState} from '#app'

export default defineNuxtPlugin(nuxtApp => {
    const user = useState("user");
    const isLoggedIn = useState("isLoggedIn");
    const authToken = useState("token");
    const isAdmin = useState("isAdmin");
    nuxtApp.provide('logOut', async () => {

        isLoggedIn.value = false;
        authToken.value = false;
        user.value = false;
        isAdmin.value = false;

        await $fetch('/api/signout')

        if (!process.server) {
            document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    })
})
