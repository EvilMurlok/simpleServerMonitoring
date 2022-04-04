<template>
  <div class="v-login">

    <div class="hero-static">
      <div class="content">
        <b-row class="justify-content-center">
          <b-col md="8" lg="6" xl="4">
            <!-- Sign In Block -->
            <base-block rounded themed header-class="bg-primary-dark" class="mb-0" title="Форма входа">
              <template #options>
                <router-link :to="{ name: 'register'}" class="btn-block-option"
                             v-b-tooltip.hover.nofade.left="'Зарегистрироваться!'">
                  <i class="fa fa-user-plus"></i>
                </router-link>
              </template>
              <div class="p-sm-3 px-lg-4 py-lg-5">
                <h1 class="h2 mb-5">Мониторинг серверов</h1>

                <BaseMessage
                    v-for="item in messages_data.messages"
                    :key="item.text"
                    :message_data="{type: messages_data.type, item: item}"
                />

                <!-- Sign In Form -->
                <b-form @submit.prevent="login">
                  <div class="py-3">
                    <div class="form-group">
                      <label class="form-check-label mb-2">Никнейм</label>
                      <b-form-input size="lg"
                                    class="form-control-alt"
                                    id="username"
                                    name="username"
                                    placeholder="Никнейм"
                                    aria-describedby="username-feedback"
                                    v-model="username"
                      >
                      </b-form-input>
                    </div>
                    <div class="form-group">
                      <label class="form-check-label mb-2">Пароль</label>
                      <b-form-input type="password"
                                    size="lg"
                                    class="form-control-alt"
                                    id="password"
                                    name="password"
                                    placeholder="Пароль"
                                    aria-describedby="password"
                                    v-model="password"
                                    required
                      >
                      </b-form-input>
                    </div>
                  </div>
                  <b-row class="form-group">
                    <b-col md="6" xl="5">
                      <b-button type="submit"
                                variant="alt-primary"
                                block
                      >
                        <i class="fa fa-fw fa-sign-in-alt mr-1"></i> Войти
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
import BaseMessage from "@/layouts/partials/BaseMessage";

export default {
  name: "v-login",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      username: "",
      password: ""
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    if (this.$route.params.username !== undefined) {
      this.username = this.$route.params.username;
    } else {
      this.username = '';
    }
  },

  methods: {
    login() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      if (!this.username) {
        this.messages_data.messages.push(
            {
              text: "Поле никнейма обязательно для заполнения!"
            }
        );
      }
      if (!this.password) {
        this.messages_data.messages.push(
            {
              text: "Поле пароля обязательно для заполнения!"
            }
        );
      }
      if (this.messages_data.messages.length === 0) {
        this.$http
            .post("/auth/login/", {
              username: this.username,
              password: this.password
            })
            .then(res => {
              if (res.data.status === "success") {
                localStorage.setItem("isLoggedIn", "in");
                localStorage.setItem("id", String(res.data.id));
                localStorage.setItem("username", res.data.username);
                this.$router.push({
                      name: 'retrieveProjects',
                      params: {
                        messages_data: {type: res.data.status, messages: [{ text: "Успешная авторизация!"}]}
                      }
                    }
                );
              }
            })
            .catch(error => {
              console.error(error);
              this.messages_data.messages.push(
                  {
                    text: "Неправильный логин или пароль!"
                  }
              );
              this.password = "";
            });
      } else {
        this.password = "";
      }
    }
  }
}
</script>