<template>
  <div class="v-add-server">
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

    <h2 class="mb-3">Форма добавления сервера</h2>
    <form class="mb-3" @submit.prevent="addServer">
      <div class="mb-3">
        <label for="hostname" class="form-label">Наименование хоста</label>
        <input type="text" v-model="hostname" class="form-control" id="hostname">
      </div>
      <div class="mb-4">
        <label for="CPU_number" class="form-label">Количество процессорных ядер</label>
        <input type="text" v-model="CPU_number" class="form-control" id="CPU_number">
      </div>
      <button type="submit" class="btn">Добавить сервер</button>
    </form>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "v-add-server",

  data() {
    return {
      messages: [],
      hostname: '',
      CPU_number: ''
    }
  },

  methods: {
    ...mapActions(["SET_USERNAME", "SET_USER_ID", "SET_LOGGED_IN"]),
    addServer() {
      if (this.messages.length !== 0) {
        this.messages = [];
      }
      this.$http
          .post("add-server", {
            hostname: this.hostname,
            CPU_number: this.CPU_number
          })
          .then(res => {
            if (!res.data.isLoggedIn) {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("username");
              localStorage.removeItem("id");
              this.SET_LOGGED_IN("out");
              this.SET_USERNAME("");
              this.SET_USER_ID(0);
              this.flashMessage.error({
                message: res.data.message,
                time: 7000,
              });
              this.$router.push("/login/");
            } else {
              if (res.data.status === "danger") {
                this.messages = res.data.messages;
              } else {
                this.flashMessage.success({
                  message: res.data.message,
                  time: 7000,
                });
                this.$router.push("/show-servers/");
              }
            }
          })
          .catch(err => console.error(err));
    }
  }
}
</script>

<style>

</style>