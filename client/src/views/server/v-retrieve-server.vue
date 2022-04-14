<template>
  <div class="v-retrieve-server">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h2 class="h6 font-w500 text-muted mb-0">
            На этой странице можно посмотреть информацию о сервере и изменить её
          </h2>
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

        <b-form @submit.prevent="updateServer">
          <div class="py-3">
            <div class="form-group">
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="hostname"
                            name="hostname"
                            placeholder="Hostname"
                            aria-describedby="hostname-feedback"
                            v-model="server.hostname">
              </b-form-input>
            </div>
            <div class="form-group">
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="ip"
                            name="ip"
                            placeholder="ip"
                            aria-describedby="ip-feedback"
                            v-model="server.ip">
              </b-form-input>
            </div>
            <div class="form-group">
              <label class="form-check-label mb-2">Проект, к которому принадлежит сервер</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="projectName"
                            name="projectName"
                            aria-describedby="projectName-feedback"
                            v-model="projectName"
                            disabled
                            readonly
              >
              </b-form-input>
              <div class="form-group">
                <label class="form-check-label mb-2">Чтобы изменить принадлежность сервера проекту, выберите новый
                  проект снизу</label>
                <b-form-select size="lg"
                               v-model="newProjectName"
                               :options="projects"
                ></b-form-select>
              </div>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit" variant="alt-info" class="mr-1 mb-3">
                <i class="si si-refresh mr-2"></i> Обновить данные
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
import {breakAuth} from "@/utils/authorization";

export default {
  name: "v-retrieve-server",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      server: {
        id: 0,
        hostname: "",
        ip: "",
      },
      projectName: "",
      newProjectName: "",
      projects: [{value: "Не выбрано", text: "Не выбрано"}],
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    this.$http
        .get("/project/retrieve-all-user-projects/")
        .then(res => {
          if (res.data.isLoggedIn === false) {
            breakAuth();
            this.$router.push({
              name: 'login',
              params: {
                messages_data: {type: res.data.status, messages: res.data.messages}
              }
            });
          } else {
            if (res.data.status === "warning") {
              this.$router.push({
                name: 'retrieveServers',
                params: {
                  messages_data: {type: res.data.status, messages: res.data.messages}
                }
              });
            } else {
              for (let project of res.data.userProjects) {
                this.projects.push({
                  value: project.name,
                  text: project.name
                });
              }
              this.$http
                  .get(`/server/view-server/${this.$route.params.projectId}/${this.$route.params.serverId}/`)
                  .then(res => {
                    if (res.data.isLoggedIn === false) {
                      breakAuth();
                      this.$router.push({
                        name: 'login',
                        params: {
                          messages_data: {type: res.data.status, messages: res.data.messages}
                        }
                      });
                    } else {
                      if (res.data.status === "warning") {
                        this.$router.push({
                          name: 'retrieveServers',
                          params: {
                            messages_data: {type: res.data.status, messages: res.data.messages}
                          }
                        });
                      } else {
                        this.server = res.data.projectServer.servers[0];
                        this.projectName = res.data.projectServer.name;
                      }
                    }
                  })
                  .catch(err => console.error(err));
            }
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    updateServer() {
      if (this.$route.params.messages_data !== undefined) {
        this.messages_data = this.$route.params.messages_data;
      } else {
        this.messages_data = {type: "warning", messages: []};
      }
      this.$http
          .post(`/server/update-server/${this.$route.params.projectId}/${this.$route.params.serverId}/`, {
            hostname: this.server.hostname,
            ip: this.server.ip,
            newProjectName: this.newProjectName
          })
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth();
              this.$router.push({
                name: 'login',
                params: {
                  messages_data: {type: res.data.status, messages: res.data.messages}
                }
              });
            } else {
              const types = {"not found": "warning", "info": "info", "success": "success", "warning": "warning"};
              this.messages_data = {type: types[res.data.status], messages: res.data.messages}
            }
          })
          .catch(err => console.error(err));
    }
  },
}
</script>