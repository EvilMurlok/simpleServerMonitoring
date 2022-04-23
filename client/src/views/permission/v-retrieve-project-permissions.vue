<template>
  <div class="v-retrieve-permissions">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <div class="h2 font-w700 mb-2">
            Права, связанные с проектами, которые у Вас есть
          </div>
        </div>
      </div>
    </div>
    <div>
      <BaseMessage
          v-for="item in messages_data.messages"
          :key="item.text"
          :message_data="{type: messages_data.type, item: item}"
      />
    </div>

    <b-container class="mb-2 mt-3">
      <b-form @submit.prevent="filterPermissions">
        <b-row class="my-3 m-3">
          <b-col sm="2" class="mr-3">
            <label class="form-check-label mb-2">Название права</label>
            <b-form-input id="filterPermissionName"
                          name="filterPermissionName"
                          placeholder="Имя права"
                          aria-describedby="filterPermissionName-feedback"
                          type="text"
                          v-model="filterData.filterPermissionName"
            >
            </b-form-input>
          </b-col>
          <b-col sm="3">
            <label class="form-check-label mb-2">Назваение проекта</label>
            <b-form-input id="filterProjectName"
                          name="filterProjectName"
                          placeholder="Имя проекта"
                          aria-describedby="filterProjectName-feedback"
                          type="text"
                          v-model="filterData.filterProjectName"
            >
            </b-form-input>
          </b-col>
          <b-col sm="2" class="mr-3">
            <label class="form-check-label mb-2">Хост сервера</label>
            <b-form-input id="filterHostname"
                          name="filterHostname"
                          placeholder="Хост сервера"
                          aria-describedby="filterHostname-feedback"
                          type="text"
                          v-model="filterData.filterHostname"
            >
            </b-form-input>
          </b-col>
          <b-col sm="2" class="mr-3">
            <label class="form-check-label mb-2">IP сервера</label>
            <b-form-input id="filterIP"
                          name="filterIP"
                          placeholder="IP"
                          aria-describedby="filterIP-feedback"
                          type="text"
                          v-model="filterData.filterIp"
            >
            </b-form-input>
          </b-col>
          <b-col sm="2" class="mr-3">
            <label class="form-check-label mb-2">Тег</label>
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
          <b-col sm="3"></b-col>
          <b-col sm="4">
            <label class="form-check-label mb-1">Сущность</label>
            <b-form-checkbox-group
                v-model="checkBoxesData.entities"
                id="entities"
            >
              <div class="d-flex flex-wrap">
                <b-form-checkbox value="Server"
                                 class="mr-4"
                >
                  Server
                </b-form-checkbox>
                <b-form-checkbox value="Tag"
                                 class="mr-4"
                >
                  Tag
                </b-form-checkbox>
                <b-form-checkbox value="Dashboard"
                                 class="mr-4"
                >
                  Dashboard
                </b-form-checkbox>
                <b-form-checkbox value="Permission"
                                 class="mr-4"
                >
                  Permission
                </b-form-checkbox>
                <b-form-checkbox value="Project"
                                 class="mr-4"
                >
                  Project
                </b-form-checkbox>
              </div>
            </b-form-checkbox-group>
          </b-col>
          <b-col sm="3">
            <label class="form-check-label mb-1">Действие</label>
            <b-form-checkbox-group
                v-model="checkBoxesData.actions"
                id="actions"
            >
              <div class="d-flex flex-wrap">
                <b-form-checkbox value="Create"
                                 class="mr-4"
                >
                  Create
                </b-form-checkbox>
                <b-form-checkbox value="Retrieve"
                                 class="mr-4"
                >
                  Retrieve
                </b-form-checkbox>
                <b-form-checkbox value="Update"
                                 class="mr-4"
                >
                  Update
                </b-form-checkbox>
                <b-form-checkbox value="Delete"
                                 class="mr-4"
                >
                  Delete
                </b-form-checkbox>
              </div>
            </b-form-checkbox-group>
          </b-col>
          <b-col sm="2"></b-col>
        </b-row>
        <b-row class="my-1 mt-4">
          <b-col sm="8"></b-col>
          <b-col sm="4">
            <b-button type="submit"
                      variant="alt-info"
                      size="sm"
            >
              <i class="fa fa-info-circle m-1"></i> Показать права
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>

    <div v-if="userProjectsPermissions.length > 0"
         class="content"
    >
      <div v-for="(userProjectPermission, index) in userProjectsPermissions"
           :key="userProjectPermission.id"
      >
        <div class="mb-4"
             :style="{
                        'border': 'thin solid #283243',
                        'border-radius': '10px'
                     }"
        >
          <div v-b-toggle="`permission-${index}`"
               style="cursor: pointer"
          >
            <div class="d-flex justify-content-around m-2">
              <h5 class="m-2">
                Право: <span style="color: #4c78dd">{{ userProjectPermission.permissionName }}</span>
              </h5>
              <h5 class="m-2">
                Проект: <span style="color: #4c78dd">{{ userProjectPermission.projectName }}</span>
              </h5>
            </div>
          </div>
          <b-collapse :id="`permission-${index}`" visible>
            <b-table-simple class="table-vcenter font-size-sm"
                            fixed
                            striped
                            hover
                            sticky-header="100%"
            >
              <b-thead head-variant="dark">
                <b-tr>
                  <b-th class="text-left col-2">
                    <span class="ml-5">Сущность</span>
                  </b-th>
                  <b-th class="col-3">
                    <span class="ml-5">Действия</span>
                  </b-th>
                  <b-th class="col-8">
                    <span class="ml-4">Единицы сущностей</span>
                  </b-th>
                </b-tr>
              </b-thead>
              <b-tbody class="text-center"
                       v-for="entityWithAbility in userProjectPermission.entitiesWithAbilities"
                       :key="entityWithAbility.entity"
              >
                <b-tr content-full
                      rounded>
                  <b-td class="text-left">
                    <b class="ml-3">{{ entityWithAbility.entity }}</b>
                  </b-td>
                  <b-td>
                    <div class="d-flex flex-wrap">
                      <span v-for="entityAction in entityWithAbility.actions"
                            :key="entityAction"
                            class="p-1"
                            :style="{ 'background-color': colorActions[entityAction],
                                      'color': '#ffffff',
                                      'border-radius': '10px',
                                      'margin': '1px'
                            }"
                      >
                        <i class="fa fa-plus m-1"
                           v-if="entityAction === 'Create'"
                        ></i>
                        <i class="si si-refresh m-1"
                           v-else-if="entityAction === 'Update'"
                        ></i>
                        <i class="far fa-eye m-1"
                           v-else-if="entityAction === 'Retrieve'"
                        ></i>
                        <i class="si si-close m-1"
                           v-else-if="entityAction === 'Delete'"
                        ></i>
                      </span>
                    </div>
                  </b-td>
                  <b-td>
                    <div class="d-flex flex-wrap">
                      <div v-for="entityItem in entityWithAbility.items"
                           :key="entityItem.id"
                           class="m-1"
                      >
                        <div v-if="entityWithAbility.entity === 'Server'"
                             :style="{  'cursor': 'pointer',
                                    'border': 'thin solid #283243',
                                    'border-radius': '10px',
                                    'padding': '2px'
                                  }"
                             @click="retrieveServer(entityItem.id, userProjectPermission.projectId)"
                        >
                          <span>{{ entityItem.hostname }}<br>(<code>{{ entityItem.ip }}</code>)</span>
                        </div>
                        <span v-else-if="entityWithAbility.entity === 'Tag'"
                              class="p-1"
                              :style="{'cursor': 'pointer',
                                  'background-color': entityItem.color,
                                  'color': '#ffffff',
                                  'border-radius': '10px',
                                  'margin': '1px'
                                  }"
                              @click="retrieveTag(entityItem.id)"

                        >
                          {{ entityItem.name }}
                        </span>
                        <div v-else-if="entityWithAbility.entity === 'Project'"
                             :style="{'cursor': 'pointer',
                                    'border': 'thin solid #283243',
                                    'border-radius': '10px',
                                    'padding': '2px'
                                  }"
                             @click="retrieveProject(userProjectPermission.projectId)"
                        >
                          <span><code>{{ userProjectPermission.projectName }}</code></span>
                        </div>
                      </div>
                    </div>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            <h6 class="text-left m-2">Право доступно следующим членам команды</h6>
            <div class="d-flex flex-wrap">
              <div v-for="user in userProjectPermission.permissionUsers"
                   :key="user.username"
                   class="text-center m-2"
                   :style="{  'border': 'thin solid #283243',
                              'border-radius': '10px',
                              'padding': '2px'
                           }"
              >
                <span>{{ user.username }}<br><code>{{ user.phone }}</code><br><code>{{ user.email }}</code></span>
              </div>
            </div>
          </b-collapse>
        </div>

      </div>
    </div>
    <div v-else class="content"><h6 class="text-center">По данному фильтру не найдено ни одного права!</h6></div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";

export default {
  name: "v-retrieve-permissions",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      colorActions: {"Create": "#0b9322", "Retrieve": "#235d9a", "Update": "#eaa925", "Delete": "#cb1a1a"},
      userProjectsPermissions: [],

      checkBoxesData: {
        actions: ["Create", "Retrieve", "Update", "Delete"],
        entities: ["Server", "Tag", "Dashboard", "Permission", "Project"],
      },

      filterData: {
        filterPermissionName: "",
        filterProjectName: "",
        filterHostname: "",
        filterIp: "",
        filterTag: "",
      },
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    console.log(typeof this.$route.query.actions);
    console.log(this.$route.query.actions);
    console.log("------------------------------");
    console.log(typeof this.$route.query.entities);
    console.log( this.$route.query.entities);
    this.$http
        .get("/permission/retrieve-all-projects-user-permissions/", {
          params: {
            permissionName: (this.$route.query.permissionName === undefined || this.$route.query.permissionName === "all") ? "%" : this.$route.query.permissionName,
            projectName: (this.$route.query.projectName === undefined || this.$route.query.projectName === "all") ? "%" : this.$route.query.projectName,
            filterHostname: (this.$route.query.filterHostname === undefined || this.$route.query.filterHostname === "all") ? "%" : this.$route.query.filterHostname,
            filterIp: (this.$route.query.filterIp === undefined || this.$route.query.filterIp === "all") ? "%" : this.$route.query.filterIp,
            filterTag: (this.$route.query.filterTag === undefined || this.$route.query.filterTag === "all") ? "%" : this.$route.query.filterTag,
            actions: (this.$route.query.actions === undefined) ? ["Create", "Retrieve", "Update", "Delete"] : (typeof this.$route.query.actions === "string") ? [this.$route.query.actions, "actionsKeep"] : this.$route.query.actions,
            entities: (this.$route.query.entities === undefined) ? ["Server", "Tag", "Dashboard", "Permission", "Project"] : (typeof this.$route.query.entities === "string") ? [this.$route.query.entities, "entitiesKeep"] : this.$route.query.entities
          }
        })
        .then(res => {
          this.filterData.filterPermissionName = this.$route.query.permissionName || "all";
          this.filterData.filterProjectName = this.$route.query.projectName || "all";
          this.filterData.filterHostname = this.$route.query.filterHostname || "all";
          this.filterData.filterIp = this.$route.query.filterIp || "all";
          this.filterData.filterTag = this.$route.query.filterTag || "all";
          this.checkBoxesData.actions = (this.$route.query.actions === undefined) ? ["Create", "Retrieve", "Update", "Delete"] : (typeof this.$route.query.actions === "string") ? [this.$route.query.actions, "actionsKeep"] : this.$route.query.actions;
          this.checkBoxesData.entities = (this.$route.query.entities === undefined) ? ["Server", "Tag", "Dashboard", "Permission", "Project"] : (typeof this.$route.query.entities === "string") ? [this.$route.query.entities, "entitiesKeep"] : this.$route.query.entities;

          for (let userProjectPermission of res.data.userAllProjectsPermissions) {
            const [serverActions, tagActions, projectActions,
              dashboardActions, permissionActions] = [[], [], [], [], []];
            const addAction = {
              "Dashboard": (action) => dashboardActions.push(action),
              "Permission": (action) => permissionActions.push(action),
              "Server": (action) => serverActions.push(action),
              "Tag": (action) => tagActions.push(action),
              "Project": (action) => projectActions.push(action)
            };
            const getActions = {
              "Server": serverActions,
              "Permission": permissionActions,
              "Dashboard": dashboardActions,
              "Tag": tagActions,
              "Project": projectActions,
            };
            const permissionItems = {
              "Server": userProjectPermission.servers,
              "Project": [{
                id: userProjectPermission.project.id,
                name: userProjectPermission.project.name
              }],
              "Permission": userProjectPermission.permissions,
              "Tag": userProjectPermission.tags,
              "Dashboard": userProjectPermission.dashboards
            }
            const entitiesInPermission = new Set();
            userProjectPermission.abilities.forEach(ability => {
              entitiesInPermission.add(ability.entity);
              if (ability.entity !== "User" && ability.entity !== "Metric") {
                addAction[ability.entity](ability.action)
              }
            });

            const entitiesWithAbilities = [];
            for (let entity of entitiesInPermission) {
              entitiesWithAbilities.push({entity, actions: getActions[entity], items: permissionItems[entity]});
            }

            this.userProjectsPermissions.push({
              permissionName: userProjectPermission.name,
              projectId: userProjectPermission.project.id,
              projectName: userProjectPermission.project.name,
              entitiesWithAbilities,
              permissionUsers: userProjectPermission.users
            });
          }

          console.log(this.userProjectsPermissions);
        })
        .catch(err => console.log(err));
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

    retrieveProject(projectId) {
      this.$router.push({
        name: 'retrieveProject',
        params: {
          projectId: projectId
        }
      });
    },

    filterPermissions() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }

      if (typeof this.checkBoxesData.entities === "string") {
        this.checkBoxesData.entities = [this.checkBoxesData.entities, "qwe"];
      }
      if (typeof this.checkBoxesData.actions === "string") {
        this.checkBoxesData.actions = [this.checkBoxesData.actions, "qwe"];
      }
      this.$router.push({
        name: "retrieveProjectPermissions",
        query: {
          permissionName: this.filterData.filterPermissionName || "all",
          projectName: this.filterData.filterProjectName || "all",
          filterHostname: this.filterData.filterHostname || "all",
          filterIp: this.filterData.filterIp || "all",
          filterTag: this.filterData.filterTag || "all",
          actions: this.checkBoxesData.actions || ["Create", "Retrieve", "Update", "Delete"],
          entities: this.checkBoxesData.entities || ["Server", "Tag", "Dashboard", "Permission", "Project"]
        }
      });
    }
  }
}
</script>