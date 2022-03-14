<template>
  <div class="v-register">
    <div class="hero-static">
      <div class="content">
        <b-row class="justify-content-center">
          <b-col md="8" lg="6" xl="4">
            <!-- Sign Up Block -->
            <base-block rounded themed class="mb-0" header-class="bg-primary-dark" title="Create Account">
              <template #options>
                <router-link :to="{ name: 'login'}" class="btn-block-option" v-b-tooltip.hover.nofade.left="'Войти'">
                  <i class="fa fa-sign-in-alt"></i>
                </router-link>
              </template>
              <div class="p-sm-3 px-lg-4 py-lg-5">
                <h1 class="h2 mb-1">Мониторинг серверов</h1>
                <p class="text-muted">
                  Форма регистрации пользователя
                </p>

                <div v-for="message in messages" :key="message.message">

                  <b-alert v-if="message.type === 'error'" variant="warning"
                           show class="d-flex align-items-center justify-content-between">
                    <div class="flex-00-auto">
                      <i class="fa fa-fw fa-exclamation-circle"></i>
                    </div>
                    <div class="flex-fill mr-3">
                      <p class="mb-0">{{message.text}}</p>
                    </div>
                  </b-alert>

                  <b-alert v-else-if="message.type === 'success'" variant="success"
                           show class="d-flex align-items-center">
                    <div class="flex-00-auto">
                      <i class="fa fa-fw fa-check"></i>
                    </div>
                    <div class="flex-fill ml-3">
                      <p class="mb-0">{{message.text}}</p>
                    </div>
                  </b-alert>
<!--                  <b-alert  v-for="message in messages"-->
<!--                            :key="message.message" variant="warning"-->
<!--                            show class="d-flex align-items-center justify-content-between">-->
<!--                    <div class="flex-fill mr-3">-->
<!--                      <p class="mb-0">{{ message.message }}</p>-->
<!--                    </div>-->
<!--                    <div class="flex-00-auto">-->
<!--                      <i class="fa fa-fw fa-exclamation-circle"></i>-->
<!--                    </div>-->
<!--                  </b-alert>-->
                </div>

                <!-- Sign Up Form -->
                <b-form @submit.prevent="register">
                  <div class="py-3">
                    <div class="form-group">
                      <b-form-input size="lg" class="form-control-alt" id="username" name="username"
                                    placeholder="Никнейм" aria-describedby="username-feedback"
                                    v-model="username" required>
                      </b-form-input>
                    </div>
                    <div class="form-group">
                      <b-form-input type="password" size="lg" class="form-control-alt" id="password" name="password"
                                    placeholder="Пароль" aria-describedby="password"
                                    v-model="password" required></b-form-input>
                    </div>
                    <div class="form-group">
                      <b-form-input type="password" size="lg" class="form-control-alt" id="confirm_password"
                                    name="confirm_password" placeholder="Подтверждение пароля"
                                    aria-describedby="confirm_password"
                                    v-model="confirm_password" required></b-form-input>
                    </div>
                  </div>
                  <b-row class="form-group">
                    <b-col md="6" xl="8">
                      <b-button type="submit" variant="alt-success">
                        <i class="fa fa-fw fa-plus mr-1"></i> Зарегистрироваться
                      </b-button>
                    </b-col>
                  </b-row>
                </b-form>
                <!-- END Sign Up Form -->
              </div>
            </base-block>
            <!-- END Sign Up Block -->
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

export default {
  name: "v-register",

  data() {
    return {
      messages: [],
      username: "",
      password: "",
      confirm_password: ""
    }
  },

  methods: {
    register() {
      if (this.messages.length !== 0) {
        this.messages = [];
      }
      let [right_username, right_password] = [/^[a-zA-Z0-9_]{3,16}$/, /^[a-zA-Z0-9_-]+/];
      if (!this.username) {
        // this.messages.push({message: "Поле никнейма обязательно для заполнения!"});
        this.messages.push(
            {
              type: "error",
              text: "Поле никнейма обязательно для заполнения!"
            }
        );
      }
      if (!this.password) {
        // this.messages.push({message: "Поле пароля обязательно для заполнения!"});
        this.messages.push(
            {
              type: "error",
              text: "Поле никнейма обязательно для заполнения!"
            }
        );
      }
      if (!this.confirm_password) {
        // this.messages.push({message: "Поле 'подтверждения пароля' обязательно для заполнения!"});
        this.messages.push(
            {
              type: "error",
              text: "Поле 'подтверждения пароля' обязательно для заполнения!"
            }
        );
      }
      if (this.password && this.password.length < 6) {
        // this.messages.push({message: "Пароль не должен быть короче 6 символов!"});
        this.messages.push(
            {
              type: "error",
              text: "Пароль не должен быть короче 6 символов!"
            }
        );
      }
      if (this.password && this.confirm_password && (this.password !== this.confirm_password)) {
        // this.messages.push({message: "Пароли не совпадают!"});
        this.messages.push(
            {
              type: "error",
              text: "Пароли не совпадают!"
            }
        );
      }
      if (this.username && !right_username.test(this.username)) {
        // this.messages.push({message: "Никнейм должен состоять только из латинских букв, цифр, символов подчеркивания длиной 3-16 символов!"});
        this.messages.push(
            {
              type: "error",
              text: "Никнейм должен состоять только из латинских букв, цифр, символов подчеркивания длиной 3-16 символов!"
            }
        );
      }
      if (this.password && !right_password.test(this.password)) {
        // this.messages.push({message: "Пароль  должен состоять только из латинских буквы и цифр, символов подчеркивания и тире!"});
        this.messages.push(
            {
              type: "error",
              text: "Пароль  должен состоять только из латинских буквы и цифр, символов подчеркивания и тире!"
            }
        );
      }
      if (this.messages.length === 0) {
        this.$http
            .post("register", {
              username: this.username,
              password: this.password,
              confirm_password: this.confirm_password
            })
            .then(res => {
              if (res.data.status === "success") {
                // this.flashMessage.success({
                //   message: res.data.message,
                //   time: 7000,
                // });
                // this.$router.push('/login/');
                console.log(res.data.message)
                this.$router.push(
                    {
                      name: 'login',
                      params: {
                        username: '',
                        messages: [
                          res.data.message
                        ]
                      }
                    }
                );
              } else {
                this.messages = res.data.messages;
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