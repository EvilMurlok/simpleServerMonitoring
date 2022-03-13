<template>
  <div class="v-server-item">
    <div class="content">
      <div class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">
            {{server.hostname}}
          </h1>
          <h2 class="h6 font-w500 text-muted mb-0">
            На этой странице можно посмотреть информацию о сервере и изменить её
          </h2>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <base-block title="Конфигурация" rounded header-bg content-full>

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

        <b-form @submit.prevent="updateServer">
          <div class="py-3">
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="hostname" name="hostname"
                            placeholder="Hostname" aria-describedby="hostname-feedback"
                            v-model="server.hostname">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="CPU_number" name="CPU_number"
                            placeholder="CPU cores" aria-describedby="CPU_number-feedback"
                            v-model="server.CPU_number">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="CPU_load" name="CPU_load"
                            placeholder="CPU load" aria-describedby="CPU_load-feedback"
                            v-model="server.CPU_load" disabled readonly>
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="memory_load" name="memory_load"
                            placeholder="Memory load" aria-describedby="memory_load-feedback"
                            v-model="server.memory_load" disabled readonly>
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="memory_usage" name="memory_usage"
                            placeholder="Memory usage" aria-describedby="memory_usage-feedback"
                            v-model="server.memory_usage" disabled readonly>
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="requests_amount" name="requests_amount"
                            placeholder="Requests amount" aria-describedby="requests_amount-feedback"
                            v-model="server.requests_amount" disabled readonly>
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="latency" name="latency"
                            placeholder="Latency" aria-describedby="latency-feedback"
                            v-model="server.latency" disabled readonly>
              </b-form-input>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit" variant="alt-warning" class="mr-1 mb-3">
                <i class="fa fa-fw fa-exclamation-triangle mr-1"></i> Обновить данные
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </base-block>
    </div>
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
              localStorage.setItem("loggedOutMessage",  res.data.message + " (вероятная причина: Ваша сессия устарела)");
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
        localStorage.setItem("loggedOutMessage",  res.data.message + " (вероятная причина: Ваша сессия устарела)");
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