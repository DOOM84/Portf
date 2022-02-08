import {defineNuxtPlugin} from '#app';
import database from '../helpers/dbConn';

export default defineNuxtPlugin(nuxtApp => {
    database();
})



