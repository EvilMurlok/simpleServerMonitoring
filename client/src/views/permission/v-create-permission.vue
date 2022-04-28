<template>
  <div class="v-create-permission">
    <div class="content mb-4">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <div class="h2 font-w700 mb-2">
            На этой странице вы можете создать пользовательское право в проекте {{ project.name }}
          </div>
        </div>
      </div>
      <BaseMessage
          v-for="item in messages_data.messages"
          :key="item.text"
          :message_data="{type: messages_data.type, item: item}"
      />
    </div>
    <div class="container">
      <b-form @submit.prevent="getAllItemsOfPermission"
              class="mt-4 mb-4"
      >
        <b-container>
          <b-row class="my-3 m-3">
            <b-col sm="3"></b-col>
            <b-col sm="6">
              <base-block title="Родительское право"
                          header-bg
                          header-class="text-center"
                          rounded
                          content-full
              >
                <div class="form-group text-center">
                  <label class="form-check-label mb-3">Выберите родительское право</label>
                  <b-form-radio-group
                      id="radio-slots"
                      v-model="availablePermissions.radioPermissionsId"
                      :options="availablePermissions.permissions"
                      name="radio-permissions-slots"
                  >
                  </b-form-radio-group>
                </div>
                <b-row>
                  <b-col sm="3">
                  </b-col>
                  <b-col>
                    <b-button type="submit"
                              variant="alt-info"
                              class="ml-4 mb-3"
                              size="sm"
                    >
                      <i class="si si-info opacity-50 mr-1"></i> Выбрать право
                    </b-button>
                  </b-col>
                </b-row>

              </base-block>
            </b-col>
            <b-col sm="3"></b-col>
          </b-row>
        </b-container>
      </b-form>
      <div v-if="newPermission.isReadyToCreate === 2">
        <b-form @submit.prevent="createCustomPermission"
                class="mt-4 mb-4"
        >
          <b-container class="mb-3 mt-3">
            <b-row class="my-3 m-3">
              <b-col sm="6">
                <base-block :title="projectName"
                            rounded
                            header-bg
                            header-class="text-center"
                            content-full
                >
                  <div class="form-group text-center mb-0">
                    <label class="form-check-label mb-1">Действия (у всех) по умолчанию</label>
                    <b-form-checkbox-group
                        v-model="newPermission.newPermissionProjectDefaultActions"
                        id="currenPermissionProjectDefaultActions"
                        class="mb-2"
                    >
                      <div class="d-flex flex-wrap justify-content-center">
                        <b-form-checkbox value="Create"
                                         class="mr-4"
                                         disabled
                        >
                          <span class="p-1"
                                :style="{ 'background-color': colorActions['Create'],
                                          'color': '#ffffff',
                                          'border-radius': '5px',
                                          'margin': '2px'
                                        }"
                          >
                            Create
                          </span>
                        </b-form-checkbox>
                        <b-form-checkbox value="Retrieve"
                                         class="mr-4"
                                         disabled
                        >
                           <span class="p-1"
                                 :style="{ 'background-color': colorActions['Retrieve'],
                                          'color': '#ffffff',
                                          'border-radius': '5px',
                                          'margin': '2px'
                                        }"
                           >
                            Retrieve
                          </span>
                        </b-form-checkbox>
                      </div>
                    </b-form-checkbox-group>
                    <label class="form-check-label mb-1">Действия с текущим проектом</label>
                    <b-form-checkbox-group
                        v-model="newPermission.newPermissionProjectActions"
                        id="currentPermissionProjectActions"
                    >
                      <div class="d-flex flex-wrap justify-content-center">
                        <b-form-checkbox v-for="action in duplicatedActions.projectActions"
                                         :key="action"
                                         :value="action"
                                         class="mr-4"
                        >
                          <span class="p-1"
                                :style="{ 'background-color': colorActions[action],
                                          'color': '#ffffff',
                                          'border-radius': '5px',
                                          'margin': '2px'
                                        }"
                          >
                            {{ action }}
                          </span>
                        </b-form-checkbox>
                      </div>
                    </b-form-checkbox-group>
                  </div>
                </base-block>
              </b-col>
              <b-col sm="6">
                <base-block title="Название создаваемого права"
                            header-bg
                            header-class="text-center"
                            rounded
                            content-full
                >
                  <div class="py-3">
                    <div class="form-group text-center mb-0">
                      <label class="form-check-label mb-3">Название права</label>
                      <b-form-input size="md"
                                    id="permissionName"
                                    name="permissionName"
                                    placeholder="Название права"
                                    v-model="newPermission.name"
                                    class="mb-3"
                      >
                      </b-form-input>
                      <span class="text-center" style="color: #3140e1">
                        <i class="fa fa-fw fa-exclamation-circle mr-1"></i>
                          Права, начинающиеся на 'admin' являются правами администратора
                        <i class="fa fa-fw fa-exclamation-circle ml-1"></i>
                      </span>
                    </div>
                  </div>
                </base-block>
              </b-col>
            </b-row>
            <b-row class="my-3 m-3">
              <b-col sm="12">
                <base-block title="Серверы проекта"
                            rounded
                            header-bg
                            header-class="text-center"
                            content-full
                >
                  <div class="form-group text-center mb-0">
                    <label class="form-check-label mb-3">Выберите действия</label>
                    <b-form-checkbox-group
                        v-model="newPermission.newPermissionServersActions"
                        id="currentPermissionServersActions"
                        class="mb-2"
                    >
                      <div class="d-flex flex-wrap justify-content-center">
                        <b-form-checkbox v-for="action in duplicatedActions.serversActions"
                                         :key="action"
                                         :value="action"
                                         class="mr-4 mb-4"
                        >
                          <span class="p-1"
                                :style="{ 'background-color': colorActions[action],
                                          'color': '#ffffff',
                                          'border-radius': '5px',
                                          'margin': '2px'
                                        }"
                          >
                            {{ action }}
                          </span>
                        </b-form-checkbox>
                      </div>
                    </b-form-checkbox-group>
                    <div class="d-flex flex-wrap">
                      <b-form-checkbox-group
                          v-model="newPermission.newPermissionServersIds"
                          id="currentPermissionServersIds"
                      >
                        <b-form-checkbox v-for="server in currentPermission.servers"
                                         :key="server.id"
                                         :value="server.id"
                                         class="ml-4 mt-4"
                        >
                          <div
                              :style="{  'cursor': 'pointer',
                                    'border': 'thin solid #283243',
                                    'border-radius': '10px',
                                    'padding': '2px'
                                  }"
                          >
                            <span>{{ server.hostname }}<br>(<code>{{ server.ip }}</code>)</span>
                          </div>
                        </b-form-checkbox>
                      </b-form-checkbox-group>
                    </div>
                  </div>
                </base-block>
              </b-col>
            </b-row>
            <b-row class="my-3 m-3">
              <b-col sm="12">
                <base-block title="Теги серверов проекта"
                            rounded
                            header-bg
                            header-class="text-center"
                            content-full
                >
                  <div class="form-group text-center mb-0">
                    <label class="form-check-label mb-3">Выберите действия</label>
                    <b-form-checkbox-group
                        v-model="newPermission.newPermissionTagsActions"
                        id="currentPermissionTagsActions"
                        class="mb-2"
                    >
                      <div class="d-flex flex-wrap justify-content-center">
                        <b-form-checkbox v-for="action in duplicatedActions.tagsActions"
                                         :key="action"
                                         :value="action"
                                         class="mr-4 mb-4"
                        >
                          <span class="p-1"
                                :style="{ 'background-color': colorActions[action],
                                          'color': '#ffffff',
                                          'border-radius': '5px',
                                          'margin': '2px'
                                        }"
                          >
                            {{ action }}
                          </span>
                        </b-form-checkbox>
                      </div>
                    </b-form-checkbox-group>
                    <div class="d-flex flex-wrap">
                      <b-form-checkbox-group
                          v-model="newPermission.newPermissionTagsIds"
                          id="currentPermissionTagsIds"
                      >
                        <b-form-checkbox v-for="tag in currentPermission.tags"
                                         :key="tag.id"
                                         :value="tag.id"
                                         class="ml-4 mt-4"
                        >
                          <div class="p-1"
                               :style="{'cursor': 'pointer',
                                      'background-color': tag.color,
                                      'color': '#ffffff',
                                      'border-radius': '10px',
                                      'margin': '1px'
                                     }"
                          >
                            <span>{{ tag.name }}</span>
                          </div>
                        </b-form-checkbox>
                      </b-form-checkbox-group>
                    </div>
                  </div>
                </base-block>
              </b-col>
            </b-row>
            <b-row class="my-3 m-3">
              <b-col sm="12">
                <base-block title="Кому выдать право?"
                            rounded
                            header-bg
                            header-class="text-center"
                            content-full
                >
                  <div class="form-group text-center mb-0">
                    <div class="d-flex flex-wrap">
                      <b-form-checkbox-group
                          v-model="newPermission.newPermissionUsersIds"
                          id="currentProjectUsersIds"
                      >
                        <b-form-checkbox v-for="user in otherUsersInCommunity"
                                         :key="user.id"
                                         :value="user.id"
                                         class="ml-4 mt-4"
                        >
                          <div
                              class="text-center m-2"
                              :style="{  'border': 'thin solid #283243',
                              'border-radius': '10px',
                              'padding': '2px'
                           }"
                          >
                          <span>
                            {{ user.username }}<br><code>{{ user.phone }}</code><br><code>{{ user.email }}</code>
                          </span>
                          </div>
                        </b-form-checkbox>
                      </b-form-checkbox-group>
                    </div>
                  </div>
                </base-block>
              </b-col>
            </b-row>
            <b-row class="my-3 m-3">
              <b-col sm="12">
                <base-block title="Резрешаете ли Вы этим пользователям создавать права?"
                            rounded
                            header-bg
                            header-class="text-center"
                            content-full
                >
                  <b-form-checkbox-group
                      v-model="newPermission.newPermissionActions"
                      id="currentPermissionActions"
                      class="mb-2"
                  >
                    <div class="d-flex flex-wrap justify-content-center">
                      <b-form-checkbox value="Create"
                                       class="mr-4"
                      >
                          <span class="p-1"
                                :style="{ 'background-color': colorActions['Create'],
                                          'color': '#ffffff',
                                          'border-radius': '5px',
                                          'margin': '2px'
                                        }"
                          >
                            Create
                          </span>
                      </b-form-checkbox>
                    </div>
                  </b-form-checkbox-group>
                </base-block>
              </b-col>
            </b-row>
            <b-row class="my-3 m-3">
              <b-col sm="5"></b-col>
              <b-col sm="2">
                <b-button type="submit"
                          variant="alt-success"
                          class="mr-1 mb-3"
                          block
                >
                  <i class="fa fa-plus opacity-50 mr-1"></i> Добавить право
                </b-button>
              </b-col>
              <b-col sm="5"></b-col>
            </b-row>
          </b-container>
        </b-form>
      </div>
      <div class="text-center" v-else-if="newPermission.isReadyToCreate === 0">
        <h3 style="color: red">Такого права не существует!</h3>
      </div>
    </div>
  </div>
</template>

<script>
import breakAuth from "@/utils/authorization";
import BaseMessage from "@/layouts/partials/BaseMessage";
import router from "@/router/router";
import checkCreatePermission from "@/utils/checkPermissions/checkCreatePermission";

export default {
  name: "v-create-permission",

  components: {
    BaseMessage
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      project: {},
      projectName: "",
      colorActions: {"Create": "#0b9322", "Retrieve": "#235d9a", "Update": "#eaa925", "Delete": "#cb1a1a"},
      otherUsersInCommunity: [],
      availablePermissions: {
        permissions: [],
        radioPermissionsId: 0,
      },
      duplicatedActions: {
        serversActions: [],
        tagsActions: [],
        projectActions: [],
      },
      currentPermission: {
        servers: [],
        tags: [],
        dashboards: [],
        abilities: [],
      },
      newPermission: {
        name: "",
        isReadyToCreate: 1,
        newPermissionProjectActions: [],
        newPermissionProjectDefaultActions: ["Create", "Retrieve"],
        newPermissionServersActions: [],
        newPermissionTagsActions: [],
        newPermissionActions: [],
        newPermissionServersIds: [],
        newPermissionTagsIds: [],
        newPermissionUsersIds: [],
      }
    }
  },

  beforeCreate() {
    if (!checkCreatePermission.checkCreatePermission(this.$route.params.projectId)) {
      router.push({
        name: "notFoundPage",
        replace: true
      });
      router.go(0);
    }
  },

  created() {
    if (this.$route.params.messages_data !== undefined) {
      this.messages_data = this.$route.params.messages_data;
    } else {
      this.messages_data = {type: "warning", messages: []};
    }
    if (this.$route.params.projectId) {
      this.$http
          .get(`/permission/retrieve-project-user-permissions/${this.$route.params.projectId}/`)
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth.breakAuth(res);
            } else {
              for (let permission of res.data.projectUserPermissions) {
                this.availablePermissions.permissions.push({
                  text: permission.name,
                  value: permission.id
                });
              }
            }
          })
          .catch(err => console.error(err));

      this.project = this.$http
          .get(`/project/retrieve-project/${this.$route.params.projectId}/`)
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth.breakAuth(res);
            } else {
              this.project = res.data.project;
              this.projectName = `Проект ${this.project.name}`;
            }
          })
          .catch(err => console.error(err));
    }
  },

  methods: {
    getAllItemsOfPermission() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }

      this.newPermission.newPermissionServersActions = [];
      this.newPermission.newPermissionProjectActions = [];
      this.newPermission.newPermissionTagsActions = [];
      this.newPermission.newPermissionActions = [];

      if (this.availablePermissions.radioPermissionsId) {
        this.$http
            .get(`/permission/retrieve-permission-with-items/${this.availablePermissions.radioPermissionsId}/`)
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                if (res.data.permissionWithItems) {
                  this.newPermission.isReadyToCreate = 2;
                  this.currentPermission.servers = res.data.permissionWithItems.servers;
                  this.currentPermission.abilities = res.data.permissionWithItems.abilities;
                  this.currentPermission.servers.forEach(server => this.newPermission.newPermissionServersIds.push(server.id));
                  this.currentPermission.tags = res.data.permissionWithItems.tags;
                  this.currentPermission.tags.forEach(tag => this.newPermission.newPermissionTagsIds.push(tag.id));
                  const addAction = {
                    "Server": (action) => this.newPermission.newPermissionServersActions.push(action),
                    "Tag": (action) => this.newPermission.newPermissionTagsActions.push(action),
                    "Project": (action) => this.newPermission.newPermissionProjectActions.push(action)
                  };
                  const entitiesInPermission = new Set();
                  res.data.permissionWithItems.abilities.forEach(ability => {
                    entitiesInPermission.add(ability.entity);
                    if (ability.entity !== "User" && ability.entity !== "Metric" && ability.entity !== "Dashboard" && ability.entity !== "Permission") {
                      addAction[ability.entity](ability.action);
                    }
                  });
                  this.duplicatedActions.projectActions = this.newPermission.newPermissionProjectActions.slice();
                  this.duplicatedActions.serversActions = this.newPermission.newPermissionServersActions.slice();
                  this.duplicatedActions.tagsActions = this.newPermission.newPermissionTagsActions.slice();

                } else {
                  this.newPermission.isReadyToCreate = 0;
                  this.messages_data = {type: "warning", messages: [{text: "Такого права не существует!"}]};
                }
                this.$http
                    .get("/user/retrieve-other-users/")
                    .then(res => {
                      if (res.data.isLoggedIn === false) {
                        breakAuth.breakAuth(res);
                      } else {
                        this.otherUsersInCommunity = res.data.otherUsers;
                      }
                    })
                    .catch(err => console.error(err));
              }

            })
            .catch(err => console.error(err));
      } else {
        console.error(this.availablePermissions.radioPermissionsId);
        this.messages_data = {type: "warning", messages: [{text: "Необходимо выбрать одно родительское право!"}]};
      }
    },


    createCustomPermission() {
      const [messages, rightName] = [[], /^[a-zA-Z0-9_]{3,255}$/];

      if (!this.newPermission.name) {
        messages.push({
          text: "Задайте имя для создаваемого права!"
        });
      }

      if (this.newPermission.name && !rightName.test(this.newPermission.name)) {
        messages.push({
          text: "Имя Права может содержать только латинские буквы, цифры, подчёркивания!"
        });
      }

      if (!this.newPermission.newPermissionUsersIds.length) {
        messages.push({
          text: "Выберите пользователей системы, которым Вы хотите присвоить создаваемое право!"
        });
      }


      // if some tags or servers was chosen but no abilities was chosen we should show warning!
      if ((this.newPermission.newPermissionTagsIds.length && !this.newPermission.newPermissionTagsActions.length) ||
          (this.newPermission.newPermissionServersIds.length && !this.newPermission.newPermissionServersActions.length)) {
        messages.push({
          text: "У тегов, серверов необходимо указать хотя бы одно действие!"
        });
      }

      if ((this.newPermission.newPermissionServersActions.length && !this.newPermission.newPermissionServersIds.length) ||
          (this.newPermission.newPermissionTagsActions.length && !this.newPermission.newPermissionTagsIds.length)) {
        messages.push({
          text: "Если выбрали действие, то укажите инстансы серверов или тегов, которым применяется действие!"
        });
      }

      if (messages.length) {
        this.messages_data = {type: "warning", messages: messages};
      } else {
        // create an array with new abilities
        const newPermissionAbilities = [];
        for (let currentPermissionProjectAction of this.newPermission.newPermissionProjectActions) {
          newPermissionAbilities.push(
              (this.currentPermission.abilities.filter(ability =>
                  ability.entity === "Project" && ability.action === currentPermissionProjectAction
              )[0].id)
          );
        }

        for (let currentPermissionServersAction of this.newPermission.newPermissionServersActions) {
          newPermissionAbilities.push(
              (this.currentPermission.abilities.filter(ability =>
                  ability.entity === "Server" && ability.action === currentPermissionServersAction
              )[0].id)
          );
        }

        for (let currentPermissionTagsAction of this.newPermission.newPermissionTagsActions) {
          newPermissionAbilities.push(
              (this.currentPermission.abilities.filter(ability =>
                  ability.entity === "Tag" && ability.action === currentPermissionTagsAction
              )[0].id)
          );
        }
        if (this.newPermission.newPermissionActions.length) {
          newPermissionAbilities.push((this.currentPermission.abilities.filter(ability =>
              ability.entity === "Permission" && ability.action === this.newPermission.newPermissionActions[0]
          )[0].id))
        }
        this.$http
            .post(`/permission/create-custom/${this.project.id}/`, {
              masterPermissionId: this.availablePermissions.radioPermissionsId,
              name: this.newPermission.name,
              abilityIds: newPermissionAbilities,
              tagIds: this.newPermission.newPermissionTagsIds,
              serverIds: this.newPermission.newPermissionServersIds,
              userIds: this.newPermission.newPermissionUsersIds
            })
            .then(res => {
              this.messages_data = {type: res.data.status, messages: res.data.messages}
            })
            .catch(err => console.error(err));
      }
    },
  },
}
</script>