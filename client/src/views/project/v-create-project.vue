<template>
  <div class="v-add-server">
    <!-- Hero -->
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">Добавить проект</h1>
          <h2 class="h6 font-w500 text-muted mb-0">На этой странице можно добавить свой новый проект</h2>
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

        <b-form @submit.prevent="createProject">
          <div class="py-3">
            <div class="form-group">
              <label class="form-check-label mb-2">Название проекта</label>
              <b-form-input size="lg"
                            class="form-control-alt"
                            id="projectName"
                            name="projectName"
                            placeholder="Имя поекта"
                            aria-describedby="name-feedback"
                            v-model="projectName">
              </b-form-input>
            </div>
          </div>
          <b-row class="form-group">
            <b-col md="6" xl="3">
              <b-button type="submit"
                        variant="alt-success"
                        block
              >
                <i class="fa fa-fw fa-plus mr-1"></i>
                Добавить проект
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
  name: "v-create-project",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      projectName: '',
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
  },

  methods: {
    createProject() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      // validation block
      let rightProjectName = /^[a-zA-Z0-9_-]{3,255}$/
      if (!this.projectName) {
        this.messages_data.messages.push(
            {
              text: "Поле имени проекта обязательно для заполнения!"
            }
        );
      }
      if (this.projectName && !rightProjectName.test(this.projectName)) {
        this.messages_data.messages.push(
            {
              text: "Имя проекта должно состоять только из латинских букв и цифр, символов подчеркивания и тире!"
            }
        );
      }
      // request block
      if (this.messages_data.messages.length === 0) {
        this.$http
            .post("/project/create-project/", {
              projectName: this.projectName,
            })
            .then(res => {
                  if (res.data.isLoggedIn === false) {
                    breakAuth.breakAuth(res);
                  } else {
                    if (res.data.status === "warning") {
                      this.messages_data = {type: res.data.status, messages: res.data.messages};
                    } else {
                      this.$router.push({
                        name: 'retrieveProjects',
                        params: {
                          messages_data: {type: "success", messages: res.data.messages}
                        }
                      });
                    }
                  }
                }
            )
            .catch(err => console.error(err));
      } else {
        this.name = '';
      }
    }
  }
}
</script>