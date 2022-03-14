<template>
  <div class="v-show-servers">
    <div class="content">
      <div class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">

        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">
            Мои сервера
          </h1>
          <h2 class="h6 font-w500 text-muted mb-0">
            Привет, <b>{{ USERNAME }}</b>.
            Это список твоих серверов
          </h2>
        </div>
        <div class="mt-3 mt-sm-0 ml-sm-3">
          <b-button variant="alt-primary" class="mr-1" to="/add-server" v-click-ripple>
            <i class="fa fa-plus-square opacity-50 mr-1"></i> Добавить сервер
          </b-button>
        </div>
      </div>
    </div>
    <!-- END Hero -->
    <div class="content">
      <b-col md="8" lg="6" xl="4">
        <div v-for="message in messages" :key="message.message">
          <b-alert v-if="message.type === 'error'" variant="warning"
                   show class="d-flex align-items-center justify-content-between">
            <div class="flex-00-auto">
              <i class="fa fa-fw fa-exclamation-circle"></i>
            </div>
            <div class="flex-fill mr-3">
              <p class="mb-0">{{message.text}}</p>
            </div>
          </b-alert>

          <b-alert v-else-if="message.type === 'success'" variant="success"
                   show class="d-flex align-items-center">
            <div class="flex-00-auto">
              <i class="fa fa-fw fa-check"></i>
            </div>
            <div class="flex-fill ml-3">
              <p class="mb-0">{{message.text}}</p>
            </div>
          </b-alert>
        </div>
      </b-col>
    </div>


    <!-- Page Content -->
    <div v-if="servers.length > 0" class="content">
      <base-block v-for="server in servers" :key="server.id" rounded :title=server.hostname header-bg content-full>
        <b-table-simple striped hover borderless class="table-vcenter font-size-sm mb-0">
          <b-thead>
            <b-tr>
              <b-th>Количество ядер</b-th>
              <b-th>Статус сервера</b-th>
              <b-th>Дата добавления</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <b-td>
                <b class="ml-3">{{ server.CPU_number }}</b>
              </b-td>
              <b-td class="col-2">
                <span v-if="server.status === `on`" class="font-w600" :class="`text-success`">online</span>
                <span v-else class="font-w600" :class="`text-danger`">offline</span>
              </b-td>
              <b-td class="d-none d-sm-table-cell">
                <b-badge variant="primary">{{ server.createdAt }}</b-badge>
              </b-td>
              <b-td class="text-center">
                <b-button :to="{ path: `/view-server/${server.id}/`}" size="sm" variant="light">
                  <i class="fa fa-fw fa-info-circle" ></i> Узнать больше
                </b-button>
              </b-td>
              <b-td>
                <b-button class="btn btn-outline-danger" @click="deleteServer(server.id)" size="sm" variant="light">
                  <i class="fa fa-fw fa-times me-1"></i> Удалить
                </b-button>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </base-block>
    </div>
    <div v-else class="content">
      Вы ещё не добавили ни одного сервера!
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "v-show-servers",

  computed: {
    ...mapGetters(['USERNAME', 'IS_LOGGED_IN']),
  },

  data() {
    return {
      messages: [],
      servers: []
    }
  },

  created() {
    console.log(this.$route.params.messages)
    if (this.$route.params.messages !== undefined) {
      this.messages = this.$route.params.messages;
    } else {
      this.messages = []
    }
  },

  methods: {
    ...mapActions(['SET_USERNAME', 'SET_USER_ID', 'SET_LOGGED_IN']),
    deleteServer(serverId) {
      this.$http
          .get(`delete-server/${serverId}`)
          .then(res => {
            if (!res.data.isLoggedIn) {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("username");
              localStorage.removeItem("id");
              this.SET_LOGGED_IN("out");
              this.SET_USERNAME("");
              this.SET_USER_ID(0);
              this.$router.push(
                  {
                    name: 'login',
                    params: {
                      messages: [
                        {
                          type: 'error',
                          text: res.data.message
                        }
                      ]
                    }
                  }
              );
            }
            else{
              if (res.data.status === "danger"){
                this.messages.push(
                    res.data.message
                );
              }
              else{
                this.messages.push(
                    {
                      type: 'success',
                      text: res.data.message
                    }
                );
                this.servers = this.servers.filter((item) => parseInt(item.id) !== parseInt(serverId));
              }
            }
          })
          .catch(err => console.error(err));
    },
  },

  mounted() {
    this.$http
        .get('show-servers')
        .then(res => {
          if (!res.data.isLoggedIn) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            localStorage.removeItem("id");
            this.SET_LOGGED_IN("out");
            this.SET_USERNAME("");
            this.SET_USER_ID(0);
            this.$router.push(
                {
                  name: 'login',
                  params: {
                    messages: [
                      {
                        type: 'error',
                        text: res.data.message
                      }
                    ]
                  }
                }
            )
          } else {
            this.servers = res.data.servers;
          }
        })
        .catch(err => console.error(err));
  }
}
</script>