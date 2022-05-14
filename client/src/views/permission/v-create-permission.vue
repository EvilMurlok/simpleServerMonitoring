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
      <div v-if="choseAdminPermission.isAbleToChoseScenario === true">
        <b-form @submit.prevent="choseLaterScenario"
                class="mt-4 mb-4"
        >
          <b-container>
            <b-row class="my-3 m-3">
              <b-col sm="3"></b-col>
              <b-col sm="6">
                <base-block title="Действия с правами"
                            header-bg
                            header-class="text-center"
                            rounded
                            content-full
                >
                  <div class="form-group text-center">
                    <label class="form-check-label mb-3">Выберите дальнейшие действия</label>
                    <b-form-radio-group
                        id="radio-admin"
                        v-model="choseAdminPermission.radioChooseAdmin"
                        :options="choseAdminPermission.choseVariantsAdmin"
                        name="radio-permissions-slots"
                    >
                    </b-form-radio-group>
                  </div>
                  <b-row class="my-3 m-3">
                    <b-col sm="3">
                    </b-col>
                    <b-col>
                      <b-button type="submit"
                                variant="alt-success"
                                class="ml-4 mb-3"
                                size="sm"
                      >
                        <i class="far fa-check-circle opacity-50 mr-1"></i> Подтвердить
                      </b-button>
                    </b-col>
                  </b-row>
                </base-block>
              </b-col>
              <b-col sm="3"></b-col>
            </b-row>
          </b-container>
        </b-form>
      </div>
      <div v-if="choseAdminPermission.isCreateAdmin === 1">
        <b-form @submit.prevent="giveAdminPermission"
                class="mt-4 mb-4"
        >
          <b-container>
            <b-row class="my-3 m-3">
              <b-col sm="3"></b-col>
              <b-col sm="6">
                <base-block title="Право администратора"
                            header-bg
                            header-class="text-center"
                            rounded
                            content-full
                >
                  <div class="py-3">
                    <div class="form-group text-center mb-0">
                      <label class="form-check-label mb-3">Название права</label>
                      <b-form-input size="md"
                                    id="permissionAdminName"
                                    name="permissionAdminName"
                                    class="mb-3"
                                    :value="'admin' + project.name"
                                    disabled
                      >
                      </b-form-input>
                    </div>
                  </div>
                </base-block>
              </b-col>
              <b-col sm="3"></b-col>
            </b-row>
            <b-row class="my-3 m-3">
              <b-col sm="12">
                <base-block title="Кому выдать право администратора?"
                            rounded
                            header-bg
                            header-class="text-center"
                            content-full
                >
                  <div class="d-flex justify-content-end">
                    <b-button variant="alt-info"
                              class="m-1 pr-2 pl-2"
                              v-if="chooseAllData.isChosenAllUsers === true"
                              @click="deselectAllItems('user')"
                    >
                      <i class="si si-close opacity-50 mr-1"></i>Убрать все
                    </b-button>
                    <b-button v-else
                              variant="alt-info"
                              class="m-1 pr-2 pl-2"
                              @click="selectAllItems('user')"
                    >
                      <i class="si si-check opacity-50 mr-1"></i> Выделить все
                    </b-button>
                  </div>
                  <div class="form-group text-center mb-0">
                    <div class="d-flex flex-wrap">
                      <b-form-checkbox-group
                          v-model="newPermission.newPermissionUsersIds"
                          id="adminPermissionUserIds"
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
            <b-row>
              <b-col sm="4">
              </b-col>
              <b-col>
                <b-button type="submit"
                          variant="alt-success"
                          class="ml-4 mb-3"
                          size="sm"
                          :disabled="otherUsersInCommunity.length === 0"
                >
                  <i class="far fa-check-circle opacity-50 mr-1"></i> Выдать право администратора
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-form>
      </div>
      <div v-if="choseAdminPermission.isCreateAdmin === 0">
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
                                variant="alt-success"
                                class="ml-4 mb-3"
                                size="sm"
                      >
                        <i class="far fa-check-circle opacity-50 mr-1"></i> Выбрать право
                      </b-button>
                    </b-col>
                  </b-row>

                </base-block>
              </b-col>
              <b-col sm="3"></b-col>
            </b-row>
          </b-container>
        </b-form>
        <div v-if="newPermission.isReadyToCreate === 1">
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
                      <div v-if="duplicatedActions.projectActions.length > 0">
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
                          Право, название которого соответсвует 'admin{{ project.name }}', является правом администратора!
                        <i class="fa fa-fw fa-exclamation-circle ml-1"></i>
                      </span>
                      </div>
                    </div>
                  </base-block>
                </b-col>
              </b-row>
              <div v-if="duplicatedActions.serversActions.length > 0 && currentPermission.servers.length > 0">
                <b-row class="my-3 m-3">
                  <b-col sm="12">
                    <base-block title="Серверы проекта"
                                rounded
                                header-bg
                                header-class="text-center"
                                content-full
                    >
                      <div class="d-flex justify-content-end">
                        <b-button variant="alt-info"
                                  class="m-1 pr-2 pl-2"
                                  v-if="chooseAllData.isChosenAllServers === true"
                                  @click="deselectAllItems('server')"
                        >
                          <i class="si si-close opacity-50 mr-1"></i>Убрать все
                        </b-button>
                        <b-button v-else
                                  variant="alt-info"
                                  class="m-1 pr-2 pl-2"
                                  @click="selectAllItems('server')"
                        >
                          <i class="si si-check opacity-50 mr-1"></i> Выделить все
                        </b-button>
                      </div>
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
                        <label class="form-check-label mb-3">Серверы</label>
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
              </div>
              <div v-if="duplicatedActions.tagsActions.length > 0 && currentPermission.tags.length > 0">
                <b-row class="my-3 m-3">
                  <b-col sm="12">
                    <base-block title="Теги серверов проекта"
                                rounded
                                header-bg
                                header-class="text-center"
                                content-full
                    >
                      <div class="d-flex justify-content-end">
                        <b-button variant="alt-info"
                                  class="m-1 pr-2 pl-2"
                                  v-if="chooseAllData.isChosenAllTags === true"
                                  @click="deselectAllItems('tag')"
                        >
                          <i class="si si-close opacity-50 mr-1"></i>Убрать все
                        </b-button>
                        <b-button v-else
                                  variant="alt-info"
                                  class="m-1 pr-2 pl-2"
                                  @click="selectAllItems('tag')"
                        >
                          <i class="si si-check opacity-50 mr-1"></i> Выделить все
                        </b-button>
                      </div>
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
                        <label class="form-check-label mb-1">Теги</label>
                        <div class="d-flex flex-wrap mt-0">
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
              </div>
              <div v-if="otherUsersInCommunity.length">
                <b-row class="my-3 m-3">
                  <b-col sm="12">
                    <base-block title="Кому выдать право?"
                                rounded
                                header-bg
                                header-class="text-center"
                                content-full
                    >
                      <div class="d-flex justify-content-end">
                        <b-button variant="alt-info"
                                  class="m-1 pr-2 pl-2"
                                  v-if="chooseAllData.isChosenAllUsers === true"
                                  @click="deselectAllItems('user')"
                        >
                          <i class="si si-close opacity-50 mr-1"></i>Убрать все
                        </b-button>
                        <b-button v-else
                                  variant="alt-info"
                                  class="m-1 pr-2 pl-2"
                                  @click="selectAllItems('user')"
                        >
                          <i class="si si-check opacity-50 mr-1"></i> Выделить все
                        </b-button>
                      </div>
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
              </div>
              <b-row class="my-3 m-3">
                <b-col sm="5"></b-col>
                <b-col sm="2">
                  <b-button type="submit"
                            variant="alt-success"
                            class="mr-1 mb-3"
                            block
                            :disabled="otherUsersInCommunity.length === 0"
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
  </div>
</template>

<script>
import breakAuth from "@/utils/authorization";
import BaseMessage from "@/layouts/partials/BaseMessage";
import router from "@/router/router";
import checkCreatePermission from "@/utils/checkPermissions/checkCreatePermission";
import checkAdminPermission from "@/utils/checkPermissions/checkAdminPermission";

export default {
  name: "v-create-permission",

  components: {
    BaseMessage
  },

  data() {
    return {
      choseAdminPermission: {
        isAbleToChoseScenario: true,
        isCreateAdmin: 2,
        choseVariantsAdmin: [
          {text: "Раздать право администратора", value: 1},
          {text: "Создать пользовательское право", value: 0}
        ],
        radioChooseAdmin: 0,
      },
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

      chooseAllData: {
        isChosenAllServers: true,
        isChosenAllTags: true,
        isChosenAllUsers: false
      },

      currentPermission: {
        servers: [],
        tags: [],
        dashboards: [],
        abilities: [],
      },

      newPermission: {
        name: "",
        isReadyToCreate: 2,
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

      this.$http
          .get(`/project/retrieve-project/${this.$route.params.projectId}/`)
          .then(res => {
            if (res.data.isLoggedIn === false) {
              breakAuth.breakAuth(res);
            } else {
              this.project = res.data.projectInfo[0];
              this.projectName = `Проект ${this.project.name}`;
              if (!checkAdminPermission.checkAdminPermission(this.project.name)) {
                this.choseAdminPermission.isCreateAdmin = 0;
                this.choseAdminPermission.isAbleToChoseScenario = false;
              }
            }
          })
          .catch(err => console.error(err));
    }
  },

  methods: {
    cleanAllData() {
      this.newPermission.isReadyToCreate = 2;
      this.newPermission.newPermissionServersActions = [];
      this.newPermission.newPermissionProjectActions = [];
      this.newPermission.newPermissionTagsActions = [];
      this.newPermission.newPermissionActions = [];
      this.newPermission.newPermissionServersIds = [];
      this.newPermission.newPermissionTagsIds = [];
      this.newPermission.newPermissionUsersIds = [];
      this.currentPermission.servers = [];
      this.currentPermission.tags = [];
      this.currentPermission.abilities = [];
      this.currentPermission.dashboards = [];
      this.otherUsersInCommunity = [];
    },

    deselectAllItems(nameOfItem) {
      if (nameOfItem === "server") {
        this.newPermission.newPermissionServersIds = [];
        this.chooseAllData.isChosenAllServers = false;
      } else if (nameOfItem === "tag") {
        this.newPermission.newPermissionTagsIds = [];
        this.chooseAllData.isChosenAllTags = false;
      } else if (nameOfItem === "user") {
        this.newPermission.newPermissionUsersIds = [];
        this.chooseAllData.isChosenAllUsers = false;
      }
    },

    selectAllItems(nameOfItem) {
      if (nameOfItem === "server") {
        this.newPermission.newPermissionServersIds = this.currentPermission.servers.map(server => server.id);
        this.chooseAllData.isChosenAllServers = true;
      } else if (nameOfItem === "tag") {
        this.newPermission.newPermissionTagsIds = this.currentPermission.tags.map(tag => tag.id);
        this.chooseAllData.isChosenAllTags = true;
      } else if (nameOfItem === "user") {
        this.newPermission.newPermissionUsersIds = this.otherUsersInCommunity.map(user => user.id);
        this.chooseAllData.isChosenAllUsers = true;
      }
    },

    choseLaterScenario() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      this.choseAdminPermission.isCreateAdmin = this.choseAdminPermission.radioChooseAdmin;
      this.cleanAllData();
      if (this.choseAdminPermission.radioChooseAdmin) {
        this.availablePermissions.radioPermissionsId = 0;
        this.$http
            .get(`/user/retrieve-other-users-without-admin-permission/${this.project.id}/`)
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.otherUsersInCommunity = res.data.otherUsers;
                if (!this.otherUsersInCommunity.length) {
                  this.messages_data = {
                    type: "warning",
                    messages: [{text: "Нет ни одного пользователя, которому Вы могли бы присвоить право администратора!"}]
                  };
                }
              }
            })
            .catch(err => console.error(err));
      }
    },

    giveAdminPermission() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }

      if (this.newPermission.newPermissionUsersIds.length) {
        this.$http
            .post("/permission/give-admin-permission-to-people/", { 
              permissionAdminName: `admin${this.project.name}`,
              userIds: this.newPermission.newPermissionUsersIds
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                if (res.data.status === "success") {
                  this.choseAdminPermission.isCreateAdmin = 2;
                  this.messages_data = {type: res.data.status, messages: res.data.messages};
                } else {
                  this.messages_data = {type: res.data.status, messages: res.data.messages};
                }
              }
            })
            .catch(err => console.error(err));
      } else {
        this.messages_data = {
          type: "warning",
          messages: [{text: "Выберите пользователей, которым Вы хотели бы присвоить право администратора!"}]
        };
      }
    },

    getAllItemsOfPermission() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }

      this.cleanAllData();

      if (this.availablePermissions.radioPermissionsId) {
        this.$http
            .get(`/permission/retrieve-permission-with-items/${this.availablePermissions.radioPermissionsId}/`)
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                if (res.data.permissionWithItems) {
                  this.newPermission.isReadyToCreate = 1;
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
                    .get(`/user/retrieve-other-users-without-admin-permission/${this.project.id}/`)
                    .then(res => {
                      if (res.data.isLoggedIn === false) {
                        breakAuth.breakAuth(res);
                      } else {
                        this.otherUsersInCommunity = res.data.otherUsers;
                        if (!this.otherUsersInCommunity.length) {
                          this.messages_data = {
                            type: "warning",
                            messages: [{text: "Нет ни одного пользователя, которому Вы могли бы присвоить создаваемое право!"}]
                          };
                        }
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

      if (this.newPermission.newPermissionServersActions.length && !this.newPermission.newPermissionServersIds.length) {
        if (this.newPermission.newPermissionServersActions.length === 1 && this.newPermission.newPermissionServersActions[0] === "Create") {
          console.log("QQQ");
        } else {
          messages.push({
            text: "Можно указать в качестве действия серверов только 'CREATE' и не указывать никакого инстанса, на остальные действия необходимо указывать инстансы серверов!"
          });
        }
      }

      if (this.newPermission.newPermissionTagsActions.length && !this.newPermission.newPermissionTagsIds.length) {
        if (this.newPermission.newPermissionTagsActions.length === 1 && this.newPermission.newPermissionTagsActions[0] === "Create") {
          console.log("QQQ");
        } else {
          messages.push({
            text: "Можно указать в качестве действия тегов только 'CREATE' и не указывать никакого инстанса, на остальные действия необходимо указывать инстансы тегов!"
          });
        }
      }

      if ((
              this.newPermission.newPermissionTagsActions.length === 1 &&
              this.newPermission.newPermissionTagsActions[0] === "Create" &&
              this.newPermission.newPermissionTagsIds.length > 0
          ) ||
          (
              this.newPermission.newPermissionServersActions.length === 1 &&
              this.newPermission.newPermissionServersActions[0] === "Create" &&
              this.newPermission.newPermissionServersIds.length > 0)
      ) {
        messages.push({
          text: "Нельзя выбрать только действие 'CREATE' и выбрать инстансы серверов или тегов!"
        });
      }

      if ((this.newPermission.newPermissionServersActions.includes("Delete") || this.newPermission.newPermissionServersActions.includes("Update")) &&
          !this.newPermission.newPermissionServersActions.includes("Retrieve")) {
        messages.push({
          text: "Невозможно задать действие 'UPDATE' или 'DELETE' и при этом не указать действие 'RETRIEVE'!"
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
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.messages_data = {type: res.data.status, messages: res.data.messages};
                if (res.data.status === "success") {
                  if (!checkAdminPermission.checkAdminPermission(this.project.name)) {
                    this.choseAdminPermission.isCreateAdmin = 0;
                    this.choseAdminPermission.isAbleToChoseScenario = false;
                  } else {
                    this.choseAdminPermission.isCreateAdmin = 2;
                  }
                  this.choseAdminPermission.radioChooseAdmin = 0;
                  this.availablePermissions.radioPermissionsId = 0;
                  this.cleanAllData();
                }
              }
            })
            .catch(err => console.error(err));
      }
    },
  },
}
</script>