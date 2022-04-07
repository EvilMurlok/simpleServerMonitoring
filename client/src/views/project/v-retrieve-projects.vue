<template>
  <div class="v-retrieve-projects">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h3 font-w700 mb-2">
            Мои проекты
          </h1>
          <h2 class="h6 font-w500 text-muted mb-0">
            Приветствуем, <b>{{ username }}</b>. Список Ваших проектов
          </h2>
        </div>
        <div class="mt-3 mt-sm-0 ml-sm-3">
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
    <div v-if="userProjects.length > 0"
         class="content"
    >
      <base-block v-for="userProject in userProjects"
                  :key="userProject.id"
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
                <b class="ml-3">{{ userProject.name }}</b>
              </b-td>
              <b-td class="d-none d-sm-table-cell">

                <b-badge variant="primary">{{ new Date(userProject.created).toLocaleString() }}</b-badge>
              </b-td>
              <b-td class="text-center">
                <b-button @click="viewProject(userProject)"
                          size="sm"
                          variant="alt-info"
                          class="mr-3"
                >
                  <i class="fa fa-fw fa-info-circle"></i>
                </b-button>
                <b-button @click="deleteProject(userProject)"
                          size="sm"
                          variant="alt-danger"
                          class="mr-3"
                >
                  <i class="fa fa-trash mr-1"></i>
                </b-button>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
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
    <div v-else class="content">
      Вы ещё не добавили ни одного проекта!
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import {breakAuth} from "@/utils/authorization";

export default {
  name: "v-retrieve-projects",

  components: {
    BaseMessage
  },

  data() {
    return {
      username: localStorage.getItem("username") || "",
      offset: 0,
      limit: 3,
      messages_data: {type: "warning", messages: []},
      userProjects: [],
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
        .get(`/project/retrieve-user-projects/${this.offset}/${this.limit}/`)
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
            this.userProjects = res.data.userProjects.rows;
            this.offset += res.data.userProjects.rows.length;
            if (res.data.userProjects.count === this.offset) {
              this.isLoadMore = false;
            }
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    viewProject(userProject) {
      this.$router.push({
        path: `/retrieve-project/${userProject.id}/`,
        params: {
          projectId: userProject.id,
          name: userProject.name
        }
      });
    },

    loadMore() {
      this.$http
          .get(`/project/retrieve-user-projects/${this.offset}/${this.limit}`)
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth();
              this.$router.push(
                  {
                    name: 'login',
                    params: {
                      messages_data: {type: res.data.status, messages: res.data.messages}
                    }
                  }
              );
            } else {
              this.userProjects = [...this.userProjects, ...res.data.userProjects.rows];
              this.offset += res.data.userProjects.rows.length;
              if (res.data.userProjects.count === this.offset) {
                this.isLoadMore = false;
              }
            }
          })
          .catch(err => console.error(err));
    }
  },
}
</script>