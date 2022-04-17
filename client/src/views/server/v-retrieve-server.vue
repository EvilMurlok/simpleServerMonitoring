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
              <label class="form-check-label mb-2">Название сервера</label>
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
              <label class="form-check-label mb-2">IP адрес</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="ip"
                            name="ip"
                            placeholder="ip"
                            aria-describedby="ip-feedback"
                            v-model="server.ip">
              </b-form-input>
            </div>
            <b-form-checkbox-group
                v-model="checkBoxesData.tagIds"
                id="tagIds"
            >
              <div class="m-1 d-flex justify-content-between">
                <label class="form-check-label mb-2">Теги сервера</label>
                <b-button variant="alt-info"
                          class="mr-1"
                          @click="chooseAll"
                          v-if="!checkBoxesData.isChosenAll"
                >
                  <i class="si si-check opacity-50 mr-1"></i> Выбрать все
                </b-button>
                <b-button variant="alt-info"
                          class="mr-1"
                          @click="chooseAll"
                          v-else
                >
                  <i class="si si-close opacity-50 mr-1"></i> Убрать все
                </b-button>
              </div>

              <div class="d-flex flex-wrap">
                <b-form-checkbox v-for="tag in allTags"
                                 :key="tag.name"
                                 :value="tag.id"
                                 class="m-4"
                >
                  <span class="p-1"
                        :style="{ 'background-color': tag.color,
                                  'color': '#ffffff',
                                  'border-radius': '10px',
                                  'margin': '3px'
                        }"
                  >
                  {{ tag.name }}
                </span>
                </b-form-checkbox>
              </div>
            </b-form-checkbox-group>
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
            </div>
            <div class="form-group">
              <label class="form-check-label mb-2">Чтобы изменить принадлежность сервера проекту, выберите новый
                проект снизу</label>
              <b-form-select size="lg"
                             v-model="newProjectName"
                             :options="projects"
              ></b-form-select>
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
import breakAuth from "@/utils/authorization";

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
      checkBoxesData: {
        tagIds: [],
        isChosenAll: false,
      },
      allTags: [],
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
                .get(`/server/retrieve-server/${this.$route.params.projectId}/${this.$route.params.serverId}/`)
                .then(res => {
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
                    this.checkBoxesData.tagIds = res.data.projectServer.servers[0].tags.map(tag => tag.id);
                    this.$http
                        .get("/tag/retrieve-all-tags/")
                        .then(res => {
                          this.allTags = res.data.tags.sort(function (lhs, rhs) {
                            if (lhs.name > rhs.name) {
                              return 1;
                            } else if (lhs.name < rhs.name) {
                              return -1;
                            } else {
                              return 0
                            }
                          });
                        })
                        .catch(err => console.error(err));
                  }
                })
                .catch(err => console.error(err));
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    chooseAll() {
      if (this.checkBoxesData.isChosenAll) {
        this.checkBoxesData.tagIds = [];
      } else {
        for (let tag of this.allTags) {
          this.checkBoxesData.tagIds.push(tag.id);
        }
      }
      this.checkBoxesData.isChosenAll = !this.checkBoxesData.isChosenAll;
    },

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
            newProjectName: this.newProjectName,
            tagIds: this.checkBoxesData.tagIds
          })
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth.breakAuth(res);
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