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
            <div class="form-group">
              <label class="form-check-label mb-2">Выберите все серверы, к которым хотите добавить данный тег</label>
              <b-form-checkbox-group
                  v-model="serverIds"
                  id="serverIds"
              >
                <b-form-checkbox v-for="server in servers"
                                 :key="server.serverId"
                                 :value="server.serverId"
                                 class="m-2"
                >
                  {{server.hostname}} (in <code>{{server.projectName}}</code>)
                </b-form-checkbox>
              </b-form-checkbox-group>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit"
                        variant="alt-success"
                        block
                        :disabled="!servers.length"
              >
                <i class="fa fa-plus mr-1" ></i> Добавить тег
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
  name: "v-create-tag",
  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      tag: '',
      serverIds: [],
      servers: [],
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    this.$http
        .get(`/server/retrieve-user-servers/`)
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
            if (res.data.userServers[0]) {
              for (let project of res.data.userServers[0].projects) {
                for (let server of project.servers) {
                  this.servers.push({
                    serverId: server.id,
                    hostname: server.hostname,
                    ip: server.ip,
                    projectName: project.name
                  });
                }
              }
            }
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
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
              serverIds: this.serverIds
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