import {defineNuxtPlugin, useState} from '#app';
import getCookie from '../helpers/getCookie';

export default defineNuxtPlugin((nuxt) => {
    let loc;
    const locales = ['ua', 'en', 'ru'];
    if (process.server) {
        loc = getCookie(nuxt.ssrContext.req.headers.cookie, 'loc');
        loc = (loc && locales.includes(loc)) ? loc : 'ua'

        const locale = useState(
            'locale',
            () => loc
        )
    }


})
