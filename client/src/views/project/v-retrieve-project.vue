<template>
  <div class="v-retrieve-project">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h2 class="h6 font-w500 text-muted mb-0">
            На этой странице можно посмотреть информацию о проекте и изменить её
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

        <b-form @submit.prevent="updateProject">
          <div class="py-3">
            <div class="form-group">
              <label class="form-check-label mb-2">Название проекта</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="name"
                            name="name"
                            placeholder="Название проекта"
                            aria-describedby="name-feedback"
                            v-model="project.name"
              >
              </b-form-input>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit"
                        variant="alt-info"
                        class="mr-1 mb-3"
              >
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
  name: "v-retrieve-project",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      project: {
        id: 0,
        name: ""
      },
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    this.$http
        .get(`/project/retrieve-project/${this.$route.params.projectId}/`)
        .then(res => {
          if (res.data.status === "warning") {
            this.$router.push(
                {
                  name: "retrieveProjects",
                  params: {
                    messages_data: {type: res.data.status, messages: res.data.messages}
                  }
                });
          } else {
            this.project = res.data.project;
          }
        })
        .catch(err => console.error(err));
  },

  methods: {

    updateProject() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      this.$http
          .post(`/project/update-project/${this.$route.params.projectId}/`, {
            projectName: this.project.name,
          })
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth.breakAuth(res);
            } else {
              if (res.data.status === "warning") {
                this.messages_data.messages = res.data.messages;
              } else {
                const types = {"not found": "warning", "info": "info", "success": "success"};
                this.$router.push({
                  name: "retrieveProjects",
                  params: {
                    messages_data: {type: types[res.data.status], messages: res.data.messages}
                  }
                });
              }
            }
          })
          .catch(err => console.error(err));
    }
  },
}
</script>