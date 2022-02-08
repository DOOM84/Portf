import {defineNuxtPlugin, useState} from '#app'
import getCookie from "~/helpers/getCookie";

export default defineNuxtPlugin((nuxt) => {
    const logged = useState(
        'isLoggedIn',
        () => !!getCookie(document.cookie, 'token')
    )
})

