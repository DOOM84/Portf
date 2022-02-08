<template>
  <div>
    <div id="modals"></div>
    <div ref="sideBar" class="wrapper">
      <label @click="toggleMenu" class="admin-menu-btn">
        <i class="fas fa-bars"></i>
        <i class="fas fa-times"></i>
      </label>
      <nav id="sidebar">
        <div class="title">
          Меню
        </div>
        <ul class="list-items">
          <li>
            <NuxtLink to="/admin"><i class="fas fa-home"></i>Главная</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/about"><i class="fas fa-info-circle"></i>Информация</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/projects"><i class="fas fa-tasks"></i>Проекты</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/categories"><i class="fas fa-project-diagram"></i>Категории</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/blog"><i class="fas fa-pen-alt"></i>Блог</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/users"><i class="fas fa-users"></i>Пользователи</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/"><i class="fas fa-sitemap"></i>На сайт</NuxtLink>
          </li>
          <li><a href="#" @click.prevent="logOut"><i class="fas fa-sign-out-alt"></i>Выйти</a></li>

        </ul>
      </nav>
    </div>
    <slot/>
    <TheFooter/>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";

import {useRouter, useRoute} from "vue-router";

const route = useRoute();

const router = useRouter();

const {$logOut} = useNuxtApp();

const showMenu = ref(true);

const sideBar = ref(null);

onMounted(() => {
  showMenu.value = false;
})

watch(route, (to) => {

  if (to.path) {
    showMenu.value = true;
  }
  toggleMenu();

})

function toggleMenu() {

  if (!showMenu.value) {
    sideBar.value.classList.add("toggleBtn");
    showMenu.value = true;
  } else {
    sideBar.value.classList.remove("toggleBtn");
    showMenu.value = false;
  }
}

function logOut() {
  $logOut();
  router.replace('/');
}

</script>

<!--<script>
export default {
  name: "admin",
  data() {
    return {
      showMenu: true
    }
  },
  mounted() {
    this.showMenu = false
  },
  methods: {
    toggleMenu() {
      if (!this.showMenu) {
        this.$refs['sideBar'].classList.add("toggleBtn");
        this.showMenu = true;
      } else {
        this.$refs['sideBar'].classList.remove("toggleBtn");
        this.showMenu = false;
      }
    },
    logOut() {
      this.$nuxt.$logOut();
      this.$router.replace('/');
    },

  },

  watch: {
    '$route'(to, from) {
      if (from.path) {
        this.showMenu = true;
      }
      this.toggleMenu();
    },
  },
}
</script>-->

<style lang="scss" scoped>

.wrapper {

  width: 280px;
  position: absolute;
  z-index: 1000;
  opacity: 0.95;


  .admin-menu-btn {
    position: fixed;
    left: 20px;
    top: 10px;
    background: #4a4a4a;
    color: #fff;
    height: 45px;
    width: 45px;
    z-index: 1000;
    border: 1px solid #333;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    i {
      position: absolute;
      transform: rotate(180deg);
      font-size: 23px;
      transition: all 0.3s ease;
    }

    i.fa-times {
      opacity: 0;
    }
  }
}

#sidebar {
  position: fixed;
  background: #404040;
  height: 100vh;
  width: 270px;
  overflow: hidden;
  /*left: -270px;*/
  transform: translate3d(-100%, 0px, 0px);
  transition: all 0.3s ease;

  .title {
    line-height: 65px;
    text-align: center;
    background: #333;
    font-size: 25px;
    font-weight: 600;
    color: #f2f2f2;
    border-bottom: 1px solid #222;
  }

  .list-items {
    position: relative;
    background: #404040;
    width: 100%;
    height: 100%;
    list-style: none;

    li {
      padding-left: 10px;
      line-height: 50px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid #333;
      transition: all 0.3s ease;

      &:hover {
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
        box-shadow: 0 0px 10px 3px #222;
      }

      &:first-child {
        border-top: none;
      }

      a {
        color: #f2f2f2;
        text-decoration: none;
        font-size: 18px;
        font-weight: 500;
        height: 100%;
        width: 100%;
        display: block;

        i {
          margin-right: 20px;
        }
      }
    }

    .icons {
      width: 100%;
      height: 40px;
      text-align: center;
      position: absolute;
      bottom: 100px;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      a {
        height: 100%;
        width: 40px;
        display: block;
        margin: 0 5px;
        font-size: 18px;
        color: #f2f2f2;
        background: #4a4a4a;
        border-radius: 5px;
        border: 1px solid #383838;
        transition: all 0.3s ease;

        &:first-child {
          margin-left: 0;
        }

        &:hover {
          background: #404040;
        }
      }
    }
  }
}

.toggleBtn {

  .admin-menu-btn {
    left: 227px;

    i.fa-times {
      opacity: 1;
      transform: rotate(-180deg);
    }

    i.fa-bars {
      opacity: 0;
      transform: rotate(180deg);
    }

  }

  #sidebar {

    transform: translate3d(0px, 0px, 0px);

  }

}


@media screen and (max-height: 450px) {
  #sidebar {
    overflow: auto;
  }
}


</style>