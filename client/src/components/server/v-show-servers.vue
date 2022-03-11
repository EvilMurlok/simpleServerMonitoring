<template>
  <div class="v-show-servers">
    <h2 class="mb-5">Список серверов пользователя {{ USERNAME }}</h2>
    <div
        v-for="server in servers"
        :key="server.hostname"
        class="card mb-5"
    >
      <div class="card-body">
        <div class="card-title d-flex justify-content-between mb-2">
          <h5 class="text-center">{{ server.hostname }}</h5>
          <div class="btn" style="background: #ff5f5f; color: white" @click="deleteServer(server.id)">Удалить сервер</div>
        </div>
        <div class="d-flex justify-content-between mb-5">
          <span>Количество ядер: {{ server.CPU_number }}</span>
          <span>Статус сервера:
           <span v-if="server.status === 'on'" class="text-success">{{ server.status }}</span>
           <span v-else class="text-danger">{{ server.status }}</span>
          </span>
        </div>
        <router-link class="router-link" :to="{ path: `/view-server/${server.id}/`}">
          <div class="btn">Узнать больше</div>
        </router-link>
      </div>
      <div class="card-footer text-muted">
        <span>Сервер добавлен: {{ server.createdAt }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
// import vServerItem from "./v-server-item";

export default {
  name: "v-show-servers",

  // components: {
  //   vServerItem,
  // },

  computed: {
    ...mapGetters(['USERNAME', 'IS_LOGGED_IN']),
  },

  data() {
    return {
      servers: []
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
              this.flashMessage.error({
                message: res.data.message,
                time: 7000,
              });
              this.$router.push("/login/");
            }
            else{
              if (res.data.status === "danger"){
                this.flashMessage.error({
                  message: res.data.message,
                  time: 7000,
                });
              }
              else{
                this.flashMessage.success({
                  message: res.data.message,
                  time: 7000,
                });
                this.servers = this.servers.filter((item) => parseInt(item.id) !== parseInt(serverId));
              }
            }
          })
          .catch(err => console.error(err));
    }
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
            this.flashMessage.error({
              message: res.data.message,
              time: 7000,
            });
            this.$router.push("/login/");
          } else {
            // console.log(res.data.servers);
            this.servers = res.data.servers;
          }
        })
        .catch(err => console.error(err));
  }
}
</script>

<style>
.router-link {
  color: #2c3e50;
  text-decoration: none;
}

.router-link:hover {
  color: #2c3e50;
}

.btn {
  padding: 8px 16px;
  background: antiquewhite;
  border: 0;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}

.btn:hover {
  background: #fddcbb;
}

.btn-delete {
  background: darkred;
}

</style>