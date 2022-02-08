import {defineNuxtPlugin, useState} from '#app'
import getCookie from "~/helpers/getCookie";

export default defineNuxtPlugin((nuxt) => {
    const authToken = useState(
        'token',
        () => getCookie(document.cookie, 'token')
    )
})