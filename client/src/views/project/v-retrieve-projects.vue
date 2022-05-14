<template>
  <div class="v-retrieve-projects">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h2 font-w700 mb-2">
            Мои проекты
          </h1>
        </div>
        <div class="mt-3 mt-sm-0 ml-sm-3"
             v-if="checkDefault() === true"
        >
          <b-button variant="alt-info"
                    class="mr-1"
                    to="/create-project/"
                    v-click-ripple
          >
            <i class="fa fa-fw fa-plus mr-1"></i> Добавить проект
          </b-button>
        </div>
      </div>
    </div>
    <!-- END Hero -->
    <div class="content">
      <BaseMessage
          v-for="item in messages_data.messages"
          :key="item.text"
          :message_data="{type: messages_data.type, item: item}"
      />
    </div>


    <!-- Page Content -->
    <div v-if="userProjectsServers.length > 0"
         class="content"
    >

      <b-table-simple class="table-vcenter font-size-sm mb-0"
                      fixed
                      striped
                      hover
      >
        <b-thead head-variant="dark">
          <b-tr>
            <b-th class="col-3">
              <span style="cursor: pointer"
                    @click="sortField({sortedField: 'name'})"
              >
                Название проекта
                <i class="si si-arrow-up m-2"
                   v-if="sortData.sortTypeName === 'ASC'">
                </i>
                <i class="si si-arrow-down m-2"
                   v-else-if="sortData.sortTypeName === 'DESC'">
                </i>
              </span>
            </b-th>
            <b-th class="col-3">
              <span style="cursor: pointer"
                    @click="sortField({sortedField: 'created'})"
              >
                Время создания
                <i class="si si-arrow-up m-2"
                   v-if="sortData.sortTypeCreated === 'ASC'">
                </i>
                <i class="si si-arrow-down m-2"
                   v-else-if="sortData.sortTypeCreated === 'DESC'">
                </i>
              </span>
            </b-th>
            <b-th class="text-center col-6">Опции</b-th>
          </b-tr>
        </b-thead>
        <b-tbody v-for="(project, projectIndex) in userProjectsServers"
                 :key="project.id">
          <b-tr content-full
                rounded>
            <b-td>
              <b class="ml-3">{{ project.name }}</b>
            </b-td>
            <b-td class="d-none d-sm-table-cell">
              <b-badge variant="primary" class="ml-3">{{ new Date(project.created).toLocaleString() }}</b-badge>
            </b-td>
            <b-td class="text-center">
              <b-button size="sm"
                        @click="$router.push({path: `/create-permission/${project.id}/`});"
                        variant="alt-success"
                        class="mr-3"
              >
                <i class="fa fa-plus opacity-50 mr-1"></i> Право
              </b-button>
              <b-button @click="viewProject(project)"
                        size="sm"
                        variant="alt-info"
                        class="mr-3"
              >
                <i class="fa fa-fw fa-info-circle"></i>
              </b-button>
              <b-button @click="deleteProject(project)"
                        size="sm"
                        variant="alt-danger"
                        class="mr-3"
              >
                <i class="fa fa-trash mr-1"></i>
              </b-button>
              <b-button v-b-toggle="serversInProjects[projectIndex]"
                        variant="dark"
                        size="sm"
                        v-if="project.servers.length"
                        class="mr-3"
              >
                <i class="fa fa-fw fa-server"></i>
              </b-button>
              <b-button @click="createServer(project.name)"
                        variant="alt-success"
                        size="sm"
                        class="mr-3"
              >
                <i class="fa fa-plus opacity-50 mr-1"></i> Сервер
              </b-button>
            </b-td>
          </b-tr>
          <b-td colspan="3">
            <b-collapse v-for="(server, serverIndex) in project.servers"
                        :key="server.ip"
                        :id="serversInProjects[projectIndex][serverIndex]"
                        class="mt-2"
            >
              <b-card border-variant="light">
                <span class="d-flex justify-content-between">
                  <b-card-text>
                    Сервер <b>{{ server.hostname }}</b> принадлежит проекту <code>{{ project.name }}</code>
                  </b-card-text>
                  <span>
                    <b>Время создания:</b>&nbsp; &nbsp;
                    <b-badge variant="primary">{{ new Date(server.created).toLocaleString() }}</b-badge>
                  </span>
                  <b-button @click="retrieveServer(server.id, project.id)"
                            variant="alt-info"
                            size="sm"
                  >
                    <i class="fa fa-fw fa-info-circle m-1"></i>
                  </b-button>
                </span>
                <div class="d-flex flex-wrap" v-if="server.tags.length">
                  <span class="mr-3"><b>Теги сервера:</b></span>
                  <span v-for="tag in server.tags"
                        :key="tag.name"
                        class="m-1 p-2"
                        :style="{ 'cursor': 'pointer',
                                  'background-color': tag.color,
                                  'color': '#ffffff',
                                  'border-radius': '10px',
                                  'margin': '3px'
                        }"
                        @click="retrieveTag(tag.id)"
                  >
                    {{ tag.name }}
                  </span>
                </div>
              </b-card>
            </b-collapse>
          </b-td>

        </b-tbody>
        <b-tfoot class="">
          <b-button v-if="isLoadMore === true"
                    class="btn btn-outline-info mb-3"
                    @click="loadMore"
                    size="sm"
                    variant="alt-info"
          >
            <i class="fa fa-fw fa-plus mr-1"></i> Загрузить ещё
          </b-button>
        </b-tfoot>
      </b-table-simple>
    </div>
    <div v-else class="content">
      Вы ещё не добавили ни одного проекта!
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import breakAuth from "@/utils/authorization";
import checkDefault from "@/utils/checkPermissions/default";


export default {
  name: "v-retrieve-projects",

  components: {
    BaseMessage
  },

  data() {
    return {
      offset: 0,
      limit: 10,
      sortData: {
        sortChangeType: {"DESC": "ASC", "ASC": "DESC", "": "ASC"},
        sortedField: "created",
        sortTypeCreated: "DESC",
        sortTypeName: "",
        sortedLimit: this.limit
      },
      messages_data: {type: "warning", messages: []},
      userProjectsServers: [],
      serversInProjects: [],
      isLoadMore: true
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    this.$http
        .get(`/project/retrieve-user-projects-servers/${this.sortData.sortedField}/${this.sortData.sortTypeCreated}/${this.offset}/${this.limit}/`)
        .then(res => {
          this.userProjectsServers = res.data.userProjectsServers;
          for (let project of this.userProjectsServers) {
            this.serversInProjects.push(project.servers.map(server => server.hostname));
          }
          this.offset += res.data.userProjectsServers.length;
          if (res.data.projectCount === this.offset) {
            this.isLoadMore = false;
          }
        })
        .catch(err => console.error(err));

  },

  methods: {
    checkDefault() {
      return checkDefault.checkDefault();
    },

    viewProject(userProject) {
      this.$router.push({
        path: `/retrieve-project/${userProject.id}/`,
        query: {
          isAbleToUpdateProject: true
        }
      });
    },

    retrieveTag(tagId) {
      this.$router.push({
        name: 'retrieveTag',
        params: {
          tagId: tagId,
          isAbleToUpdateTag: true,
          isAbleToDeleteTag: true
        },
      });
    },

    retrieveServer(serverId, projectId) {
      this.$router.push({
        path: `/retrieve-server/${projectId}/${serverId}/`,
        params: {
          projectId: projectId,
          serverId: serverId
        }
      });
    },

    createServer(projectName) {
      this.$router.push({
        name: "createServer",
        params: {
          projectName
        }
      });
    },

    sortField({sortedField = "created"}) {
      let sortedType = "DESC";
      this.sortData.sortedField = sortedField;
      if (sortedField === "created") {
        sortedType = this.sortData.sortTypeCreated = this.sortData.sortChangeType[this.sortData.sortTypeCreated];
        this.sortData.sortTypeName = "";
      } else {
        sortedType = this.sortData.sortTypeName = this.sortData.sortChangeType[this.sortData.sortTypeName];
        this.sortData.sortTypeCreated = "";
      }
      if (this.isLoadMore) {
        this.sortData.sortedLimit = this.offset;
        this.offset = 0;
        this.$http
            .get(`/project/retrieve-user-projects-servers/${sortedField}/${sortedType}/${this.offset}/${this.sortData.sortedLimit}/`)
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.userProjectsServers = res.data.userProjectsServers;
                this.offset += res.data.userProjectsServers.length;
                if (res.data.projectCount === this.offset) {
                  this.isLoadMore = false;
                }
              }
            })
            .catch(err => console.error(err));
      } else {
        if (sortedType === "DESC") {
          this.userProjectsServers.sort((projectA, projectB) => {
            if (projectA[this.sortData.sortedField] > projectB[this.sortData.sortedField]) {
              return -1;
            }
            if (projectA[this.sortData.sortedField] < projectB[this.sortData.sortedField]) {
              return 1;
            }
            return 0;
          });
        } else {
          this.userProjectsServers.sort((projectA, projectB) => {
            if (projectA[this.sortData.sortedField] > projectB[this.sortData.sortedField]) {
              return 1;
            }
            if (projectA[this.sortData.sortedField] < projectB[this.sortData.sortedField]) {
              return -1;
            }
            return 0;
          });
        }
      }
      this.serversInProjects = [];
      for (let project of this.userProjectsServers) {
        this.serversInProjects.push(project.servers.map(server => server.hostname));
      }
    },

    loadMore() {
      const requiredSortType = this.sortData.sortTypeName || this.sortData.sortTypeCreated;
      this.$http
          .get(`/project/retrieve-user-projects-servers/${this.sortData.sortedField}/${requiredSortType}/${this.offset}/${this.limit}/`)
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth.breakAuth(res);
            } else {
              this.userProjectsServers = [...this.userProjectsServers, ...res.data.userProjectsServers];
              for (let project of res.data.userProjectsServers) {
                this.serversInProjects.push(project.servers.map(server => server.hostname));
              }
              this.offset += res.data.userProjectsServers.length;
              if (res.data.projectCount === this.offset) {
                this.isLoadMore = false;
              }
            }
          })
          .catch(err => console.error(err));
    },

    deleteProject(project) {
     console.log(project);
    }
  }
}

</script>