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

    <div class="content mb-2 mt-3">
      <BaseMessage
          v-for="item in messages_data.messages"
          :key="item.text"
          :message_data="{type: messages_data.type, item: item}"
      />

      <b-form @submit.prevent="filterServers">
        <b-row class="my-3 m-3">
          <b-col sm="1">
            <label class="form-check-label">Название хоста</label>
          </b-col>
          <b-col sm="2" class="mr-3">
            <b-form-input id="filterHostname"
                          name="filterHostname"
                          placeholder="Имя хоста"
                          aria-describedby="filterHostname-feedback"
                          type="text"
                          v-model="filterData.filterHostname"
            >
            </b-form-input>
          </b-col>
          <b-col sm="1">
            <label class="form-check-label">Назваение проекта</label>
          </b-col>
          <b-col sm="1" class="mr-3">
            <b-form-input id="filterProjectName"
                          name="filterProjectName"
                          placeholder="Имя проекта"
                          aria-describedby="filterProjectName-feedback"
                          type="text"
                          v-model="filterData.filterProjectName"
            >
            </b-form-input>
          </b-col>
          <b-col sm="1">
            <label class="form-check-label">IP сервера</label>
          </b-col>
          <b-col sm="2" class="mr-3">
            <b-form-input id="filterIP"
                          name="filterIP"
                          placeholder="IP"
                          aria-describedby="filterIP-feedback"
                          type="text"
                          v-model="filterData.filterIp"
            >
            </b-form-input>
          </b-col>
          <b-col sm="1">
            <label class="form-check-label">Тег</label>
          </b-col>
          <b-col sm="2" class="mr-3">
            <b-form-input id="filterTag"
                          name="filterTag"
                          placeholder="Tag"
                          aria-describedby="filterTag-feedback"
                          type="text"
                          v-model="filterData.filterTag"
            >
            </b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1 m-3">
          <b-col sm="2">
            <label class="form-check-label">Дата создания (min)</label>
          </b-col>
          <b-col sm="3 mr-3">
            <b-form-input id="filterMinCreationDate"
                          name="filterMinCreationDate"
                          aria-describedby="filterMinCreationDate-feedback"
                          type="date"
                          v-model="filterData.filterMinCreationDate"
            >
            </b-form-input>
          </b-col>
          <b-col sm="3">
            <label class="form-check-label">Время создания (min)</label>
          </b-col>
          <b-col sm="2 mr-3">
            <b-form-input id="filterMinCreationTime"
                          name="filterMinCreationTime"
                          aria-describedby="filterMinCreationTime-feedback"
                          type="time"
                          v-model="filterData.filterMinCreationTime"
            >
            </b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1 m-3">
          <b-col sm="2">
            <label class="form-check-label">Дата создания (max)</label>
          </b-col>
          <b-col sm="3 mr-3">
            <b-form-input id="filterMaxCreationDate"
                          name="filterMaxCreationDate"
                          aria-describedby="filterMaxCreationDate-feedback"
                          type="date"
                          v-model="filterData.filterMaxCreationDate"
            >
            </b-form-input>
          </b-col>
          <b-col sm="3">
            <label class="form-check-label">Время создания (max)</label>
          </b-col>
          <b-col sm="2 mr-3">
            <b-form-input id="filterMaxCreationTime"
                          name="filterMaxCreationTime"
                          aria-describedby="filterMaxCreationTime-feedback"
                          type="time"
                          v-model="filterData.filterMaxCreationTime"
            >
            </b-form-input>
          </b-col>
        </b-row>
        <div class="d-flex justify-content-end">
          <b-button type="submit"
                    variant="alt-info"
                    size="sm"
          >
            <i class="fa fa-info-circle m-1"></i> Показать сервера
          </b-button>
        </div>
      </b-form>
    </div>

    <div v-if="userServersAll.length > 0"
         class="content"
    >
      <b-table-simple class="table-vcenter font-size-sm mb-3"
                      fixed
                      striped
                      hover
                      sticky-header="100%"
      >
        <b-thead head-variant="dark">
          <b-tr>
            <b-th>
              <span class="ml-5"
                    style="cursor: pointer"
                    @click="sortField({sortedField: 'hostname'})"
              >
                Хост
                <i class="si si-arrow-up m-2"
                   v-if="sortData.sortTypeHostname === 'ASC'">
                </i>
                <i class="si si-arrow-down m-2"
                   v-else-if="sortData.sortTypeHostname === 'DESC'">
                </i>
              </span>
            </b-th>
            <b-th>
              <span class="ml-5"
                    style="cursor: pointer"
                    @click="sortField({sortedField: 'ip'})"
              >
                IP
                <i class="si si-arrow-up m-2"
                   v-if="sortData.sortTypeIp === 'ASC'">
                </i>
                <i class="si si-arrow-down m-2"
                   v-else-if="sortData.sortTypeIp === 'DESC'">
                </i>
              </span>
            </b-th>
            <b-th>
              <span class="ml-2"
                    style="cursor: pointer"
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
            <b-th>
              <span class="ml-4"
                    style="cursor: pointer"
                    @click="sortField({sortedField: 'projectName'})"
              >
                Проект
                <i class="si si-arrow-up m-2"
                   v-if="sortData.sortTypeName === 'ASC'">
                </i>
                <i class="si si-arrow-down m-2"
                   v-else-if="sortData.sortTypeName === 'DESC'">
                </i>
              </span>
            </b-th>
            <b-th>
              <span class="ml-5">Теги</span>
            </b-th>
            <b-th class="text-center">Опции</b-th>
          </b-tr>
        </b-thead>
        <b-tbody v-for="server in userServersPart"
                 :key="server.id">
          <b-tr content-full
                rounded>
            <b-td>
              <b class="ml-3">{{ server.hostname }}</b>
            </b-td>
            <b-td>
              <b class="ml-3">{{ server.ip }}</b>
            </b-td>
            <b-td class="d-none d-sm-table-cell">
              <b-badge variant="primary" class="ml-3">{{ new Date(server.created).toLocaleString() }}</b-badge>
            </b-td>
            <b-td>
              <b class="ml-3">{{ server.projectName }}</b>
            </b-td>
            <b-td>
              <div class="d-flex flex-wrap ">
                <span v-for="tag in server.tags"
                      :key="tag.name"
                      class="p-1"
                      :style="{ 'cursor': 'pointer',
                                'background-color': tag.color,
                                'color': '#ffffff',
                                'border-radius': '10px',
                                'margin': '1px'
                      }"
                      @click="retrieveTag(tag.id)"
                >
                  {{ tag.name }}
                </span>
              </div>
            </b-td>
            <b-td class="text-right">
              <b-button @click="retrieveServer(server.serverId, server.projectId)"
                        size="sm"
                        variant="alt-info"
                        class="mr-3"
              >
                <i class="fa fa-fw fa-info-circle"></i>
              </b-button>
              <b-button @click="deleteServer(server.serverId, server.projectId)"
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
    <div v-else class="content">По данному фильтру не найдено ни одного сервера!</div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import breakAuth from "@/utils/authorization";

export default {
  name: "v-show-servers",

  components: {
    BaseMessage
  },

  data() {
    return {
      sortData: {
        sortComparator: {"DESC>": -1, "DESC<": 1, "ASC>": 1, "ASC<": -1},
        sortChangeType: {"DESC": "ASC", "ASC": "DESC", "": "ASC"},
        sortedField: "name",
        sortTypeCreated: "",
        sortTypeHostname: "",
        sortTypeIp: "",
        sortTypeName: "DESC",
      },
      filterData: {
        filterMinCreationDate: "",
        filterMaxCreationDate: "",
        filterMinCreationTime: "",
        filterMaxCreationTime: "",
        filterProjectName: "",
        filterIp: "",
        filterHostname: "",
        filterTag: "",
      },
      messages_data: {type: "warning", messages: []},
      userServersAll: [],
      userServersPart: [],
      pagination: {
        dropdownVariants: [
          {text: "Показать 5", limit: 5},
          {text: "Показать 10", limit: 10},
          {text: "Показать 20", limit: 20},
          {text: "Показать 30", limit: 30},
          {text: "Показать все", limit: 0}
        ],
        pagesNumbers: [],
        currentPage: 1,
        startPageServerIndex: 0,
        chosenVariant: "Показать 10",
        limit: 10,
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
        .get(`/server/retrieve-filtered-user-servers/`, {
          params: {
            name: (this.$route.query.name === undefined || this.$route.query.name === "all") ? "%" : this.$route.query.name,
            ip: (this.$route.query.ip === undefined || this.$route.query.ip === "all") ? "%" : this.$route.query.ip,
            hostname: (this.$route.query.hostname === undefined || this.$route.query.hostname === "all") ? "%" : this.$route.query.hostname,
            tag: (this.$route.query.tag === undefined || this.$route.query.tag === "all") ? "%" : this.$route.query.tag,
            createdMin: this.$route.query.createdMin || "1970-01-01T00:00:00.000Z",
            createdMax: this.$route.query.createdMax || new Date(new Date().setHours(new Date().getHours() + 3)).toISOString()
          }
        })
        .then(res => {
          if (res.data.isLoggedIn === false) {
            breakAuth.breakAuth(res);
          } else {
            let [currentMinDateTime, currentMaxDateTime] = ["", ""];
            if (this.$route.query.createdMin) {
              const temp = new Date(this.$route.query.createdMin);
              currentMinDateTime = new Date(temp.setHours(temp.getHours() + 3)).toISOString();
            } else {
              currentMinDateTime = "1970-01-01T00:00:00.000Z";
            }

            if (this.$route.query.createdMax) {
              const temp = new Date(this.$route.query.createdMax);
              currentMaxDateTime = new Date(temp.setHours(temp.getHours() + 3)).toISOString();
            } else {
              currentMaxDateTime = new Date(new Date().setHours(new Date().getHours() + 3)).toISOString();
            }
            this.filterData.filterProjectName = this.$route.query.name || "all";
            this.filterData.filterHostname = this.$route.query.hostname || "all";
            this.filterData.filterIp = this.$route.query.ip || "all";
            this.filterData.filterTag = this.$route.query.tag || "all";
            this.filterData.filterMinCreationDate = currentMinDateTime.slice(0, 10);
            this.filterData.filterMinCreationTime = currentMinDateTime.slice(11, 16);
            this.filterData.filterMaxCreationDate = currentMaxDateTime.slice(0, 10);
            this.filterData.filterMaxCreationTime = currentMaxDateTime.slice(11, 16);
            if (res.data.userServers[0]) {
              for (let project of res.data.userServers[0].projects) {
                for (let server of project.servers) {
                  this.userServersAll.push({
                    serverId: server.id,
                    projectId: project.id,
                    created: server.created,
                    hostname: server.hostname,
                    ip: server.ip,
                    projectName: project.name,
                    tags: server.tags.sort((lhs, rhs) => {
                      if (lhs.name > rhs.name) {
                        return 1;
                      } else if (lhs.name < rhs.name) {
                        return -1;
                      } else {
                        return 0;
                      }
                    })
                  });
                }
              }
              this.pagination.dropdownVariants[this.pagination.dropdownVariants.length - 1].limit = this.userServersAll.length;
              if (this.userServersAll.length <= this.pagination.limit) {
                this.pagination.pagesNumbers = [1,];
                this.pagination.isShowMore = false;
              } else {
                if (this.userServersAll.length % this.pagination.limit) {
                  for (let i = 1; i <= (this.userServersAll.length / this.pagination.limit >> 0) + 1; ++i) {
                    this.pagination.pagesNumbers.push(i);
                  }
                } else {
                  for (let i = 1; i <= (this.userServersAll.length / this.pagination.limit >> 0); ++i) {
                    this.pagination.pagesNumbers.push(i);
                  }
                }
              }
              this.showCurrentPage(1);
            }
          }
        })
        .catch(err => console.error(err));
  },

  methods: {
    retrieveServer(serverId, projectId) {
      this.$router.push({
        name: 'retrieveServer',
        params: {
          serverId: serverId,
          projectId: projectId,
        }
      });
    },

    retrieveTag(tagId) {
      this.$router.push({
        name: 'retrieveTag',
        params: {
          tagId: tagId,
        }
      });
    },

    deleteServer(serverId, projectId) {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      console.log(serverId, projectId);
    },

    changePagination(dropdownVariant) {
      this.pagination.isShowedMore = false;
      this.pagination.chosenVariant = dropdownVariant.text;
      this.pagination.limit = dropdownVariant.limit;
      this.pagination.pagesNumbers = [];
      if (this.userServersAll.length <= this.pagination.limit) {
        this.pagination.pagesNumbers = [1,];
        this.pagination.isShowMore = false;
      } else {
        this.pagination.isShowMore = true;
        if (this.userServersAll.length % this.pagination.limit) {
          for (let i = 1; i <= (this.userServersAll.length / this.pagination.limit >> 0) + 1; ++i) {
            this.pagination.pagesNumbers.push(i);
          }
        } else {
          for (let i = 1; i <= (this.userServersAll.length / this.pagination.limit >> 0); ++i) {
            this.pagination.pagesNumbers.push(i);
          }
        }
      }
      this.showCurrentPage(1);
    },

    showMore(isStart) {
      this.pagination.isShowedMore = true;
      if (isStart) {
        this.userServersPart = [];
      }
      this.userServersPart = [...this.userServersPart, ...(this.userServersAll.slice(this.pagination.offset, this.pagination.offset + this.pagination.limit))];
      this.pagination.offset += this.pagination.limit;
      if (this.pagination.offset >= this.userServersAll.length) {
        this.pagination.isShowMore = false;
        this.pagination.offset = this.userServersAll.length;
      } else {
        this.pagination.isShowMore = true;
      }
    },

    showCurrentPage(pageNumber) {
      this.pagination.isShowedMore = false;
      this.pagination.currentPage = pageNumber;
      this.pagination.startPageServerIndex = this.pagination.limit * (pageNumber - 1);
      const serverEndIndex = this.pagination.offset = this.pagination.startPageServerIndex + this.pagination.limit;
      this.userServersPart = this.userServersAll.slice(this.pagination.startPageServerIndex, serverEndIndex);
      this.pagination.isShowMore = pageNumber !== this.pagination.pagesNumbers[this.pagination.pagesNumbers.length - 1];
    },

    filterServers() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      const minDate = this.filterData.filterMinCreationDate || "1970-01-01";
      const maxDate = this.filterData.filterMaxCreationDate || new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 10);
      const minTime = this.filterData.filterMinCreationTime || "00:00";
      const maxTime = this.filterData.filterMaxCreationTime || new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(11, 16);
      let [
        minDateString,
        maxDateString
      ] = [
        new Date(minDate + "T" + minTime + ":00.000Z"),
        new Date(maxDate + "T" + maxTime + ":00.000Z"),
      ];
      minDateString = new Date(minDateString.setHours(minDateString.getHours() - 3));
      maxDateString = new Date(maxDateString.setHours(maxDateString.getHours() - 3));
      if (minDateString <= maxDateString) {
        minDateString = minDateString.toISOString();
        maxDateString = maxDateString.toISOString();
        this.$router.push({
          name: "retrieveServers",
          query: {
            name: this.filterData.filterProjectName || "all",
            hostname: this.filterData.filterHostname || "all",
            ip: this.filterData.filterIp || "all",
            tag: this.filterData.filterTag || "all",
            createdMin: minDateString,
            createdMax: maxDateString
          }
        });
      } else {
        this.messages_data.messages.push({
          text: "Минимальная дата не может быть меньше максимальной!"
        });
      }
    },

    sortField({sortedField = "name"}) {
      let sortedType = "DESC";
      this.sortData.sortedField = sortedField;
      if (sortedField === "created") {
        sortedType = this.sortData.sortTypeCreated = this.sortData.sortChangeType[this.sortData.sortTypeCreated];
        [this.sortData.sortTypeName, this.sortData.sortTypeIp, this.sortData.sortTypeHostname] = ["", "", ""];
      } else if (sortedField === "hostname") {
        sortedType = this.sortData.sortTypeHostname = this.sortData.sortChangeType[this.sortData.sortTypeHostname];
        [this.sortData.sortTypeName, this.sortData.sortTypeCreated, this.sortData.sortTypeIp] = ["", "", ""];
      } else if (sortedField === "ip") {
        sortedType = this.sortData.sortTypeIp = this.sortData.sortChangeType[this.sortData.sortTypeIp];
        [this.sortData.sortTypeName, this.sortData.sortTypeCreated, this.sortData.sortTypeHostname] = ["", "", ""];
      } else {
        sortedType = this.sortData.sortTypeName = this.sortData.sortChangeType[this.sortData.sortTypeName];
        [this.sortData.sortTypeCreated, this.sortData.sortTypeIp, this.sortData.sortTypeHostname] = ["", "", ""];
      }

      this.userServersAll.sort((lhs, rhs) => {
        if (lhs[this.sortData.sortedField] > rhs[this.sortData.sortedField]) {
          return this.sortData.sortComparator[sortedType + ">"];
        }
        if (lhs[this.sortData.sortedField] < rhs[this.sortData.sortedField]) {
          return this.sortData.sortComparator[sortedType + "<"];
        }
        return 0;
      });

      if (this.pagination.isShowedMore) {
        this.userServersPart = this.userServersAll.slice(this.pagination.startPageServerIndex, this.pagination.offset);
      } else {
        this.showCurrentPage(this.pagination.currentPage);
      }
    },
  },
}
</script>