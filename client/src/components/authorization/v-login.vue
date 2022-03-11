<template>
  <div class="v-login">

    <div v-if="messages.length">
      <p
          v-for="message in messages"
          :key="message.message"
          class="mb-3 mt-3 alert alert-danger"
          role="alert"
      >
        {{ message.message }}
      </p>
    </div>

    <h2>Форма входа</h2>
    <form class="mb-3" @submit.prevent="login">
      <div class="mb-3">
        <label for="username" class="form-label">Ваш никнейм</label>
        <input type="text" v-model="username" class="form-control" id="username" placeholder="Никнейм" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input type="password" v-model="password" class="form-control" id="password" placeholder="Пароль"
               required>
      </div>
      <button type="submit" class="btn">Войти</button>
    </form>
    <div>
      <span>Нет аккаунта? </span>
      <router-link class="router-link" :to="{ name: 'register'}">
        <span class="register">Зарегистрироваться!</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "v-login",

  data() {
    return {
      messages: [],
      username: "",
      password: ""
    }
  },

  methods: {
    ...mapActions(['SET_USERNAME', 'SET_LOGGED_IN', 'SET_USER_ID']),
    login() {
      if (this.messages.length !== 0) {
        this.messages = [];
      }
      if (!this.username) {
        this.messages.push({message: "Поле никнейма обязательно для заполнения!"});
      }
      if (!this.password) {
        this.messages.push({message: "Поле пароля обязательно для заполнения!"});
      }
      if (this.messages.length === 0) {
        this.$http
            .post("login", {
              username: this.username,
              password: this.password
            })
            .then(res => {
              if (res.data.status === "success") {
                localStorage.setItem("isLoggedIn", "in");
                localStorage.setItem("id", String(res.data.id));
                localStorage.setItem("username", res.data.username);
                this.SET_USERNAME(res.data.username);
                this.SET_LOGGED_IN("in");
                this.SET_USER_ID(res.data.id);
                this.flashMessage.success({
                  message: "Успешная авторизация",
                  time: 7000,
                });
                this.$router.push('/show-servers/');
              }
            })
            .catch(error => {
              console.error(error);
              this.messages.push({message: "Неправильный логин или пароль!"});
              this.password = "";
            });
      } else {
        this.password = "";
      }
    }
  }
}
</script>

<style>
.router-link {
  color: #2c3e50;
  text-decoration: none;
}

.router-link:hover {
  color: #2c3e50;
}

.register {
  border-radius: 4px;
  border: solid 2px antiquewhite;
  outline: none;
  cursor: pointer;
}

.btn {
  padding: 8px 16px;
  background: antiquewhite;
  border: 0;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}

.btn:hover {
  background: #fddcbb;
}
</style>