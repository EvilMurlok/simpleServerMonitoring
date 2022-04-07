<template>
  <div class="v-show-servers">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">Доступные Вам сервера на каждом проекте</h1>
        </div>
        <div class="mt-3 mt-sm-0 ml-sm-3">
          <b-button variant="alt-info" class="mr-1" to="/create-server/" v-click-ripple>
            <i class="fa fa-plus opacity-50 mr-1"></i> Добавить сервер
          </b-button>
        </div>
      </div>
    </div>
    <!-- END Hero -->
    <div v-if="userProjectsServers.some(project => project.servers.length !== 0)"
         class="content"
    >
      <BaseMessage
          v-for="item in messages_data.messages"
          :key="item.text"
          :message_data="{type: messages_data.type, item: item}"
      />
      <base-block v-for="(project, projectIndex) in userProjectsServers"
                  :key="project.id"
                  content-full
                  rounded
      >
        <b-table-simple class="table-vcenter font-size-sm mb-0"
                        striped
                        hover
                        borderless
        >
          <b-thead>
            <b-tr>
              <b-th>Название проекта</b-th>
              <b-th>Время создания</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <b-td>
                <b class="ml-3">{{ project.name }}</b>
              </b-td>
              <b-td class="d-none d-sm-table-cell">
                <b-badge variant="primary">{{ new Date(project.created).toLocaleString() }}</b-badge>
              </b-td>
              <b-td class="text-center">
                <b-button v-b-toggle="serversInProjects[projectIndex]"
                          variant="dark"
                >
                  <i class="fa fa-fw fa-server"></i> Серверы проекта
                </b-button>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <b-collapse v-for="(server, serverIndex) in project.servers"
                    :key="server.ip"
                    :id="serversInProjects[projectIndex][serverIndex]"
                    class="mt-2">
          <b-card border-variant="light">
            <div class="d-flex justify-content-between">
              <b-card-text>
                Сервер <b>{{ server.hostname }}</b> принадлежит проекту <code>{{ project.name }}</code>
              </b-card-text>
              <div>
                <b>Время создания:</b>&nbsp; &nbsp;
                <b-badge variant="primary">{{ new Date(server.created).toLocaleString()  }}</b-badge>
              </div>
              <b-button @click="retrieveServer(server.id, project.id)"
                        variant="alt-info"
                        size="sm"
              >
                <i class="fa fa-fw fa-info-circle"></i> Узнать больше
              </b-button>
            </div>
          </b-card>
        </b-collapse>
      </base-block>
      <b-button v-if="isLoadMore === true"
                class="btn btn-outline-info mb-3 mb-3"
                @click="loadMore"
                size="sm"
                variant="alt-info"
      >
        <i class="fa fa-fw fa-plus mr-1"></i> Загрузить ещё
      </b-button>
    </div>
    <div v-else class="content">В имеющиеся у Вас проекты пока что не добавлено ни одного сервера!</div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import {breakAuth} from "@/utils/authorization";

export default {
  name: "v-show-servers",

  components: {
    BaseMessage
  },

  data() {
    return {
      username: localStorage.getItem("username"),
      offset: 0,
      limit: 3,
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
        .get(`/project/retrieve-user-projects-servers/${this.offset}/${this.limit}/`)
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
            this.userProjectsServers = res.data.userProjectsServers;
            for (let project of this.userProjectsServers) {
              this.serversInProjects.push(project.servers.map(server => server.hostname));
            }
            this.offset += res.data.userProjectsServers.length;
            console.log(res.data.projectCount, this.offset)
            if (res.data.projectCount === this.offset) {
              this.isLoadMore = false;
            }
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    retrieveServer(serverId, projectId) {
      this.$router.push({
        path: `/retrieve-server/${projectId}/${serverId}/`,
        params: {
          projectId: projectId,
          serverId: serverId
        }
      });
    },

    loadMore() {
      this.$http
          .get(`/project/retrieve-user-projects-servers/${this.offset}/${this.limit}/`)
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
          .catch(err => console.error(err))
    }
  },
}
</script>