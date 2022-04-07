<template>
  <base-layout :layout-classes="layoutClasses">
    <!-- Sidebar Content -->
    <!-- Using the available v-slot, we can override the default Sidebar content from layouts/partials/Sidebar.vue -->
    <template #sidebar>
      <!-- Side Header -->
      <div class="content-header bg-white-5">
        <!-- Logo -->
        <!--        <router-link to="/landing" class="font-w600 text-dual">-->
        <span class="smini-visible">
            <i class="fa fa-circle-notch text-primary"></i>
          </span>
        <span class="smini-hide font-size-h5 tracking-wider">
            <span class="font-w400">Мониторинг</span>
        </span>
        <!--        </router-link>-->
        <!-- END Logo -->

        <!-- Extra -->
        <div>
          <!-- Close Sidebar, Visible only on mobile screens -->
          <base-layout-modifier size="sm"
                                variant="dual"
                                action="sidebarClose"
                                class="d-lg-none ml-2"
          >
            <i class="fa fa-times"></i>
          </base-layout-modifier>
          <!-- END Close Sidebar -->
        </div>
        <!-- END Extra -->
      </div>
      <!-- END Side Header -->

      <!-- Sidebar Scrolling -->
      <simplebar class="js-sidebar-scroll">
        <!-- Side Navigation -->
        <div class="content-side">
          <base-navigation
              :nodes="[
              {
                name: 'Личная информация',
                heading: true,
              },
              {
                name: 'Мой профиль',
                to: '/retrieve-user/',
                icon: 'si si-info'
              },

              {
                name: 'Проекты',
                heading: true
              },
              {
                name: 'Мои поекты',
                to: '/retrieve-projects/',
                icon: 'fa fa-clipboard-list'
              },
              {
                name: 'Доступные мне (в разработке)',
                // to: '/retrieve-servers/',
                icon: 'fa fa-clipboard-list'
              },

              {
                name: 'Права',
                heading: true
              },
              {
                name: 'Мои правав (в разработке)',
                // to:,
                icon: 'si si-plus'
              },

              {
                name: 'Серверы',
                heading: true
              },
              {
                name: 'Мои серверы',
                to: '/retrieve-servers/',
                icon: 'fa fa-server'
              },
              {
                name: 'Доступные мне (в разработке)',
                // to: '/retrieve-servers/',
                icon: 'fa fa-server'
              },

              {
                name: 'Dashboards',
                heading: true
              },
              {
                name: 'Мои доски (в разработке)',
                // to: '/backend/dashboard',
                icon: 'si si-speedometer'
              },

            ]"
          ></base-navigation>
        </div>
        <!-- END Side Navigation -->
      </simplebar>
      <!-- END Sidebar Scrolling -->
    </template>
    <!-- END Sidebar Content -->

    <!-- Header Content -->
    <!-- Using the available v-slot, we can override the default Header content from layouts/partials/Header.vue -->
    <template #header>
      <!-- Header Content -->
      <div class="content-header">
        <!-- Left Section -->
        <div class="d-flex align-items-center">
          <!-- Toggle Sidebar -->
          <base-layout-modifier action="sidebarToggle"
                                size="sm"
                                variant="dual"
                                class="mr-2 d-lg-none"
          >
            <i class="fa fa-fw fa-bars"></i>
          </base-layout-modifier>
          <!-- END Toggle Sidebar -->

          <!-- Toggle Mini Sidebar -->
          <base-layout-modifier action="sidebarMiniToggle"
                                size="sm"
                                variant="dual"
                                class="mr-2 d-none d-lg-inline-block"

          >
            <i class="fa fa-fw fa-ellipsis-v"></i>
          </base-layout-modifier>
          <!-- END Toggle Mini Sidebar -->
        </div>
        <!-- END Left Section -->

        <!-- Right Section -->
        <div class="d-flex align-items-center">
          <!--           Toggle Side Overlay-->
          <!--          <base-layout-modifier action="sideOverlayToggle" variant="dual" size="sm" class="ml-2">-->
          <!--            <i class="fa fa-fw fa-list-ul fa-flip-horizontal"></i>-->
          <!--          </base-layout-modifier>-->
          <b-button variant="alt-danger"
                    @click="logout"
                    v-click-ripple
          >
            <i class="fa fa-window-close opacity-50 mr-1"></i>
            Выйти
          </b-button>
          <!--           END Toggle Side Overlay-->
        </div>
        <!-- END Right Section -->
      </div>
      <!-- END Header Content -->
    </template>
    <!-- END Header Content -->

    <!-- Footer Content -->
    <!-- Using the available v-slot, we can override the default Footer content from layouts/partials/Footer.vue -->
    <template #footer>
      <div class="content py-3">
        <b-row class="font-size-sm">
          <b-col sm="6"
                 order-sm="2"
                 class="py-1 text-center text-sm-right"
          >
            <!--            Crafted with <i class="fa fa-heart text-danger"></i> by <a class="font-w600" href="https://1.envato.market/5Noyb" target="_blank">pixelcave</a>-->
          </b-col>
          <b-col sm="6"
                 order-sm="1"
                 class="py-1 text-center text-sm-left"
          >
            <b>Simple Server Monitoring 0.0.1</b> &copy; 2022
          </b-col>
        </b-row>
      </div>
    </template>
    <!-- END Footer Content -->
  </base-layout>
</template>

<script>
import BaseLayout from '../Base'

// SimpleBar, for more info and examples you can check out https://github.com/Grsmto/simplebar/tree/master/packages/simplebar-vue
import simplebar from 'simplebar-vue'
import {breakAuth} from "@/utils/authorization";

export default {
  name: 'LayoutBackend',
  components: {
    BaseLayout,
    simplebar
  },
  data() {
    return {
      username: localStorage.getItem("username") || '',
      // Override and set custom CSS classes to the container of each base layout element
      layoutClasses: {
        sideOverlay: '',
        sidebar: '',
        header: '',
        footer: ''
      }
    }
  },
  created() {
    // Set default elements for this layout
    this.$store.commit('setLayout', {
      header: true,
      sidebar: true,
      // sideOverlay: true,
      sideOverlay: false,
      footer: true
    })

    // Set various template options
    this.$store.commit('headerStyle', {mode: 'light'})
    this.$store.commit('mainContent', {mode: 'full'})
  },
  methods: {
    logout() {
      this.$http
          .get("/auth/logout/")
          .then(res => {
            breakAuth();
            this.$router.push({
              name: "login",
              params: {
                messages_data: {type: res.data.status, messages: res.data.messages}
              }
            });
          })
          .catch(error => console.error(error));
    }
  }
}
</script>
