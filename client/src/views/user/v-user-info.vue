<template>
  <div class="v-user-item">
    <div class="content">
      <div
          class="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center py-2 text-center text-sm-left">
        <div class="flex-sm-fill">
          <p class="h4 font-w500 text-center mb-0">На этой странице можно посмотреть Вашу личную информацию и изменить пароль</p>
        </div>
      </div>
    </div>
    <!-- END Hero -->

    <!-- Page Content -->
    <div class="content">
      <b-container class="mb-3 mt-3">
        <b-row class="my-3 m-3">
          <b-col sm="6">
            <base-block title="Личная информация"
                        rounded
                        header-bg
                        content-full
                        header-class="text-center"
            >

              <div v-if="isPassword === false">
                <BaseMessage
                    v-for="item in messages_data.messages"
                    :key="item.text"
                    :message_data="{type: messages_data.type, item: item}"
                />
              </div>

              <b-form @submit.prevent="updateUser">
                  <div class="form-group">
                    <label class="form-check-label mb-2">Никнейм</label>
                    <b-form-input size="lg"
                                  id="username"
                                  name="username"
                                  placeholder="Никнейм"
                                  v-model="user.username"
                    >
                    </b-form-input>
                  </div>

                  <div class="form-group">
                    <label class="form-check-label mb-2">Телефон</label>
                    <b-form-input size="lg"
                                  id="phone"
                                  name="phone"
                                  placeholder="Телефон"
                                  v-model="user.phone"
                    >
                    </b-form-input>
                  </div>

                  <div class="form-group">
                    <label class="form-check-label mb-2">Почтовый ящик</label>
                    <b-form-input size="lg"
                                  id="email"
                                  name="email"
                                  placeholder="Почтовый ящик"
                                  v-model="user.email"
                    >
                    </b-form-input>
                  </div>
                <b-button type="submit"
                          variant="alt-info"
                          size="sm"
                >
                  <i class="si si-refresh mr-2"></i> Обновить данные
                </b-button>
              </b-form>
            </base-block>
          </b-col>
          <b-col sm="6">
            <base-block title="Изменить пароль"
                        rounded
                        header-bg
                        content-full
                        header-class="text-center"
            >
              <b-form @submit.prevent="updatePassword">
                <div v-if="isPassword === true">
                  <BaseMessage
                      v-for="item in messages_data.messages"
                      :key="item.text"
                      :message_data="{type: messages_data.type, item: item}"
                  />
                </div>
                <div class="form-group">
                  <label class="form-check-label mb-2">Текущий пароль</label>
                  <b-form-input type="password"
                                id="currentPassword"
                                name="currentPassword"
                                size="lg"
                                placeholder="Текущий пароль"
                                v-model="currentPassword"
                  >
                  </b-form-input>
                </div>
                <div class="form-group">
                  <label class="form-check-label mb-2">Новый пароль</label>
                  <b-form-input type="password"
                                id="newPassword"
                                name="currentPassword"
                                size="lg"
                                placeholder="Новый пароль"
                                v-model="newPassword"
                  >
                  </b-form-input>
                </div>
                <div class="form-group">
                  <label class="form-check-label mb-2">Подтвердите новый пароль</label>
                  <b-form-input type="password"
                                id="confirmNewPassword"
                                size="lg"
                                placeholder="Подтвердите новый пароль"
                                v-model="confirmNewPassword"
                  >
                  </b-form-input>
                </div>
                <b-button type="submit"
                          variant="alt-info"
                          size="sm"
                >
                  <i class="si si-refresh mr-2"></i> Изменить пароль
                </b-button>
              </b-form>
            </base-block>
          </b-col>
        </b-row>
        <b-row class="my-3 m-3">
          <b-col sm="4">
            <base-block title="Danger zone"
                        header-bg
                        content-full
                        rounded
            >
              <b-button variant="alt-danger"
                        size="lg"
                        block
                        @click="deleteUser"
              >
                <i class="fa fa-exclamation-triangle mr-2"></i> Удалить профиль
              </b-button>
            </base-block>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import BaseMessage from "@/layouts/partials/BaseMessage";
import breakAuth from "@/utils/authorization";
import {mapActions} from "vuex";
import store from "../../../vuex/store";
import checkDefault from "@/utils/checkPermissions/default";
import router from "@/router/router";

export default {
  name: "v-user-info",

  components: {
    BaseMessage
  },

  beforeCreate() {
    if (!checkDefault.checkDefault()) {
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
    this.user = store.getters.USER;
  },

  data() {
    return {
      messages_data: {type: "warning", messages: []},
      user: {
        username: "",
        phone: "",
        email: "",
        password: "",
        confirm_password: ""
      },
      isPassword: false,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  },

  methods: {
    ...mapActions(["SET_USER"]),

    updatePassword() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      this.isPassword = true;
      const [rightPassword] = [/^[a-zA-Z0-9_-]+/];
      if (!this.currentPassword) {
        this.isPassword = true;
        this.messages_data.messages.push(
            {
              text: "Поле текущего пароля обязательно для заполнения!"
            }
        );
      }
      if (!this.newPassword) {
        this.messages_data.messages.push(
            {
              text: "Поле нового пароля обязательно для заполнения!"
            }
        );
      }
      if (!this.confirmNewPassword) {
        this.messages_data.messages.push(
            {
              text: "Поле подтверждения пароля обязательно для заполнения!"
            }
        );
      }

      if (this.newPassword && this.newPassword.length < 6) {
        this.messages_data.messages.push(
            {
              text: "Новый пароль не должен быть короче 6 символов!"
            }
        );
      }
      if (this.newPassword && this.confirmNewPassword && (this.newPassword !== this.confirmNewPassword)) {
        this.messages_data.messages.push(
            {
              text: "Новые пароли не совпадают!"
            }
        );
      }
      if (this.newPassword && !rightPassword.test(this.newPassword)) {
        this.messages_data.messages.push(
            {
              text: "Пароль должен состоять только из латинских букв и цифр, символов подчеркивания и тире!"
            }
        );
      }
      if (this.messages_data.messages.length === 0) {
        this.$http
            .post("/user/change-password/", {
              currentPassword: this.currentPassword,
              newPassword: this.newPassword,
              confirmNewPassword: this.confirmNewPassword
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.messages_data = {type: res.data.status, messages: res.data.messages}
                this.currentPassword = "";
                this.newPassword = "";
                this.confirmNewPassword = "";
              }
            })
            .catch(err => console.error(err));
      }
    },

    updateUser() {
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
      }
      this.isPassword = false;
      let [rightUsername, rightPhone, rightEmail] = [
        /^[a-zA-Z0-9_]{3,16}$/,
        /^[+]*[0-9]{0,3}[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
      ];
      if (!this.user.username) {
        this.messages_data.messages.push(
            {
              text: "Поле никнейма обязательно для заполнения!"
            }
        );
      }

      if (!this.user.email) {
        this.messages_data.messages.push(
            {
              text: "Поле 'почта' обязательно для заполнения!"
            }
        );
      }
      if (!this.user.phone) {
        this.messages_data.messages.push(
            {
              text: "Поле 'телефон' обязательно для заполнения!"
            }
        );
      }
      if (this.user.username && !rightUsername.test(this.user.username)) {
        this.messages_data.messages.push(
            {
              text: "Никнейм должен состоять только из латинских букв, цифр, символов подчеркивания длиной 3-16 символов!"
            }
        );
      }
      if (this.user.phone && !rightPhone.test(this.user.phone)) {
        this.messages_data.messages.push(
            {
              text: "Неверный формат телефона!"
            }
        );
      }
      if (this.user.email && !rightEmail.test(this.user.email)) {
        this.messages_data.messages.push(
            {
              text: "Неверный формат почты!"
            }
        );
      }
      if (this.messages_data.messages.length === 0) {
        this.$http
            .post("/user/update-user/", {
              username: this.user.username,
              phone: this.user.phone,
              email: this.user.email
            })
            .then(res => {
              if (res.data.isLoggedIn === false) {
                breakAuth.breakAuth(res);
              } else {
                this.messages_data = {type: res.data.status, messages: res.data.messages};
                if (res.data.status === "success") {
                  this.SET_USER({
                    username: res.data.user.username,
                    email: res.data.user.email,
                    phone: res.data.user.phone
                  })
                  this.user = store.getters.USER;
                }
              }
            })
            .catch(err => console.error(err));
      }
    },

    deleteUser() {
      console.log(this.messages_data);
      if (this.messages_data.messages.length !== 0) {
        this.messages_data = {type: "warning", messages: []};
        console.log(this.messages_data);
      }
      const username = prompt("Введите ваш никнейм", "");
      if (username === store.getters.USER.username) {
        const deleteMyAccount = prompt("Чтобы подтвердить, введите 'delete my account'", "");
        if (deleteMyAccount === "delete my account") {
          this.$http
              .get("/user/delete-user/")
              .then(res => {
                breakAuth.breakAuth(res);
              })
              .catch(err => console.error(err));
        } else {
          this.messages_data.messages.push({text: "Неверно введена фраза!"});
        }
      } else {
        this.messages_data.messages.push({text: "Неверно введен никнейм!"});
      }
    }
  }

}
</script>