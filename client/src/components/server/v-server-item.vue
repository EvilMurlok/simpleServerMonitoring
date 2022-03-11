<template>
  <div class="v-server-item">
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

    <h1>Сервер {{ server.hostname }}</h1>
    <form class="mb-3" @submit.prevent="updateServer">
      <div class="mb-3">
        <label for="hostname" class="form-label">Наименование хоста</label>
        <input type="text" v-model="server.hostname" class="form-control" id="hostname">
      </div>
      <div class="mb-3">
        <label for="CPU_number" class="form-label">Количество процессорных ядер</label>
        <input type="text" v-model="server.CPU_number" class="form-control" id="CPU_number">
      </div>
      <div class="mb-3">
        <label for="CPU_load" class="form-label">CPU load</label>
        <input type="text" v-model="server.CPU_load" class="form-control" id="CPU_load" disabled readonly>
      </div>
      <div class="mb-3">
        <label for="memory_load" class="form-label">Memory load</label>
        <input type="text" v-model="server.memory_load" class="form-control" id="memory_load" disabled readonly>
      </div>
      <div class="mb-3">
        <label for="memory_usage" class="form-label">Memory usage</label>
        <input type="text" v-model="server.memory_usage" class="form-control" id="memory_usage" disabled readonly>
      </div>
      <div class="mb-3">
        <label for="requests_amount" class="form-label">Amount of the requests</label>
        <input type="text" v-model="server.requests_amount" class="form-control" id="requests_amount" disabled readonly>
      </div>
      <div class="mb-3">
        <label for="latency" class="form-label">Latency</label>
        <input type="text" v-model="server.latency" class="form-control" id="latency" disabled readonly>
      </div>
      <button type="submit" class="btn">Обновить данные о сервере</button>
    </form>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "v-server-item",

  data() {
    return {
      messages: [],
      server: {
        hostname: "",
        CPU_number: 0,
        cpu_load: 0,
        memory_load: 0,
        memory_usage: 0.0,
        requests_amount: 0,
        latency: 0.0
      },
    }
  },

  methods: {
    ...mapActions(["SET_USERNAME", "SET_USER_ID", "SET_LOGGED_IN"]),
    updateServer() {
      if (this.messages.length !== 0) {
        this.messages = [];
      }
      this.$http.post(`update-server-post/${this.$route.params.serverId}`, {
        hostname: this.server.hostname,
        CPU_number: this.server.CPU_number
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
              if (res.data.status === "success") {
                this.flashMessage.success({
                  message: res.data.message,
                  time: 7000,
                });
                this.$router.push("/show-servers/");
              } else if (res.data.status === "no_server") {
                this.flashMessage.error({
                  message: res.data.message,
                  time: 7000,
                });
                this.$router.push("/show-servers/");
              }
              else if (res.data.status === "danger"){
                this.messages = res.data.messages;
              }
              else if (res.data.status === "info"){
                this.flashMessage.info({
                  message: res.data.message,
                  time: 7000,
                });
                this.$router.push("/show-servers/");
              }
            }
          })
          .catch(err => console.error(err));
    }
  },

  created() {
    this.$http.get(`view-server/${this.$route.params.serverId}`).then(res => {
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
          this.flashMessage.error({
            message: res.data.message,
            time: 7000,
          });
          this.$router.push("/show-servers/");
        } else {
          this.server = res.data.server;
        }
      }
    }).catch(err => console.error(err));
  },
}
</script>

<style>
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