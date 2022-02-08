import {defineNuxtPlugin, useState} from '#app'

export default defineNuxtPlugin((nuxt) => {
    const isAdmin = useState(
        'isAdmin',
        () => false
    )
})