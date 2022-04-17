<template>
  <div class="v-register">
    <div class="hero-static">
      <div class="content">
        <b-row class="justify-content-center">
          <b-col md="8" lg="6" xl="4">
            <base-block
                class="mb-0"
                header-class="bg-primary-dark"
                title="Create Account"
                rounded
                themed
            >
              <template #options>
                <router-link :to="{ name: 'login'}"
                             class="btn-block-option"
                             v-b-tooltip.hover.nofade.left="'Войти'"
                >
                  <i class="fa fa-sign-in-alt"></i>
                </router-link>
              </template>
              <div class="p-sm-3 px-lg-4 py-lg-5">
                <h1 class="h2 mb-1">Мониторинг серверов</h1>
                <p class="text-muted">Форма регистрации пользователя</p>

                <BaseMessage
                    v-for="item in messages_data.messages"
                    :key="item.text"
                    :message_data="{type: messages_data.type, item: item}"
                />

                <b-form @submit.prevent="register">
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
                                    required
                      >
                      </b-form-input>
                    </div>
                    <div class="form-group">
                      <label class="form-check-label mb-2">Почтовый ящик</label>
                      <b-form-input size="lg"
                                    class="form-control-alt"
                                    id="email"
                                    name="email"
                                    placeholder="Почтовый ящик"
                                    aria-describedby="email"
                                    v-model="email"
                                    required
                      >
                      </b-form-input>
                    </div>
                    <div class="form-group">
                      <label class="form-check-label mb-2">Телефон</label>
                      <b-form-input size="lg"
                                    class="form-control-alt"
                                    id="phone"
                                    name="phone"
                                    placeholder="Телефон"
                                    aria-describedby="phone"
                                    v-model="phone"
                                    required
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
                    <div class="form-group">
                      <label class="form-check-label mb-2">Подтверждение пароля</label>
                      <b-form-input type="password"
                                    size="lg"
                                    class="form-control-alt"
                                    id="confirm_password"
                                    name="confirm_password"
                                    placeholder="Подтверждение пароля"
                                    aria-describedby="confirm_password"
                                    v-model="confirm_password"
                                    required
                      >
                      </b-form-input>
                    </div>
                  </div>
                  <b-row class="form-group">
                    <b-col md="6" xl="8">
                      <b-button type="submit"
                                variant="alt-success"
                      >
                        <i class="fa fa-plus mr-1"></i> Зарегистрироваться
                      </b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </div>
            </base-block>
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
  name: "v-register",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      username: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: ""
    }
  },

  methods: {
    register() {
      if (this.messages_data.messages && this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      let [
        right_username,
        right_password,
        right_phone,
        right_email,

      ] = [
        /^[a-zA-Z0-9_]{3,16}$/,
        /^[a-zA-Z0-9_-]+/,
        /^[+]*[0-9]{0,3}[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
      ];
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
              text: "Поле никнейма обязательно для заполнения!"
            }
        );
      }
      if (!this.confirm_password) {
        this.messages_data.messages.push(
            {
              text: "Поле 'подтверждения пароля' обязательно для заполнения!"
            }
        );
      }
      if (!this.email) {
        this.messages_data.messages.push(
            {
              text: "Поле 'почта' обязательно для заполнения!"
            }
        );
      }
      if (!this.phone) {
        this.messages_data.messages.push(
            {
              text: "Поле 'телефон' обязательно для заполнения!"
            }
        );
      }
      if (this.password && this.password.length < 6) {
        // this.messages.push({message: "Пароль не должен быть короче 6 символов!"});
        this.messages_data.messages.push(
            {
              text: "Пароль не должен быть короче 6 символов!"
            }
        );
      }
      if (this.password && this.confirm_password && (this.password !== this.confirm_password)) {
        this.messages_data.messages.push(
            {
              text: "Пароли не совпадают!"
            }
        );
      }
      if (this.username && !right_username.test(this.username)) {
        this.messages_data.messages.push(
            {
              text: "Никнейм должен состоять только из латинских букв, цифр, символов подчеркивания длиной 3-16 символов!"
            }
        );
      }
      if (this.password && !right_password.test(this.password)) {
        this.messages_data.messages.push(
            {
              text: "Пароль  должен состоять только из латинских буквы и цифр, символов подчеркивания и тире!"
            }
        );
      }
      if (this.phone && !right_phone.test(this.phone)) {
        this.messages_data.messages.push(
            {
              text: "Неверный формат телефона!"
            }
        );
      }
      if (this.email && !right_email.test(this.email)) {
        this.messages_data.messages.push(
            {
              text: "Неверный формат почты!"
            }
        );
      }
      if (this.messages_data.messages.length === 0) {
        this.$http
            .post("/auth/register/", {
              username: this.username,
              phone: this.phone,
              email: this.email,
              password: this.password,
              confirm_password: this.confirm_password
            })
            .then(res => {
              if (res.data.status === "success") {
                this.$router.push({
                      name: 'login',
                      params: {
                        username: this.username,
                        messages_data: {type: res.data.status, messages: res.data.messages}
                      }
                    }
                );
              } else {
                this.messages_data = {type: res.data.status, messages: res.data.messages};
                this.password = "";
                this.confirm_password = "";
              }
            })
            .catch(error => {
              console.error(error);
            });
      } else {
        this.password = "";
        this.confirm_password = "";
      }
    }
  }
}
</script>