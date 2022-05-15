<template>
  <div class="v-retrieve-server">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 mb-0">
            На этой странице можно посмотреть информацию о сервере и изменить её
          </p>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <b-row v-if="server.isAbleToDelete === true">
        <b-col sm="8"></b-col>
        <b-col sm="4">
          <div class="d-flex justify-content-end">
            <b-button type="submit"
                      variant="alt-danger"
                      class="mr-1 mb-3"
                      @click="deleteServer"
            >
              <i class="si si-close mr-2"></i> Удалить сервер
            </b-button>
          </div>
        </b-col>
      </b-row>
      <b-row class="my-3 m-3"
             v-if="server.isAbleToUpdate === true"
      >
        <b-col sm="1"></b-col>
        <b-col sm="10">
          <base-block title="Данные о сервере"
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
                  <label class="form-check-label mb-2">DNS сервера</label>
                  <b-form-input size="lg"
                                id="hostname"
                                name="hostname"
                                placeholder="Hostname"
                                v-model="server.hostname">
                  </b-form-input>
                </div>
                <div class="form-group">
                  <label class="form-check-label mb-2">IP адрес</label>
                  <b-form-input size="lg"
                                id="ip"
                                name="ip"
                                placeholder="ip"
                                v-model="server.ip">
                  </b-form-input>
                </div>
                <div class="form-group">
                  <label class="form-check-label mb-2">Время создания</label>
                  <h2 class="mb-3">
                    <b-badge variant="primary">{{ new Date(server.created).toLocaleString() }}</b-badge>
                  </h2>
                </div>
                <b-form-checkbox-group
                    v-model="checkBoxesData.tagIds"
                    id="tagIds"
                >
                  <div class="m-1 d-flex justify-content-between">
                    <label class="form-check-label mb-2">Теги сервера</label>
                    <p>Добавить тег данному серверу можно <code @click="addTagToServer(server.id)"
                                                                style="cursor: pointer">тут</code>
                    </p>
                    <b-button variant="alt-info"
                              class="mr-1"
                              @click="chooseAll"
                              v-if="!checkBoxesData.isChosenAll && allTags.length"
                    >
                      <i class="si si-check opacity-50 mr-1"></i> Выбрать все
                    </b-button>
                    <b-button variant="alt-info"
                              class="mr-1"
                              @click="chooseAll"
                              v-else-if="checkBoxesData.isChosenAll && allTags.length"
                    >
                      <i class="si si-close opacity-50 mr-1"></i> Убрать все
                    </b-button>
                  </div>

                  <div class="d-flex flex-wrap"
                       v-if="allTags.length"
                  >
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
                  <div v-else>
                    <p class="font-size-sm">
                      Команда не добавила ни одного тега.
                    </p>
                  </div>
                </b-form-checkbox-group>
                <div class="form-group">
                  <label class="form-check-label mb-2">Проект, к которому принадлежит сервер</label>
                  <b-form-input size="lg"
                                class="form-control-alt"
                                id="projectName"
                                name="projectName"
                                aria-describedby="projectName-feedback"
                                v-model="project.name"
                                disabled
                                readonly
                  >
                  </b-form-input>
                </div>
                <div class="form-group">
                  <label class="form-check-label mb-2">Чтобы изменить принадлежность сервера проекту, выберите новый
                    проект снизу
                  </label>
                  <b-form-select size="lg"
                                 v-model="newProjectName"
                                 :options="projects"
                  ></b-form-select>
                </div>
              </div>
              <b-button type="submit" variant="alt-info" class="mr-1 mb-3">
                <i class="si si-refresh mr-2"></i> Обновить данные
              </b-button>
            </b-form>
          </base-block>
        </b-col>
        <b-col sm="1"></b-col>
      </b-row>
      <b-row class="my-3 m-3"
             v-else
      >
        <b-col sm="3"></b-col>
        <b-col sm="6">
          <base-block title="Данные о сервере"
                      rounded
                      header-bg
                      content-full
          >
            <div class="form-group">
              <label class="form-check-label mb-2">DNS сервера</label>
              <b-form-input size="lg"
                            id="hostnameInfo"
                            name="hostnameInfo"
                            v-model="server.hostname"
                            disabled
                            readonly
              >
              </b-form-input>
            </div>
            <div class="form-group">
              <label class="form-check-label mb-2">IP адрес</label>
              <b-form-input size="lg"
                            id="ipInfo"
                            name="ipInfo"
                            v-model="server.ip"
                            disabled
                            readonly
              >
              </b-form-input>
            </div>
            <div class="form-group">
              <label class="form-check-label mb-2">Время создания</label>
              <h2 class="mb-3">
                <b-badge variant="primary">{{ new Date(server.created).toLocaleString() }}</b-badge>
              </h2>
            </div>
            <div class="form-group">
              <label class="form-check-label mb-2">Проект, к которому принадлежит сервер</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="projectName"
                            name="projectName"
                            aria-describedby="projectName-feedback"
                            v-model="project.name"
                            disabled
                            readonly
              >
              </b-form-input>
            </div>
            <div class="m-1"
                 v-if="allTags.length"
            >
              <label class="form-check-label mb-2">Теги сервера</label>
              <div class="d-flex flex-wrap">
                  <span v-for="tag in allTags"
                        :key="tag.name"
                        @click="retrieveTag(tag.id)"
                        class="mr-4 mb-2 p-2"
                        :style="{
                                  'cursor': 'pointer',
                                  'background-color': tag.color,
                                  'color': '#ffffff',
                                  'border-radius': '10px',
                                }"
                  >
                    {{ tag.name }}
                  </span>
              </div>
            </div>
          </base-block>
        </b-col>
        <b-col sm="3"></b-col>
      </b-row>
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
        created: ""
      },
      checkBoxesData: {
        tagIds: [],
        isChosenAll: false,
      },
      allTags: [],
      project: {
        id: 0,
        name: "",
      },
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
        .get(`/server/retrieve-server/${this.$route.params.serverId}/`)
        .then(res => {
          if (res.data.isLoggedIn === false) {
            breakAuth.breakAuth(res);
          } else {
            if (res.data.status === "warning") {
              this.$router.push({
                name: 'retrieveServers',
                params: {
                  messages_data: {type: res.data.status, messages: res.data.messages}
                }
              });
            } else {
              this.server = res.data.server;
              this.project = res.data.project;
              if (res.data.server.isAbleToUpdate) {
                this.checkBoxesData.tagIds = res.data.tagsIdsOfServer;
                for (let projectName of res.data.availableProjectsNames) {
                  this.projects.push({
                    value: projectName,
                    text: projectName
                  });
                }
                this.allTags = res.data.availableTags;
              } else {
                this.allTags = res.data.tagsOfServer;
              }
            }
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    addTagToServer(serverToAddId) {
      this.$router.push({
        name: "createTag",
        params: {
          serverToAddId
        }
      });
    },

    retrieveTag(tagId) {
      this.$router.push({
        name: 'retrieveTag',
        params: {
          tagId: tagId,
        }
      });
    },

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

    deleteServer() {
      console.log(this.server.id);
    },

    updateServer() {
      if (this.$route.params.messages_data !== undefined) {
        this.messages_data = this.$route.params.messages_data;
      } else {
        this.messages_data = {type: "warning", messages: []};
      }
      this.$http
          .post(`/server/update-server/${this.project.id}/${this.server.id}/`, {
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