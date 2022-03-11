<template>
  <div class="v-register">
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

    <h2>Форма регистрации пользователя</h2>
    <form class="mb-3" @submit.prevent="register">
      <div class="mb-3">
        <label for="username" class="form-label">Ваш никнейм</label>
        <input type="text" v-model="username" class="form-control" id="username" placeholder="Никнейм" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input type="password" v-model="password" class="form-control" id="password" placeholder="Пароль" required>
      </div>
      <div class="mb-3">
        <label for="confirm_password" class="form-label">Повторите пароль</label>
        <input type="password" v-model="confirm_password" class="form-control" id="confirm_password"
               placeholder="Повторите пароль" required>
      </div>
      <button type="submit" class="btn">Зарегистрироваться</button>
    </form>
    <div>
      <span>Уже есть аккаунт? </span>
      <router-link class="router-link" :to="{ name: 'login'}">
        <span class="login">Войти!</span>
      </router-link>
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
        this.messages.push({message: "Поле никнейма обязательно для заполнения!"});
      }
      if (!this.password) {
        this.messages.push({message: "Поле пароля обязательно для заполнения!"});
      }
      if (!this.confirm_password) {
        this.messages.push({message: "Поле 'подтверждения пароля' обязательно для заполнения!"});
      }
      if (this.password && this.password.length < 6) {
        this.messages.push({message: "Пароль не должен быть короче 6 символов!"});
      }
      if (this.password && this.confirm_password && (this.password !== this.confirm_password)) {
        this.messages.push({message: "Пароли не совпадают!"});
      }
      if (this.username && !right_username.test(this.username)) {
        this.messages.push({message: "Никнейм должен состоять только из латинских букв, цифр, символов подчеркивания длиной 3-16 символов!"});
      }
      if (this.password && !right_password.test(this.password)) {
        this.messages.push({message: "Пароль  должен состоять только из латинских буквы и цифр, символов подчеркивания и тире!"});
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
                this.flashMessage.success({
                  message: res.data.message,
                  time: 7000,
                });
                this.$router.push('/login/');
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

<style>

.router-link {
  color: #2c3e50;
  text-decoration: none;
}

.router-link:hover {
  color: #2c3e50;
}

.login {
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