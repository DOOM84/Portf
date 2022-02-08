<template>
  <header ref="mainHead">
    <div @click="toggleMenu" ref="menuBtn" class="menu-btn">
      <div class="btn-line"></div>
      <div class="btn-line"></div>
      <div class="btn-line"></div>
    </div>
    <div v-if="showMenu && showLang" class="lang-btn">
      <div @click="setLocale('loc', 'ua')">ua</div>
      <div @click="setLocale('loc', 'en')">en</div>
      <div @click="setLocale('loc', 'ru')">ru</div>
    </div>

    <nav class="menu" ref="menu">
      <div class="menu-branding" ref="menuBranding">
        <div class="portrait"></div>
      </div>
      <ul class="menu-nav" ref="menuNav">
        <li class="nav-item">
          <NuxtLink to="/" class="nav-link">{{ $t('home') }}</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/about" class="nav-link">{{ $t('about_me.linked') }}</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/work" class="nav-link">{{ $t('projects') }}</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/blog" class="nav-link">{{ $t('blog') }}</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/contact" class="nav-link">{{ $t('contact_me') }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>

import {ref, onMounted, watch} from "vue";

const loc = useState('locale');

import {useRoute} from 'vue-router';
const route = useRoute();

const {$i18n} = useNuxtApp();

const showMenu = ref(true);
const showLang = ref(false);
const mainHead = ref(null);

onMounted(() => {
  showMenu.value = false
})

function setLocale(name, data) {
  $i18n().global.locale = data;
  loc.value = data;
  let now = new Date();
  now.setTime(now.getTime() + 1 * 3600 * 1000 * 24 * 30);
  let expires = "expires=" + now.toUTCString();
  document.cookie = name + "=" + data + ";" + expires + ";path=/; SameSite=Lax;";
}

function toggleMenu() {
  if (!showMenu.value) {
    mainHead.value.classList.add("toggleMenu");
    showMenu.value = true;
    showLang.value = true;
  } else {
    mainHead.value.classList.remove("toggleMenu");
    showMenu.value = false;
    showLang.value = false;
  }
}

watch(route, () => {
  showMenu.value = true;
  toggleMenu();
})

</script>

<!--<script>
export default {
  name: "TheHeader",

  data() {
    return {
      showMenu: true,
      showLang: false
    }
  },

  watch: {
    '$route'(to, from) {
      if (from.path) {
        this.showMenu = true;
      }
      this.toggleMenu();
    },
  },


  mounted() {
    this.showMenu = false
  },

  methods: {
    setLocale(name, data) {
      this.$i18n.locale = data;
      this.loc = data;
      let now = new Date();
      now.setTime(now.getTime() + 1 * 3600 * 1000 * 24 * 30);
      let expires = "expires=" + now.toUTCString();
      document.cookie = name + "=" + data + ";" + expires + ";path=/; SameSite=Lax;";
    },


    toggleMenu() {
      if (!this.showMenu) {
        this.$refs['mainHead'].classList.add("toggleMenu");
        this.showMenu = true;
        this.showLang = true;
      } else {
        this.$refs['mainHead'].classList.remove("toggleMenu");
        this.showMenu = false;
        this.showLang = false;
      }
    },
  },
}


</script>-->

<style lang="scss" scoped>

.toggleMenu {
  .menu-btn {
    transform: rotate(180deg);

    .btn-line {
      &:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  }

  .menu {
    visibility: visible;

    .menu-nav {
      transform: translate3d(0, 0, 0);

      .nav-item {
        transform: translate3d(0, 0, 0);
      }
    }

    .menu-branding {
      transform: translate3d(0, 0, 0);
    }
  }
}

</style>