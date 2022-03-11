<template>
  <div class="v-nav">
    <nav class="navbar navbar-expand-lg navbar-light nav mb-3">
      <div class="container-fluid">
        <router-link class="router-link" :to="{ name: 'mainWrapper'}">
          <div class="navbar-brand">Главная</div>
        </router-link>
        <router-link  v-if="IS_LOGGED_IN === 'in'" class="router-link" :to="{ name: 'showServers'}">
          <div class="navbar-brand">Мои серверы</div>
        </router-link>
        <router-link  v-if="IS_LOGGED_IN === 'in'" class="router-link" :to="{ name: 'addServer'}">
          <div class="navbar-brand">Добавить сервер</div>
        </router-link>


        <div v-if="IS_LOGGED_IN === 'in'" class="navbar-nav">
          <div class="logout navbar-brand" @click="logout">
            Выход
          </div>
        </div>
        <div v-else class="navbar-nav">
          <router-link class="router-link" :to="{ name: 'login'}">
            <div class="navbar-brand">Вход</div>
          </router-link>
          <router-link class="router-link" :to="{ name: 'register'}">
            <div class="navbar-brand">Регистрация</div>
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";

export default {
  name: "v-nav",
  computed: {
    ...mapGetters(["IS_LOGGED_IN"])
  },
  methods: {
    ...mapActions(["SET_LOGGED_IN", "SET_USERNAME", "SET_USER_ID"]),
    logout() {
      this.$http
          .get("logout")
          .then(res => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            localStorage.removeItem("id");
            this.SET_LOGGED_IN("out");
            this.SET_USERNAME("");
            this.SET_USER_ID(0);
            if (res.data.status === "danger") {
              this.flashMessage.error({
                message: res.data.message,
                time: 7000,
              });
            } else {
              this.flashMessage.success({
                message: res.data.message,
                time: 7000,
              });
            }
            this.$router.push("/login/");
          })
          .catch(error => console.error(error));
    }
  }
}
</script>

<style>
.nav {
  background: antiquewhite;
}

.router-link {
  text-decoration: none;
}

.logout {
  cursor: pointer;
}
</style>