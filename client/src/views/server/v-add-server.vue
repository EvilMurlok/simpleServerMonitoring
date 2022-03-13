<template>
  <div class="v-add-server">
    <!-- Hero -->
    <div class="content">
      <div class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">
            Добавить сервер
          </h1>
          <h2 class="h6 font-w500 text-muted mb-0">
            На этой странице можно добавить свой сервер
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

        <b-form @submit.prevent="addServer">
          <div class="py-3">
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="hostname" name="hostname"
                            placeholder="Имя хоста" aria-describedby="hostname-feedback"
                            v-model="hostname">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg" class="form-control-alt" id="CPU_number"
                            name="CPU_number" placeholder="Количество ядер" aria-describedby="CPU_number-feedback"
                            v-model="CPU_number">
              </b-form-input>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit" variant="alt-success" block>
                <i class="fa fa-fw fa-plus mr-1"></i> Добавить сервер
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
              localStorage.setItem("loggedOutMessage",  res.data.message + " (вероятная причина: Ваша сессия устарела)");
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