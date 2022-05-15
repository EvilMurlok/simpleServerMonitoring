<template>
  <div class="v-retrieve-available-projects">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <h1 class="h2 font-w700 mb-2">
            Доступные проекты согласно правам
          </h1>
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
    <div v-if="userAvailableProjects.length > 0"
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
        <b-tbody v-for="project in userAvailableProjectsPart"
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
              <b-button v-if="project.isAbleToCreatePermission === true"
                        size="sm"
                        @click="$router.push({path: `/create-permission/${project.id}/`});"
                        variant="alt-success"
                        class="mr-3"
              >
                <i class="fa fa-plus opacity-50 mr-1"></i> Право
              </b-button>
              <b-button @click="viewProject(project.id)"
                        size="sm"
                        variant="alt-info"
                        class="mr-3"
              >
                <i class="fa fa-fw fa-info-circle"></i>
              </b-button>
              <b-button v-if="project.isAbleToDeleteProject === true"
                        @click="deleteProject(project.id)"
                        size="sm"
                        variant="alt-danger"
                        class="mr-3"
              >
                <i class="fa fa-trash mr-1"></i>
              </b-button>
              <b-button v-if="project.isAbleToCreateServer === true"
                        @click="createServer(project.name)"
                        variant="alt-success"
                        size="sm"
                        class="mr-3"
              >
                <i class="fa fa-plus opacity-50 mr-1"></i> Сервер
              </b-button>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <b-button v-if="pagination.isShowMore === true"
                class="btn btn-outline-info mt-3 mb-3"
                @click="showMore(false)"
                variant="alt-info"
                block
      >
        <i class="fa fa-fw fa-plus m-1"></i> Загрузить ещё
      </b-button>
      <div class="d-flex justify-content-between">
        <ul class="pagination mt-3">
          <li class="page-item"
              v-for="number in pagination.pagesNumbers"
              :key="number"
          >
            <a class="page-link" @click="showCurrentPage(number)">{{ number }}</a>
          </li>
        </ul>
        <div>
          <b-dropdown id="dropdown-1" :text="pagination.chosenVariant" class="m-md-2">
            <b-dropdown-item v-for="dropdownVariant in pagination.dropdownVariants"
                             :key="dropdownVariant.text"
                             @click="changePagination(dropdownVariant)"
            >
              {{ dropdownVariant.text }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>
    <div v-else class="content">
      Вам не доступно ни одного проекта!
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import breakAuth from "@/utils/authorization";

export default {
  name: "v-retrieve-available-projects",

  components: {
    BaseMessage
  },

  data() {
    return {
      sortData: {
        sortComparator: {"DESC>": -1, "DESC<": 1, "ASC>": 1, "ASC<": -1},
        sortChangeType: {"DESC": "ASC", "ASC": "DESC", "": "ASC"},
        sortedField: "created",
        sortTypeCreated: "DESC",
        sortTypeName: "",
      },

      userAvailableProjects: [],
      userAvailableProjectsPart: [],
      messages_data: {type: "warning", messages: []},

      pagination: {
        dropdownVariants: [
          {text: "Показать 3", limit: 3},
          {text: "Показать 10", limit: 10},
          {text: "Показать 20", limit: 20},
          {text: "Показать 30", limit: 30},
          {text: "Показать все", limit: 0}
        ],
        pagesNumbers: [],
        currentPage: 1,
        startPageProjectIndex: 0,
        chosenVariant: "Показать 3",
        limit: 3,
        offset: 0,
        isShowMore: true,
        isShowedMore: false
      }
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    this.$http
        .get("/project/retrieve-available-user-projects/")
        .then(res => {
          if (res.data.isLoggedIn === false) {
            breakAuth.breakAuth(res);
          } else {
            this.userAvailableProjects = res.data.userAvailableProjects;
            console.log(this.userAvailableProjects);
            this.pagination.dropdownVariants[this.pagination.dropdownVariants.length - 1].limit = this.userAvailableProjects.length;
            if (this.userAvailableProjects.length <= this.pagination.limit) {
              this.pagination.pagesNumbers = [1,];
              this.pagination.isShowMore = false;
            } else {
              if (this.userAvailableProjects.length % this.pagination.limit) {
                for (let i = 1; i <= (this.userAvailableProjects.length / this.pagination.limit >> 0) + 1; ++i) {
                  this.pagination.pagesNumbers.push(i);
                }
              } else {
                for (let i = 1; i <= (this.userAvailableProjects.length / this.pagination.limit >> 0); ++i) {
                  this.pagination.pagesNumbers.push(i);
                }
              }
            }
            this.showCurrentPage(1);
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    viewProject(userProjectId) {
      this.$router.push({
        path: `/retrieve-project/${userProjectId}/`,
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

    deleteProject(project) {
      console.log(project);
    },

    changePagination(dropdownVariant) {
      this.pagination.isShowedMore = false;
      this.pagination.chosenVariant = dropdownVariant.text;
      this.pagination.limit = dropdownVariant.limit;
      this.pagination.pagesNumbers = [];
      if (this.userAvailableProjects.length <= this.pagination.limit) {
        this.pagination.pagesNumbers = [1,];
        this.pagination.isShowMore = false;
      } else {
        this.pagination.isShowMore = true;
        if (this.userAvailableProjects.length % this.pagination.limit) {
          for (let i = 1; i <= (this.userAvailableProjects.length / this.pagination.limit >> 0) + 1; ++i) {
            this.pagination.pagesNumbers.push(i);
          }
        } else {
          for (let i = 1; i <= (this.userAvailableProjects.length / this.pagination.limit >> 0); ++i) {
            this.pagination.pagesNumbers.push(i);
          }
        }
      }
      this.showCurrentPage(1);
    },

    showMore(isStart) {
      this.pagination.isShowedMore = true;
      if (isStart) {
        this.userAvailableProjectsPart = [];
      }
      this.userAvailableProjectsPart = [...this.userAvailableProjectsPart, ...(this.userAvailableProjects.slice(this.pagination.offset, this.pagination.offset + this.pagination.limit))];
      this.pagination.offset += this.pagination.limit;
      if (this.pagination.offset >= this.userAvailableProjects.length) {
        this.pagination.isShowMore = false;
        this.pagination.offset = this.userAvailableProjects.length;
      } else {
        this.pagination.isShowMore = true;
      }
    },

    showCurrentPage(pageNumber) {
      this.pagination.isShowedMore = false;
      this.pagination.currentPage = pageNumber;
      this.pagination.startPageProjectIndex = this.pagination.limit * (pageNumber - 1);
      const projectEndIndex = this.pagination.offset = this.pagination.startPageProjectIndex + this.pagination.limit;
      this.userAvailableProjectsPart = this.userAvailableProjects.slice(this.pagination.startPageProjectIndex, projectEndIndex);
      this.pagination.isShowMore = pageNumber !== this.pagination.pagesNumbers[this.pagination.pagesNumbers.length - 1];
    },

    sortField({sortedField = "created"}) {
      this.sortData.sortedField = sortedField;
      let sortedType = "DESC";
      if (sortedField === "created") {
        sortedType = this.sortData.sortTypeCreated = this.sortData.sortChangeType[this.sortData.sortTypeCreated];
        this.sortData.sortTypeName = "";
      } else {
        sortedType = this.sortData.sortTypeName = this.sortData.sortChangeType[this.sortData.sortTypeName];
        this.sortData.sortTypeCreated = "";
      }

      this.userAvailableProjects.sort((lhs, rhs) => {
        if (lhs[this.sortData.sortedField] > rhs[this.sortData.sortedField]) {
          return this.sortData.sortComparator[sortedType + ">"];
        }
        if (lhs[this.sortData.sortedField] < rhs[this.sortData.sortedField]) {
          return this.sortData.sortComparator[sortedType + "<"];
        }
        return 0;
      });

      if (this.pagination.isShowedMore) {
        this.userAvailableProjectsPart = this.userAvailableProjects.slice(this.pagination.startPageProjectIndex, this.pagination.offset);
      } else {
        this.showCurrentPage(this.pagination.currentPage);
      }
    }
  }
}
</script>