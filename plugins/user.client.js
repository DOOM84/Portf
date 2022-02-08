import {defineNuxtPlugin, useState} from '#app'

export default defineNuxtPlugin((nuxt) => {
    const user = useState(
        'user',
        () => false
    )
})