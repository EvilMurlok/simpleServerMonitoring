<template>
  <div class="v-retrieve-project">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 mb-0">
            На этой странице можно посмотреть информацию о проекте и изменить её
          </p>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <b-row class="my-3 m-3" v-if="isAbleToDeleteProject === true">
        <b-col sm="8"></b-col>
        <b-col>
          <div class="d-flex justify-content-end">
            <b-button type="submit"
                      variant="alt-danger"
                      class="mr-1 mb-3"
                      @click="deleteProject"
            >
              <i class="si si-close mr-2"></i> Удалить проект
            </b-button>
          </div>
        </b-col>
      </b-row>
      <b-row class="my-3 m-3">
        <b-col sm="5">
          <base-block title="Информация о проекте"
                      rounded
                      header-bg
                      content-full
          >
            <BaseMessage
                v-for="item in messages_data.messages"
                :key="item.text"
                :message_data="{type: messages_data.type, item: item}"
            />

            <h6 class="mb-1">
              Время создания
            </h6>
            <h2 class="mb-3">
              <b-badge variant="primary">{{ new Date(project.created).toLocaleString() }}</b-badge>
            </h2>
            <b-form @submit.prevent="updateProject">
              <div>
                <div class="form-group mb-2">
                  <label class="form-check-label mb-2">Название проекта</label>
                  <b-form-input size="lg"
                                id="name"
                                name="name"
                                placeholder="Название проекта"
                                v-model="project.name"
                                :disabled="isAbleToUpdateProject !== true"
                  >
                  </b-form-input>
                </div>
              </div>
              <b-button type="submit"
                        variant="alt-info"
                        class="mt-3"
                        size="sm"
                        v-if="isAbleToUpdateProject === true"
              >
                <i class="si si-refresh mr-2"></i> Обновить данные
              </b-button>
            </b-form>
          </base-block>
        </b-col>
      </b-row>
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
        name: "",
        created: ""
      },
      isAbleToUpdateProject: false,
      isAbleToDeleteProject: false,
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
            this.project = res.data.projectInfo[0];
            this.isAbleToUpdateProject = res.data.projectInfo[1];
            this.isAbleToDeleteProject = res.data.projectInfo[2];
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    deleteProject() {
      console.log("QWE");
    },

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
                this.messages_data = {type: types[res.data.status], messages: res.data.messages};
              }
            }
          })
          .catch(err => console.error(err));
    }
  },
}
</script>