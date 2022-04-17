<template>
  <div class="v-create-server">
    <!-- Hero -->
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">Добавить сервер</h1>
          <h2 class="h6 font-w500 text-muted mb-0">На этой странице можно добавить свой сервер</h2>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <base-block title="Конфигурация"
                  rounded
                  header-bg
                  content-full
      >
        <BaseMessage
            v-for="item in messages_data.messages"
            :key="item.text"
            :message_data="{type: messages_data.type, item: item}"
        />
        <b-form @submit.prevent="createServer">
          <div class="py-3">
            <div class="form-group">
              <label class="form-check-label mb-2">Наименование сервера</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="hostname"
                            name="hostname"
                            placeholder="Имя хоста"
                            aria-describedby="hostname-feedback"
                            v-model="hostname"
              >
              </b-form-input>
            </div>
            <div class="form-group">
              <label class="form-check-label mb-2">IP сервера</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="ip"
                            name="ip"
                            placeholder="ip сервера"
                            aria-describedby="ip-feedback"
                            v-model="ip"
              >
              </b-form-input>
            </div>
            <div class="form-group">
              <label class="form-check-label mb-2">Проект</label>
              <b-form-select size="lg"
                             v-model="projectName"
                             :options="projects"
              ></b-form-select>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit"
                        variant="alt-success"
                        block
                        :disabled="!projects.length"
              >
                <i class="fa fa-plus mr-1"></i> Добавить сервер
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </base-block>
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import breakAuth from "@/utils/authorization";

export default {
  name: "v-add-server",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      projectName: '',
      hostname: '',
      ip: '',
      projects: [],
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    if (this.$route.params.projectName) {
      this.projectName = this.$route.params.projectName;
      this.projects.push({
        value: this.$route.params.projectName,
        text: this.$route.params.projectName
      })
    } else {
      this.$http
          .get("/project/retrieve-all-user-projects/")
          .then(res => {
            if (res.data.status === "warning") {
              this.$router.push({
                name: 'retrieveProjects',
                params: {
                  messages_data: {type: res.data.status, messages: res.data.messages}
                }
              });
            } else {
              if (res.data.userProjects.length === 0) {
                this.messages_data.messages.push({
                  text: "У вас нет ни одного доступного проекта!"
                });
              }
              for (let project of res.data.userProjects) {
                this.projects.push({
                  value: project.name,
                  text: project.name
                });
              }
            }
          })
          .catch(err => console.error(err));
    }
  },

  methods: {
    createServer() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      const [rightHostname, rightIp] = [
        /^[a-zA-Z0-9_]{3,255}$/,
        /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      ];
      if (!this.hostname) {
        this.messages_data.messages.push({
          text: "Поле имени хоста обязательно для заполнения!"
        });
      }
      if (!this.ip) {
        this.messages_data.messages.push({
          text: "Поле ip обязательно для заполнения!"
        });
      }
      if (!this.projectName) {
        this.messages_data.messages.push({
          text: "Выберите проект, к которому хотите добавить сервер!"
        });
      }
      if (this.hostname && !rightHostname.test(this.hostname)) {
        this.messages_data.messages.push({
          text: "Имя хоста должно состоять только из латинских букв, цифр, символов подчеркивания длиной 3-255 символов!"
        });
      }
      if (this.ip && !rightIp.test(this.ip)) {
        this.messages_data.messages.push({
          text: "Неверный формат ip-адреса!"
        });
      }
      if (this.messages_data.messages.length === 0) {
        this.$http
            .post("/server/create-server/", {
              hostname: this.hostname,
              ip: this.ip,
              projectName: this.projectName
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                if (res.data.status === "warning") {
                  this.messages_data.messages = res.data.messages;
                } else {
                  this.$router.push({
                    name: 'retrieveProjects',
                    params: {
                      messages_data: {type: res.data.status, messages: res.data.messages}
                    }
                  });
                }
              }
            })
            .catch(err => console.error(err));
      }
    }
  }
}
</script>