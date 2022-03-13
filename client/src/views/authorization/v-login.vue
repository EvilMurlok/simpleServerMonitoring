<template>
  <div class="v-login">

    <div class="hero-static">
      <div class="content">
        <b-row class="justify-content-center">
          <b-col md="8" lg="6" xl="4">
            <!-- Sign In Block -->
            <base-block rounded themed header-class="bg-primary-dark" class="mb-0" title="Sign In">
              <template #options>
                <router-link :to="{ name: 'register'}" class="btn-block-option"
                             v-b-tooltip.hover.nofade.left="'Зарегистрироваться!'">
                  <i class="fa fa-user-plus"></i>
                </router-link>
              </template>
              <div class="p-sm-3 px-lg-4 py-lg-5">
                <h1 class="h2 mb-1">Мониторинг серверов</h1>
                <p class="text-muted">
                  Форма входа
                </p>

                <div v-if="messages.length">
                  <b-alert v-for="message in messages" :key="message.message" variant="warning"
                           show class="d-flex align-items-center justify-content-between">
                    <div class="flex-fill mr-3">
                      <p class="mb-0">{{ message.message }}</p>
                    </div>
                    <div class="flex-00-auto">
                      <i class="fa fa-fw fa-exclamation-circle"></i>
                    </div>
                  </b-alert>
                </div>

                <!-- Sign In Form -->
                <b-form @submit.prevent="login">
                  <div class="py-3">
                    <div class="form-group">
                      <b-form-input size="lg" class="form-control-alt" id="username" name="username"
                                    placeholder="Никнейм" aria-describedby="username-feedback"
                                    v-model="username">
                      </b-form-input>
                    </div>
                    <div class="form-group">
                      <b-form-input type="password" size="lg" class="form-control-alt" id="password" name="password"
                                    placeholder="Пароль" aria-describedby="password"
                                    v-model="password" required></b-form-input>
                    </div>
                  </div>
                  <b-row class="form-group">
                    <b-col md="6" xl="5">
                      <b-button type="submit" variant="alt-primary" block>
                        <i class="fa fa-fw fa-sign-in-alt mr-1"></i> Sign In
                      </b-button>
                    </b-col>
                  </b-row>
                </b-form>
                <!-- END Sign In Form -->
              </div>
            </base-block>
            <!-- END Sign In Block -->
          </b-col>
        </b-row>
      </div>
      <div class="content content-full font-size-sm text-muted text-center">
        <strong>{{ 'Simple Server Monitoring 0.0.1' }}</strong> &copy; {{ '2022' }}
      </div>
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