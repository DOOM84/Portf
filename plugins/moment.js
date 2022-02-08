import {defineNuxtPlugin, useState} from '#app'
import moment from 'moment/min/moment-with-locales.js';


export default defineNuxtPlugin(nuxtApp => {

    nuxtApp.provide('showAge', () => {
        return moment().diff('1984-06-07', 'years')
    })

    nuxtApp.provide('showDateHuman', (stamp) => {
        prepareLocale();
        return moment(stamp).fromNow()
    })

    nuxtApp.provide('showDate', (stamp) => {
        prepareLocale();
        return moment(stamp).format('Do MMMM YYYY HH:mm')
    })

    nuxtApp.provide('postDate', (stamp) => {
        prepareLocale();
        return moment(stamp).format('DD MMM YYYY')
    })
    //nuxtApp.provide('showAge', () =>  {return moment().diff('1984-06-07', 'years')})

    //console.log(moment(1454521239279).format('12 MMM YYYY'));
    //console.log(moment(1454521239279).format('dd MMM yyyy HH:mm'));
    //console.log(moment(1636718466772).fromNow());


})

function prepareLocale() {
    let loc = useState('locale').value;
    if (loc === 'ua') {
        loc = 'uk'
    }
    moment.locale(loc);
    //return moment(stamp).fromNow()
}
