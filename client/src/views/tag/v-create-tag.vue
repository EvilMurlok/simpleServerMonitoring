<template>
  <div class="v-create-tag">
    <!-- Hero -->
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">Добавить тег</h1>
          <h2 class="h6 font-w500 text-muted mb-0">На этой странице можно добавить тег к серверам</h2>
        </div>

      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <base-block title="Создание тега"
                  rounded
                  header-bg
                  content-full
      >
        <BaseMessage
            v-for="item in messages_data.messages"
            :key="item.text"
            :message_data="{type: messages_data.type, item: item}"
        />

        <b-form @submit.prevent="filterTag">
          <b-row class="my-3 m-3">
            <b-col sm="2">
              <label class="form-check-label">Название хоста</label>
            </b-col>
            <b-col sm="3" class="mr-3">
              <b-form-input id="filterHostname"
                            name="filterHostname"
                            placeholder="Имя хоста"
                            aria-describedby="filterHostname-feedback"
                            type="text"
                            v-model="filterData.filterHostname"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2">
              <label class="form-check-label">Назваение проекта</label>
            </b-col>
            <b-col sm="3" class="mr-3">
              <b-form-input id="filterProjectName"
                            name="filterProjectName"
                            placeholder="Имя проекта"
                            aria-describedby="filterProjectName-feedback"
                            type="text"
                            v-model="filterData.filterProjectName"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <b-row class="my-3 m-3">
            <b-col sm="2">
              <label class="form-check-label">IP сервера</label>
            </b-col>
            <b-col sm="3" class="mr-3">
              <b-form-input id="filterIP"
                            name="filterIP"
                            placeholder="IP"
                            aria-describedby="filterIP-feedback"
                            type="text"
                            v-model="filterData.filterIp"
              >
              </b-form-input>
            </b-col>
            <b-col sm="2">
              <label class="form-check-label">Тег</label>
            </b-col>
            <b-col sm="3" class="mr-3">
              <b-form-input id="filterTag"
                            name="filterTag"
                            placeholder="Tag"
                            aria-describedby="filterTag-feedback"
                            type="text"
                            v-model="filterData.filterTag"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <div class="d-flex justify-content-end">
            <b-button type="submit"
                      variant="alt-info"
                      size="sm"
                      class="mt-3"
            >
              <i class="fa fa-info-circle m-1"></i> Показать доступные сервера
            </b-button>
          </div>
        </b-form>

        <b-form @submit.prevent="createTag">
          <div class="py-3">
            <div class="form-group">
              <label class="form-check-label mb-2">Наименование тега</label>
              <b-form-input size="lg"
                            id="tag"
                            name="tag"
                            placeholder="Имя тега"
                            v-model="tag"
              >
              </b-form-input>
            </div>
            <div class="form-group" v-if="projects.length">
              <div class="m-1 d-flex justify-content-between">
                <label class="form-check-label mb-2">Выберите все серверы, к которым хотите добавить данный тег</label>
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
              <div class="my-3 ml-5 mt-3"
                   v-for="project in projects"
                   :key="project.projectName"
              >
                <b-button @click="project.isShowServers = !project.isShowServers"
                          class="m-1 pr-5 pl-5"
                >
                  {{ project.projectName }}
                </b-button>
                <div class="mt-3">
                  <b-form-checkbox-group
                      v-model="checkBoxesData.serverIds"
                      id="serverIds"
                  >
                    <div class="d-flex flex-wrap">
                      <b-form-checkbox v-for="server in project.servers"
                                       :key="server.ip"
                                       :value="server.serverId"
                                       class="m-4"
                                       v-show="project.isShowServers"
                      >
                        {{ server.hostname }} <br> <code>{{ server.ip }}</code>
                      </b-form-checkbox>
                    </div>
                  </b-form-checkbox-group>
                </div>
              </div>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit"
                        variant="alt-success"
                        block
                        :disabled="!projects.length"
              >
                <i class="fa fa-plus mr-1"></i> Добавить тег
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
  name: "v-create-tag",
  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      tag: '',
      projects: [],
      checkBoxesData: {
        serverIds: [],
        isChosenAll: false,
      },
      filterData: {
        filterMinCreationDate: "",
        filterMaxCreationDate: "",
        filterMinCreationTime: "",
        filterMaxCreationTime: "",
        filterProjectName: "",
        filterIp: "",
        filterHostname: "",
        filterTag: "",
      },
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    if (this.$route.params.serverToAddId) {
      this.checkBoxesData.serverIds.push(this.$route.params.serverToAddId);
    }
    this.$http
        .get(`/server/retrieve-filtered-user-servers/`, {
          params: {
            name: (this.$route.query.name === undefined || !this.$route.query.name) ? "%" : this.$route.query.name,
            ip: (this.$route.query.ip === undefined || !this.$route.query.ip) ? "%" : this.$route.query.ip,
            hostname: (this.$route.query.hostname === undefined || !this.$route.query.hostname) ? "%" : this.$route.query.hostname,
            tag: (this.$route.query.tag === undefined || !this.$route.query.tag) ? "%" : this.$route.query.tag,
            createdMin: "1970-01-01T00:00:00.000Z",
            createdMax: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString()
          }
        })
        .then(res => {
          if (res.data.userServers[0]) {
            for (let project of res.data.userServers[0].projects) {
              const projectData = {projectName: project.name, isShowServers: false, servers: []};
              for (let server of project.servers) {
                projectData.servers.push({
                  serverId: server.id,
                  hostname: server.hostname,
                  ip: server.ip,
                });
              }
              this.projects.push(projectData);
            }
          } else {
            this.messages_data.messages.push({
              text: "У вас нет ни одного доступного проекта с серверами!"
            });
          }
          this.filterData.filterProjectName = this.$route.query.name || "";
          this.filterData.filterHostname = this.$route.query.hostname || "";
          this.filterData.filterIp = this.$route.query.ip || "";
          this.filterData.filterTag = this.$route.query.tag || "";
        })
        .catch(err => console.error(err));
  },

  methods: {
    chooseAll() {
      if (this.checkBoxesData.isChosenAll) {
        this.checkBoxesData.serverIds = [];
        for (let project of this.projects) {
          project.isShowServers = false;
        }
      } else {
        for (let project of this.projects) {
          for (let server of project.servers) {
            this.checkBoxesData.serverIds.push(server.serverId);
          }
          project.isShowServers = true;
        }
      }
      this.checkBoxesData.isChosenAll = !this.checkBoxesData.isChosenAll;
    },

    filterTag() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      this.$router.push({
        name: "createTag",
        query: {
          name: this.filterData.filterProjectName || "",
          hostname: this.filterData.filterHostname || "",
          ip: this.filterData.filterIp || "",
          tag: this.filterData.filterTag || "",
          createdMin: "1970-01-01T00:00:00.000Z",
          createdMax: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString()
        }
      });
    },

    createTag() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      const rightTagName = /^[a-zA-Z0-9_]{3,255}$/;
      if (!this.tag) {
        this.messages_data.messages.push({
          text: "Поле имени тега обязательно для заполнения!"
        });
      }
      if (this.tag && !rightTagName.test(this.tag)) {
        this.messages_data.messages.push({
          text: "Имя тега можеть содержать только латинские буквы, цифры и нижние подчеркивания!"
        });
      }
      if (this.messages_data.messages.length === 0) {
        this.$http
            .post("/tag/create-tag/", {
              tagName: this.tag,
              serverIds: this.checkBoxesData.serverIds
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
    },
  }
}
</script>